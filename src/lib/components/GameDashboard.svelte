<script lang="ts">
  import { createInitialGameState, claimFreeRocks, saveMoonrocks } from '../game/state.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import BagView from './BagView.svelte';
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
      <h1 class="text-2xl font-bold text-gray-800">GLITCH BOMB</h1>
      <p class="text-sm text-gray-600">BAG-BUILDING LUCK GAME</p>
      
      <!-- Dev Mode Toggle - positioned in top right -->
      <button 
        onclick={toggleDevMode}
        class="absolute top-0 right-0 text-xs px-2 py-1 rounded border {devMode ? 'bg-gray-900 text-red-400 border-gray-700' : 'bg-black text-gray-400 border-white'} hover:opacity-80 transition-colors"
      >
        {devMode ? 'DEV ON' : 'DEV'}
      </button>
    </header>
    
    <!-- Top Row: Moonrocks and Dev Tools -->
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Moonrocks - Separate section -->
      <div class="bg-white p-3 rounded-lg shadow-sm border flex-1 min-w-64">
        <div class="flex justify-between items-center">
          <div class="text-sm font-bold text-white">MOONROCKS</div>
          <div class="text-xl font-bold text-white">{gameState.playerStats.moonrocks}</div>
        </div>
        {#if canClaimRocks}
          <div class="mt-2 pt-2 border-t border-gray-200">
            <button 
              onclick={handleClaimRocks}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              CLAIM 1000 FREE ROCKS!
            </button>
          </div>
        {/if}
      </div>

      <!-- Dev Mode Panel -->
      {#if devMode}
        <div class="bg-red-50 p-3 rounded-lg shadow-sm border border-red-200 flex-1 min-w-64">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-red-800 text-sm">🔧 DEVELOPER TOOLS</h3>
            <span class="text-xs text-red-600">DEBUG MODE</span>
          </div>
          
          <div class="space-y-2">
            <button 
              onclick={resetMoonrocks}
              class="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
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
