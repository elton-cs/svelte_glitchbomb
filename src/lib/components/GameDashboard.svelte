<script lang="ts">
  import { createInitialGameState, claimFreeBytes, saveGlitchbytes } from '../game/state.js';
  import { audioManager } from '../utils/audio.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import GameLogSection from './GameLogSection.svelte';
  import ProfitLossPanel from './ProfitLossPanel.svelte';

  interface Props {
    devMode: boolean;
  }

  let { devMode }: Props = $props();
  let gameState = $state(createInitialGameState());
  let musicEnabled = $state(false);
  
  function handleClaimBytes() {
    const newAmount = claimFreeBytes(gameState.playerStats.glitchbytes);
    gameState.playerStats.glitchbytes = newAmount;
  }
  
  function resetGlitchbytes() {
    gameState.playerStats.glitchbytes = 0;
  }
  
  function toggleMusic() {
    if (!musicEnabled) {
      audioManager.enableAudioOnUserInteraction();
      audioManager.playBackgroundMusic();
      musicEnabled = true;
    } else {
      audioManager.stopBackgroundMusic();
      musicEnabled = false;
    }
  }
  
  // Save glitchbytes whenever they change
  $effect(() => {
    saveGlitchbytes(gameState.playerStats.glitchbytes);
  });
  
  const canClaimBytes = $derived(gameState.playerStats.glitchbytes < 100);
  
  // Initialize background music when component mounts
  $effect(() => {
    audioManager.initializeBackgroundMusic('/sounds/thepilot.mp3');
    
    return () => {
      audioManager.cleanup();
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
          <div class="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center justify-center gap-2">
            {gameState.playerStats.glitchbytes}<span class="text-3xl sm:text-4xl">👾</span>
          </div>
          <div class="text-white text-xs tracking-wide">GLITCH BYTES</div>
        </div>
        
        <!-- Right: Action Buttons -->
        <div class="flex flex-col items-center sm:items-end gap-2">
          <!-- Music Toggle (always visible) -->
          <button 
            onclick={toggleMusic}
            class="bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-medium py-1 px-2 rounded transition-colors whitespace-nowrap"
          >
            {musicEnabled ? '🔊 MUSIC ON' : '🔇 MUSIC OFF'}
          </button>
          
          {#if devMode}
            <div class="text-xs text-gray-400 uppercase tracking-wide">dev tools</div>
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
          {/if}
        </div>
      </div>
    </div>

    <!-- Main Game UI - Responsive Layout -->
    <div class="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4 min-h-[800px] lg:h-[800px]">
      <!-- Mobile: Stack vertically, Desktop: 2x3 Grid -->
      
      <!-- Top Row: Actions | Player Stats | Glitch Rift -->
      <div class="flex flex-col min-h-[200px] lg:h-full">
        <ActionsPanel {gameState} />
      </div>

      <div class="flex flex-col min-h-[250px] lg:h-full">
        <PlayerStatsSection {gameState} />
      </div>

      <div class="flex flex-col min-h-[250px] lg:h-full">
        <OrbBagSection {gameState} />
      </div>

      <!-- Bottom Row: Mod Shop | P/L | Game Log -->
      <div class="flex flex-col min-h-[250px] lg:h-full">
        <MarketplaceView {gameState} />
      </div>

      <div class="flex flex-col min-h-[200px] lg:h-full">
        <ProfitLossPanel {gameState} />
      </div>

      <div class="flex flex-col min-h-[200px] lg:h-full">
        <GameLogSection {gameState} />
      </div>
    </div>
  </div>
</div>
