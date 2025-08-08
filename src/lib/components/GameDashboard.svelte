<script lang="ts">
  import { createInitialGameState } from '../game/state.js';
  import { getLevelMilestone } from '../game/levels.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import BagView from './BagView.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import { pullOrb } from '../game/game.js';

  let gameState = $state(createInitialGameState());
  
  function handlePullOrb() {
    pullOrb(gameState);
  }
  
  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
  
  const canPullOrb = $derived(gameState.phase === 'level' && totalAvailableOrbs > 0);
</script>

<div class="min-h-screen bg-gray-50 p-3">
  <div class="max-w-md mx-auto space-y-4">
    <!-- Header -->
    <header class="text-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800">Glitch Bomb</h1>
      <p class="text-sm text-gray-600">Bag-building luck game</p>
    </header>
    
    <!-- Stats - Compact horizontal layout -->
    <div class="bg-white p-3 rounded-lg shadow-sm border">
      <div class="grid grid-cols-3 gap-2 text-center text-xs mb-2">
        <div>
          <div class="text-lg font-bold text-blue-600">{gameState.playerStats.moonrocks}</div>
          <div class="text-gray-600">Rocks</div>
        </div>
        <div>
          <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
          <div class="text-gray-600">Cash</div>
        </div>
        <div>
          <div class="text-lg font-bold text-red-600">{gameState.playerStats.health}</div>
          <div class="text-gray-600">HP</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-center text-xs">
        <div>
          <div class="text-lg font-bold text-purple-600">{gameState.playerStats.points}</div>
          <div class="text-gray-600">Points</div>
        </div>
        <div>
          <div class="text-lg font-bold text-orange-600">{gameState.playerStats.levelMultiplier}×</div>
          <div class="text-gray-600">Mult</div>
        </div>
      </div>
    </div>

    <!-- Game Status Info -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium">Level {gameState.currentLevel}/5</span>
          <span class="text-gray-600">Goal: {getLevelMilestone(gameState.currentLevel)}</span>
        </div>
        <div class="mt-1">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
            ></div>
          </div>
        </div>
        {#if gameState.playerStats.health <= 2}
          <p class="text-red-600 font-medium text-xs mt-1">⚠️ Low health!</p>
        {/if}
      </div>
    {/if}

    <!-- Actions Panel - Prominent placement -->
    <ActionsPanel {gameState} />

    <!-- Marketplace -->
    <MarketplaceView {gameState} />

    <!-- Orb Bag - Compact design -->
    <div class="bg-white p-3 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium text-sm">Orb Bag ({totalAvailableOrbs})</h3>
        <button 
          onclick={handlePullOrb}
          disabled={!canPullOrb}
          class="px-3 py-1 text-xs font-medium rounded transition-colors
                 {canPullOrb 
                   ? 'bg-blue-600 text-white hover:bg-blue-700' 
                   : 'bg-gray-200 text-gray-500 cursor-not-allowed'}"
        >
          {canPullOrb ? 'Pull Orb' : 'Cannot Pull'}
        </button>
      </div>
      
      <div class="space-y-1 text-xs">
        <div class="flex justify-between">
          <span class="text-red-500">♥ Health:</span>
          <span>{gameState.orbBag.health.available.length}/{gameState.orbBag.health.total.length}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-purple-500">★ Points:</span>
          <span>{gameState.orbBag.point.available.length}/{gameState.orbBag.point.total.length}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-orange-500">💥 Bombs:</span>
          <span>{gameState.orbBag.bomb.available.length}/{gameState.orbBag.bomb.total.length}</span>
        </div>
        {#if gameState.orbBag.points_per_anyorb.total.length > 0}
          <div class="flex justify-between">
            <span class="text-blue-500">⚡ Any Orb:</span>
            <span>{gameState.orbBag.points_per_anyorb.available.length}/{gameState.orbBag.points_per_anyorb.total.length}</span>
          </div>
        {/if}
        {#if gameState.orbBag.points_per_bombpulled.total.length > 0}
          <div class="flex justify-between">
            <span class="text-yellow-500">🎯 Bomb Count:</span>
            <span>{gameState.orbBag.points_per_bombpulled.available.length}/{gameState.orbBag.points_per_bombpulled.total.length}</span>
          </div>
        {/if}
        {#if gameState.orbBag.multiplier.total.length > 0}
          <div class="flex justify-between">
            <span class="text-orange-500">⭐ Multiplier:</span>
            <span>{gameState.orbBag.multiplier.available.length}/{gameState.orbBag.multiplier.total.length}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- How to Play - Only show on menu, compact -->
    {#if gameState.phase === 'menu'}
      <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h3 class="font-medium text-blue-800 mb-1 text-sm">How to Play</h3>
        <div class="text-xs text-blue-700 space-y-0.5">
          <p>• Pull orbs: Health (+1), Points (+5), avoid Bombs (-2 HP)</p>
          <p>• Reach milestones: 12→18→28→44→66 points</p>
          <p>• Buy orbs between levels, cash out anytime</p>
        </div>
      </div>
    {/if}
  </div>
</div>