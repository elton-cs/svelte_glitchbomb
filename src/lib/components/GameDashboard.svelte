<script lang="ts">
  import { createInitialGameState, claimFreeRocks, saveMoonrocks } from '../game/state.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import HowToPlaySection from './HowToPlaySection.svelte';

  let gameState = $state(createInitialGameState());
  let devMode = $state(false);
  
  function handleClaimRocks() {
    const newAmount = claimFreeRocks(gameState.playerStats.moonrocks);
    gameState.playerStats.moonrocks = newAmount;
  }
  
  function resetMoonrocks() {
    gameState.playerStats.moonrocks = 0;
  }
  
  function toggleDevMode() {
    devMode = !devMode;
  }
  
  // Save moonrocks whenever they change
  $effect(() => {
    saveMoonrocks(gameState.playerStats.moonrocks);
  });
  
  const canClaimRocks = $derived(gameState.playerStats.moonrocks < 100);
  
</script>

<div class="min-h-screen bg-black p-3">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-6 relative">
      <h1 class="text-2xl font-bold text-white">GLITCH BOMB</h1>
      <p class="text-sm text-white">BAG-BUILDING LUCK-BASED GAME</p>
      
      <!-- Dev Mode Toggle - positioned in top right -->
      <button 
        onclick={toggleDevMode}
        class="absolute top-0 right-0 text-xs px-2 py-1 rounded border {devMode ? 'bg-black text-white border-white' : 'bg-black text-white border-white'} hover:opacity-80 transition-colors"
      >
        {devMode ? 'DEV ON' : 'DEV'}
      </button>
    </header>
    
    <!-- Top Row: Moonrocks and Dev Tools -->
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Moonrocks - Separate section -->
      <div class="bg-black p-3 rounded-lg shadow-sm border border-white flex-1 min-w-64">
        <div class="flex justify-between items-center">
          <div class="text-sm font-bold text-white">MOONROCKS</div>
          <div class="text-xl font-bold text-white">{gameState.playerStats.moonrocks}</div>
        </div>
        {#if canClaimRocks}
          <div class="mt-2 pt-2 border-t border-white">
            <button 
              onclick={handleClaimRocks}
              class="w-full bg-black hover:bg-white hover:text-black border border-white text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              CLAIM 1000 FREE ROCKS!
            </button>
          </div>
        {/if}
      </div>

      <!-- Dev Mode Panel -->
      {#if devMode}
        <div class="bg-black p-3 rounded-lg shadow-sm border border-white flex-1 min-w-64">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-white text-sm">🔧 DEVELOPER TOOLS</h3>
            <span class="text-xs text-white">DEBUG MODE</span>
          </div>
          
          <div class="space-y-2">
            <button 
              onclick={resetMoonrocks}
              class="w-full bg-black hover:bg-white hover:text-black border border-white text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              RESET MOONROCKS TO 0
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Main Game UI Flex Container -->
    <div class="flex flex-wrap gap-4 items-stretch">
      <!-- Player Stats Section -->
      <div class="flex-1 min-w-80 h-96">
        <div class="h-full">
          <PlayerStatsSection {gameState} />
        </div>
      </div>

      <!-- Actions Panel - Prominent placement -->
      <div class="flex-1 min-w-80 h-96">
        <div class="h-full">
          <ActionsPanel {gameState} />
        </div>
      </div>

      <!-- Marketplace -->
      <div class="flex-1 min-w-80 h-96">
        <div class="h-full">
          <MarketplaceView {gameState} />
        </div>
      </div>

      <!-- Orb Bag Section -->
      <div class="flex-1 min-w-80 h-96">
        <div class="h-full">
          <OrbBagSection {gameState} />
        </div>
      </div>

      <!-- How to Play Section -->
      <div class="flex-1 min-w-80 h-96">
        <div class="h-full">
          <HowToPlaySection />
        </div>
      </div>
    </div>
  </div>
</div>
