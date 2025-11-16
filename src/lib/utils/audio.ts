/**
 * AudioManager using Web Audio API for optimal performance and control
 * 
 * Features:
 * - Web Audio API for sound effects (better performance, multiple simultaneous plays)
 * - HTML5 Audio for background music (better for streaming long audio)
 * - Audio buffer caching for instant playback
 * - Proper volume control and mixing
 * - User interaction handling for autoplay policies
 */

interface SoundEffectConfig {
	buffer: AudioBuffer | null;
	volume: number;
}

class AudioManager {
	private audioContext: AudioContext | null = null;
	private backgroundMusic: HTMLAudioElement | null = null;
	private soundEffects: Map<string, SoundEffectConfig> = new Map();
	private hasUserInteracted = false;
	private pendingPlay = false;
	
	// Master volume controls
	private masterVolume = 1.0;
	private musicVolume = 0.6;
	private sfxVolume = 0.8;
	
	// Gain nodes for mixing
	private masterGainNode: GainNode | null = null;

	/**
	 * Initialize the AudioContext (called on first user interaction)
	 */
	private initializeAudioContext(): void {
		if (this.audioContext) return;
		
		// Create AudioContext (works across browsers)
		this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		
		// Create master gain node for overall volume control
		this.masterGainNode = this.audioContext.createGain();
		this.masterGainNode.gain.value = this.masterVolume;
		this.masterGainNode.connect(this.audioContext.destination);
		
		console.log('Web Audio API initialized');
	}

	/**
	 * Initialize background music (uses HTML5 Audio for streaming)
	 */
	async initializeBackgroundMusic(src: string): Promise<void> {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
			this.backgroundMusic = null;
		}

		this.backgroundMusic = new Audio(src);
		this.backgroundMusic.loop = true;
		this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
		this.backgroundMusic.preload = 'auto';

		try {
			await this.backgroundMusic.load();
		} catch (error) {
			console.warn('Failed to load background music:', error);
		}
	}

	/**
	 * Play background music
	 */
	async playBackgroundMusic(): Promise<void> {
		if (!this.backgroundMusic) return;

		if (!this.hasUserInteracted) {
			this.pendingPlay = true;
			return;
		}

		try {
			await this.backgroundMusic.play();
			this.pendingPlay = false;
		} catch (error) {
			console.warn('Failed to play background music:', error);
		}
	}

	/**
	 * Enable audio on first user interaction (required by browser autoplay policies)
	 */
	enableAudioOnUserInteraction(): void {
		if (this.hasUserInteracted) return;
		
		this.hasUserInteracted = true;
		this.initializeAudioContext();
		
		// Resume AudioContext if suspended (required by some browsers)
		if (this.audioContext?.state === 'suspended') {
			this.audioContext.resume();
		}
		
		// Play pending background music
		if (this.pendingPlay && this.backgroundMusic) {
			this.playBackgroundMusic();
		}
	}

	/**
	 * Stop background music
	 */
	stopBackgroundMusic(): void {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
			this.backgroundMusic.currentTime = 0;
		}
	}

	/**
	 * Pause background music (can be resumed)
	 */
	pauseBackgroundMusic(): void {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
		}
	}

	/**
	 * Resume background music
	 */
	resumeBackgroundMusic(): void {
		if (this.backgroundMusic && this.hasUserInteracted) {
			this.backgroundMusic.play().catch(error => {
				console.warn('Failed to resume background music:', error);
			});
		}
	}

	/**
	 * Set background music volume (0.0 - 1.0)
	 */
	setBackgroundVolume(volume: number): void {
		this.musicVolume = Math.max(0, Math.min(1, volume));
		if (this.backgroundMusic) {
			this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
		}
	}

	/**
	 * Set sound effects volume (0.0 - 1.0)
	 */
	setSFXVolume(volume: number): void {
		this.sfxVolume = Math.max(0, Math.min(1, volume));
	}

	/**
	 * Set master volume (0.0 - 1.0)
	 */
	setMasterVolume(volume: number): void {
		this.masterVolume = Math.max(0, Math.min(1, volume));
		
		// Update background music volume
		if (this.backgroundMusic) {
			this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
		}
		
		// Update master gain node
		if (this.masterGainNode) {
			this.masterGainNode.gain.value = this.masterVolume;
		}
	}

	/**
	 * Preload a sound effect using Web Audio API
	 */
	preloadSoundEffect(name: string, src: string, defaultVolume: number = 0.5): void {
		fetch(src)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => {
				// Store temporarily - will decode when AudioContext is ready
				this.soundEffects.set(name, {
					buffer: null,
					volume: defaultVolume,
				});
				
				// Decode immediately if AudioContext exists
				if (this.audioContext) {
					return this.audioContext.decodeAudioData(arrayBuffer)
						.then(audioBuffer => {
							const config = this.soundEffects.get(name);
							if (config) {
								config.buffer = audioBuffer;
							}
							console.log(`Preloaded sound effect: ${name}`);
						});
				} else {
					// Store raw data to decode later when context is initialized
					(this.soundEffects.get(name) as any).arrayBuffer = arrayBuffer;
					console.log(`Queued sound effect for decoding: ${name}`);
				}
			})
			.catch(error => {
				console.warn(`Failed to preload sound effect ${name}:`, error);
			});
	}

	/**
	 * Play a sound effect using Web Audio API
	 * Creates a new source each time for concurrent playback
	 */
	async playSoundEffect(name: string, volumeOverride?: number): Promise<void> {
		if (!this.audioContext || !this.masterGainNode) {
			console.warn('AudioContext not initialized - user interaction required');
			return;
		}

		const config = this.soundEffects.get(name);
		if (!config) {
			console.warn(`Sound effect not found: ${name}`);
			return;
		}

		// Decode buffer if not yet decoded (lazy decoding)
		if (!config.buffer && (config as any).arrayBuffer) {
			try {
				config.buffer = await this.audioContext.decodeAudioData((config as any).arrayBuffer);
				delete (config as any).arrayBuffer;
			} catch (error) {
				console.warn(`Failed to decode audio buffer for ${name}:`, error);
				return;
			}
		}

		if (!config.buffer) {
			console.warn(`Audio buffer not ready for ${name}`);
			return;
		}

		try {
			// Create a new buffer source for this playback
			const source = this.audioContext.createBufferSource();
			source.buffer = config.buffer;

			// Create gain node for individual sound volume control
			const gainNode = this.audioContext.createGain();
			const volume = volumeOverride ?? config.volume;
			gainNode.gain.value = volume * this.sfxVolume;

			// Connect: source -> gain -> master -> destination
			source.connect(gainNode);
			gainNode.connect(this.masterGainNode);

			// Play the sound
			source.start(0);

			// Cleanup: source nodes are one-time use
			source.onended = () => {
				source.disconnect();
				gainNode.disconnect();
			};
		} catch (error) {
			console.warn(`Failed to play sound effect ${name}:`, error);
		}
	}

	/**
	 * Play a sound effect with pitch variation for variety
	 */
	async playSoundEffectWithPitch(name: string, pitchVariation: number = 0.1, volumeOverride?: number): Promise<void> {
		if (!this.audioContext || !this.masterGainNode) {
			console.warn('AudioContext not initialized - user interaction required');
			return;
		}

		const config = this.soundEffects.get(name);
		if (!config || !config.buffer) {
			console.warn(`Sound effect not ready: ${name}`);
			return;
		}

		try {
			const source = this.audioContext.createBufferSource();
			source.buffer = config.buffer;

			// Random pitch variation (0.9 - 1.1 with default variation)
			source.playbackRate.value = 1 + (Math.random() - 0.5) * pitchVariation * 2;

			const gainNode = this.audioContext.createGain();
			const volume = volumeOverride ?? config.volume;
			gainNode.gain.value = volume * this.sfxVolume;

			source.connect(gainNode);
			gainNode.connect(this.masterGainNode);
			source.start(0);

			source.onended = () => {
				source.disconnect();
				gainNode.disconnect();
			};
		} catch (error) {
			console.warn(`Failed to play sound effect with pitch ${name}:`, error);
		}
	}

	/**
	 * Cleanup all audio resources
	 */
	cleanup(): void {
		this.stopBackgroundMusic();
		
		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}
		
		this.masterGainNode = null;
		this.soundEffects.clear();
		this.hasUserInteracted = false;
		this.pendingPlay = false;
	}

	/**
	 * Get current AudioContext state (for debugging)
	 */
	getAudioContextState(): string {
		return this.audioContext?.state ?? 'not initialized';
	}

	/**
	 * Check if audio is ready to play
	 */
	isReady(): boolean {
		return this.hasUserInteracted && this.audioContext !== null;
	}
}

export const audioManager = new AudioManager();
