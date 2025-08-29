<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { createInitialGameState, claimFreeBytes, saveGlitchbytes, addStructuredLogEntry } from '../game/state.js';
  import { continueToMarketplace, cashOutPostLevel } from '../game/game.js';
  import { addOrbsToBag } from '../game/orbs.js';
  import { audioManager } from '../utils/audio.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import GameLogSection from './GameLogSection.svelte';
  import ProfitLossPanel from './ProfitLossPanel.svelte';
  import MatrixDisarrayWarning from './MatrixDisarrayWarning.svelte';

  interface Props {
    devMode: boolean;
  }

  let { devMode }: Props = $props();
  let gameState = $state(createInitialGameState());
  
  // Matrix disarray warning state
  let showMatrixWarning = $state(false);
  
  function handleAcceptDisarray() {
    showMatrixWarning = false;
    gameState.matrixDisarrayActive = true;
    
    // Add the 2-damage bomb orb to the glitch rift
    addOrbsToBag(gameState.orbBag, 'bomb', 1, 2);
    
    // Log the matrix disarray activation
    addStructuredLogEntry(gameState, {
      type: 'system',
      data: {
        message: 'Matrix disarray accepted - 2-damage bomb added to glitch rift',
        level: 'warning'
      }
    });
    
    // Continue to marketplace normally
    continueToMarketplace(gameState);
  }
  
  function handleCacheOutFromWarning() {
    showMatrixWarning = false;
    cashOutPostLevel(gameState);
  }
  
  // Track previous value to detect increase/decrease
  let previousGlitchBytes = $state(gameState.playerStats.glitchbytes);
  let animationColor = $state<'neutral' | 'increase' | 'decrease'>('neutral');
  
  // Animated glitch bytes counter
  const animatedGlitchBytes = tweened(gameState.playerStats.glitchbytes, {
    duration: 800,
    easing: cubicOut
  });
  
  function handleClaimBytes() {
    const newAmount = claimFreeBytes(gameState.playerStats.glitchbytes);
    gameState.playerStats.glitchbytes = newAmount;
  }
  
  function resetGlitchbytes() {
    gameState.playerStats.glitchbytes = 0;
  }
  
  // Save glitchbytes whenever they change
  $effect(() => {
    saveGlitchbytes(gameState.playerStats.glitchbytes);
  });
  
  // Update animated glitch bytes when value changes
  $effect(() => {
    const currentValue = gameState.playerStats.glitchbytes;
    
    // Skip comparison on initial load (when both values are the same initially)
    if (previousGlitchBytes !== currentValue) {
      // Determine color based on change direction
      if (currentValue > previousGlitchBytes) {
        animationColor = 'increase';
      } else if (currentValue < previousGlitchBytes) {
        animationColor = 'decrease';
      }
      
      // Reset color after animation completes
      setTimeout(() => {
        animationColor = 'neutral';
      }, 800); // Match animation duration
    }
    
    // Update previous value and start animation
    previousGlitchBytes = currentValue;
    animatedGlitchBytes.set(currentValue);
  });
  
  const canClaimBytes = $derived(gameState.playerStats.glitchbytes < 100);
  
  // Initialize background music when component mounts
  $effect(() => {
    audioManager.initializeBackgroundMusic('/sounds/thepilot.mp3').then(() => {
      audioManager.playBackgroundMusic();
    });
    
    // Preload sound effects
    audioManager.preloadSoundEffect('click', '/sounds/click.wav');
    audioManager.preloadSoundEffect('buy', '/sounds/buy.wav');
    audioManager.preloadSoundEffect('pointsbar', '/sounds/pointsbar.wav');
    audioManager.preloadSoundEffect('bomb1', '/sounds/bomb1.wav');
    audioManager.preloadSoundEffect('endgame', '/sounds/endgame.wav');
    audioManager.preloadSoundEffect('levelup', '/sounds/levelup.wav');
    audioManager.preloadSoundEffect('nextlevel', '/sounds/nextlevel.wav');
    audioManager.preloadSoundEffect('multiplier', '/sounds/multiplier.wav');
    audioManager.preloadSoundEffect('specialpull', '/sounds/specialpull.wav');
    
    // Add global click listener to enable audio on first user interaction
    function handleFirstInteraction() {
      audioManager.enableAudioOnUserInteraction();
      audioManager.playBackgroundMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    }
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      audioManager.cleanup();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  });
  
</script>

<div class="bg-black p-3">
  <div class="max-w-7xl mx-auto">

    <!-- Top Bar with Glitch Bytes -->
    <div class="bg-black p-3 rounded-lg shadow-sm border border-white mb-4">
      <div class="flex flex-col sm:grid sm:grid-cols-3 items-center gap-3 sm:gap-0">
        <!-- Left: Empty space on desktop -->
        <div class="hidden sm:block"></div>
        
        <!-- Center: Glitch Bytes Display -->
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold mb-1 flex items-center justify-center gap-2 {animationColor === 'increase' ? 'text-green-400' : animationColor === 'decrease' ? 'text-red-400' : 'text-white'}">
            {Math.round($animatedGlitchBytes)}<span class="text-3xl sm:text-4xl">👾</span>
          </div>
          <div class="text-white text-xs tracking-wide">GLITCH BYTES</div>
        </div>
        
        <!-- Right: Action Buttons -->
        <div class="flex flex-col items-center sm:items-end gap-2">
          <div class="flex gap-2">
            {#if canClaimBytes}
              <button 
                onclick={handleClaimBytes}
                class="bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-medium py-1 px-2 rounded transition-colors whitespace-nowrap"
              >
                CLAIM FREE
              </button>
            {/if}
            <button 
              onclick={resetGlitchbytes}
              class="bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-medium py-1 px-2 rounded transition-colors whitespace-nowrap"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Game UI - Responsive Layout -->
    <div class="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4 min-h-[800px] lg:h-[800px] relative">
      <!-- Mobile: Stack vertically, Desktop: 2x3 Grid -->
      
      <!-- Top Row: Actions | Player Stats | P/L -->
      <div class="flex flex-col min-h-[200px] lg:h-full">
        <ActionsPanel {gameState} {devMode} bind:showMatrixWarning />
      </div>

      <div class="flex flex-col min-h-[250px] lg:h-full">
        <PlayerStatsSection {gameState} />
      </div>

      <div class="flex flex-col min-h-[250px] lg:h-full">
        <ProfitLossPanel {gameState} />
      </div>

      <!-- Bottom Row: Mod Shop | Glitch Rift | Game Log -->
      <div class="flex flex-col min-h-[250px] lg:h-full">
        <MarketplaceView {gameState} />
      </div>

      <div class="flex flex-col min-h-[200px] lg:h-full">
        <OrbBagSection {gameState} />
      </div>

      <div class="flex flex-col min-h-[200px] lg:h-full">
        <GameLogSection {gameState} />
      </div>
      
      <!-- Matrix Disarray Warning Modal - Overlays entire game area -->
      {#if showMatrixWarning}
        <MatrixDisarrayWarning 
          onAccept={handleAcceptDisarray}
          onCacheOut={handleCacheOutFromWarning}
          playerPoints={gameState.playerStats.points}
        />
      {/if}
    </div>
  </div>
</div>
