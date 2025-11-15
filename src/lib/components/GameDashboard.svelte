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
  let activeTab = $state<'stats' | 'rift' | 'shop' | 'profit' | 'log'>('stats');
  
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

    <!-- Tab Content (Middle Panel) -->
    <div class="flex-1 mb-4">
      {#if activeTab === 'stats'}
        <PlayerStatsSection {gameState} />
      {:else if activeTab === 'rift'}
        <OrbBagSection {gameState} />
      {:else if activeTab === 'shop'}
        <MarketplaceView {gameState} />
      {:else if activeTab === 'profit'}
        <ProfitLossPanel {gameState} />
      {:else if activeTab === 'log'}
        <GameLogSection {gameState} />
      {/if}
    </div>

    <!-- Actions Panel -->
    <div class="mb-4">
      <ActionsPanel {gameState} bind:showMatrixWarning />
    </div>

    <!-- Bottom Tab Bar -->
    <div class="bg-black border-t border-white p-3">
      <div class="flex justify-center gap-2 flex-wrap">
        <button 
          class="px-4 py-2 rounded font-medium text-xs sm:text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'stats'}
          class:text-black={activeTab === 'stats'}
          class:bg-black={activeTab !== 'stats'}
          class:text-white={activeTab !== 'stats'}
          class:hover:bg-white={activeTab !== 'stats'}
          class:hover:text-black={activeTab !== 'stats'}
          onclick={() => activeTab = 'stats'}
        >
          Stats
        </button>
        <button 
          class="px-4 py-2 rounded font-medium text-xs sm:text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'rift'}
          class:text-black={activeTab === 'rift'}
          class:bg-black={activeTab !== 'rift'}
          class:text-white={activeTab !== 'rift'}
          class:hover:bg-white={activeTab !== 'rift'}
          class:hover:text-black={activeTab !== 'rift'}
          onclick={() => activeTab = 'rift'}
        >
          Rift
        </button>
        <button 
          class="px-4 py-2 rounded font-medium text-xs sm:text-sm transition-colors border border-white uppercase tracking-wide"
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
          class="px-4 py-2 rounded font-medium text-xs sm:text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'profit'}
          class:text-black={activeTab === 'profit'}
          class:bg-black={activeTab !== 'profit'}
          class:text-white={activeTab !== 'profit'}
          class:hover:bg-white={activeTab !== 'profit'}
          class:hover:text-black={activeTab !== 'profit'}
          onclick={() => activeTab = 'profit'}
        >
          Profit
        </button>
        <button 
          class="px-4 py-2 rounded font-medium text-xs sm:text-sm transition-colors border border-white uppercase tracking-wide"
          class:bg-white={activeTab === 'log'}
          class:text-black={activeTab === 'log'}
          class:bg-black={activeTab !== 'log'}
          class:text-white={activeTab !== 'log'}
          class:hover:bg-white={activeTab !== 'log'}
          class:hover:text-black={activeTab !== 'log'}
          onclick={() => activeTab = 'log'}
        >
          Log
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
