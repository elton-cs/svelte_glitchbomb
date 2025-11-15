<script lang="ts">
  import { createInitialGameState, addStructuredLogEntry } from '../game/state.js';
  import { continueToMarketplace, cashOutPostLevel } from '../game/game.js';
  import { addOrbsToBag } from '../game/orbs.js';
  import { audioManager } from '../utils/audio.js';
  import GlitchHeader from './GlitchHeader.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import ProfitLossPanel from './ProfitLossPanel.svelte';
  import GameLogSection from './GameLogSection.svelte';
  import MatrixDisarrayWarning from './MatrixDisarrayWarning.svelte';

  interface Props {
    devMode: boolean;
  }

  let { devMode }: Props = $props();
  let gameState = $state(createInitialGameState());
  
  // Active tab state
  let activeTab = $state<'shop' | 'info'>('shop');
  
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

<div class="bg-black p-3 flex flex-col min-h-screen">
  <div class="max-w-7xl mx-auto flex-1 flex flex-col w-full relative">

    <!-- Glitch Bytes Header -->
    <GlitchHeader {gameState} {devMode} />

    <!-- Player Stats Section -->
    <div class="mb-4">
      <PlayerStatsSection {gameState} />
    </div>

    <!-- Actions Panel -->
    <div class="mb-4">
      <ActionsPanel {gameState} bind:showMatrixWarning />
    </div>

    <!-- Tab Content -->
    <div class="flex-1 mb-4">
      {#if activeTab === 'shop'}
        <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 h-full">
          <div class="flex flex-col min-h-[200px]">
            <OrbBagSection {gameState} />
          </div>
          <div class="flex flex-col min-h-[250px]">
            <MarketplaceView {gameState} />
          </div>
        </div>
      {:else if activeTab === 'info'}
        <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 h-full">
          <div class="flex flex-col min-h-[250px]">
            <ProfitLossPanel {gameState} />
          </div>
          <div class="flex flex-col min-h-[200px]">
            <GameLogSection {gameState} />
          </div>
        </div>
      {/if}
    </div>

    <!-- Bottom Tab Bar -->
    <div class="bg-black border-t border-white p-3">
      <div class="flex justify-center gap-2">
        <button 
          class="px-6 py-3 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'shop'}
          class:text-black={activeTab === 'shop'}
          class:bg-black={activeTab !== 'shop'}
          class:text-white={activeTab !== 'shop'}
          class:hover:bg-white={activeTab !== 'shop'}
          class:hover:text-black={activeTab !== 'shop'}
          onclick={() => activeTab = 'shop'}
        >
          Shop
        </button>
        <button 
          class="px-6 py-3 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'info'}
          class:text-black={activeTab === 'info'}
          class:bg-black={activeTab !== 'info'}
          class:text-white={activeTab !== 'info'}
          class:hover:bg-white={activeTab !== 'info'}
          class:hover:text-black={activeTab !== 'info'}
          onclick={() => activeTab = 'info'}
        >
          Info
        </button>
      </div>
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
