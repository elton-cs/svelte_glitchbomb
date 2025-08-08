<script lang="ts">
  import { createInitialGameState } from '../game/state.js';
  import { getLevelMilestone } from '../game/levels.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import BagView from './BagView.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';

  let gameState = $state(createInitialGameState());
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-6xl mx-auto">
    <header class="text-center mb-6">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Glitch Bomb</h1>
      <p class="text-gray-600">A bag-building, luck-based game</p>
    </header>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Stats & Bag -->
      <div class="space-y-6">
        <StatsDisplay {gameState} />
        <BagView {gameState} />
      </div>
      
      <!-- Center Column: Marketplace & Game Info -->
      <div class="space-y-6">
        <MarketplaceView {gameState} />
        
        {#if gameState.phase === 'menu'}
          <div class="bg-blue-50 p-4 rounded border border-blue-200">
            <h3 class="font-bold text-blue-800 mb-2">How to Play</h3>
            <div class="text-sm text-blue-700 space-y-1">
              <p>• Start a game for 5 moonrocks</p>
              <p>• Pull orbs to gain health (+1) or points (+5)</p>
              <p>• Avoid bombs (-2 health)</p>
              <p>• Reach level milestones: 10→20→30→40→50 points</p>
              <p>• Buy more orbs in marketplace between levels</p>
              <p>• Cash out anytime or complete all 5 levels</p>
            </div>
          </div>
        {/if}
        
        {#if gameState.phase === 'level'}
          <div class="bg-yellow-50 p-4 rounded border border-yellow-200">
            <h3 class="font-bold text-yellow-800 mb-2">Level {gameState.currentLevel}</h3>
            <div class="text-sm text-yellow-700">
              <p>Goal: Reach {gameState.playerStats.points}/{getLevelMilestone(gameState.currentLevel)} points</p>
              <p>Keep pulling orbs until you reach the milestone!</p>
              {#if gameState.playerStats.health <= 2}
                <p class="text-red-600 font-medium mt-1">⚠️ Low health! Be careful of bombs.</p>
              {/if}
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Right Column: Actions -->
      <div>
        <ActionsPanel {gameState} />
      </div>
    </div>
  </div>
</div>