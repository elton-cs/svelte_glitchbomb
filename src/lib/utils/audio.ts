class AudioManager {
	private backgroundMusic: HTMLAudioElement | null = null;
	private soundEffects: Map<string, HTMLAudioElement> = new Map();

	async initializeBackgroundMusic(src: string): Promise<void> {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
			this.backgroundMusic = null;
		}

		this.backgroundMusic = new Audio(src);
		this.backgroundMusic.loop = true;
		this.backgroundMusic.volume = 0.6;

		try {
			await this.backgroundMusic.load();
		} catch (error) {
			console.warn('Failed to load background music:', error);
		}
	}

	async playBackgroundMusic(): Promise<void> {
		if (!this.backgroundMusic) return;

		try {
			await this.backgroundMusic.play();
		} catch (error) {
			console.warn('Failed to play background music:', error);
		}
	}

	stopBackgroundMusic(): void {
		if (this.backgroundMusic) {
			this.backgroundMusic.pause();
			this.backgroundMusic.currentTime = 0;
		}
	}

	setBackgroundVolume(volume: number): void {
		if (this.backgroundMusic) {
			this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
		}
	}

	preloadSoundEffect(name: string, src: string): void {
		const audio = new Audio(src);
		audio.preload = 'auto';
		this.soundEffects.set(name, audio);
	}

	async playSoundEffect(name: string, volume: number = 0.5): Promise<void> {
		const sound = this.soundEffects.get(name);
		if (!sound) return;

		try {
			sound.currentTime = 0;
			sound.volume = Math.max(0, Math.min(1, volume));
			await sound.play();
		} catch (error) {
			console.warn(`Failed to play sound effect ${name}:`, error);
		}
	}

	cleanup(): void {
		this.stopBackgroundMusic();
		this.soundEffects.forEach(sound => {
			sound.pause();
		});
		this.soundEffects.clear();
	}
}

export const audioManager = new AudioManager();