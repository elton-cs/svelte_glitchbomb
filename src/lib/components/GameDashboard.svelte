<script lang="ts">
  import { createInitialGameState } from '../game/state.js';
  import { getLevelMilestone } from '../game/levels.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import BagView from './BagView.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';

  let gameState = $state(createInitialGameState());
  
  
  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
  
</script>

<div class="min-h-screen bg-gray-50 p-3">
  <div class="max-w-md mx-auto space-y-4">
    <!-- Header -->
    <header class="text-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800">Glitch Bomb</h1>
      <p class="text-sm text-gray-600">Bag-building luck game</p>
    </header>
    
    <!-- Moonrocks - Separate section -->
    <div class="bg-white p-3 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">Moonrocks</div>
        <div class="text-xl font-bold text-blue-600">{gameState.playerStats.moonrocks} 🌙</div>
      </div>
    </div>

    <!-- Stats - Compact horizontal layout - Only show when game started -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="grid grid-cols-3 gap-2 text-center text-xs mb-2">
          <div>
            <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
            <div class="text-gray-600">Cheddah</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">{gameState.currentLevel}</div>
            <div class="text-gray-600">Level</div>
          </div>
          <div>
            <div class="text-lg font-bold text-purple-600">{gameState.playerStats.points}</div>
            <div class="text-gray-600">Points</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div class="text-lg font-bold text-red-600">{gameState.playerStats.health}</div>
            <div class="text-gray-600">Health</div>
          </div>
          <div>
            <div class="text-lg font-bold text-orange-600">{gameState.playerStats.levelMultiplier}×</div>
            <div class="text-gray-600">Mult</div>
          </div>
          <div>
            <div class="text-lg font-bold text-gray-600">{getLevelMilestone(gameState.currentLevel)}</div>
            <div class="text-gray-600">Milestone</div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Health Status - Show when game started -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium">Health</span>
          <span class="text-gray-600">{gameState.playerStats.health}/5</span>
        </div>
        <div class="mt-1">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-red-600 h-2 rounded-full transition-all duration-300"
              style="width: {(gameState.playerStats.health / 5) * 100}%"
            ></div>
          </div>
        </div>
        {#if gameState.playerStats.health <= 2}
          <p class="text-red-600 font-medium text-xs mt-1">⚠️ Low health!</p>
        {/if}
      </div>
    {/if}

    <!-- Game Status Info -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium">Level {gameState.currentLevel}/5</span>
          <span class="text-gray-600">Milestone: {getLevelMilestone(gameState.currentLevel)}</span>
        </div>
        <div class="mt-1">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
            ></div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Actions Panel - Prominent placement -->
    <ActionsPanel {gameState} />

    <!-- Marketplace -->
    <MarketplaceView {gameState} />

    <!-- Orb Bag - Compact design -->
    <div class="bg-white p-3 rounded-lg shadow-sm border">
      <div class="mb-2">
        <h3 class="font-medium text-sm">Orb Bag ({totalAvailableOrbs})</h3>
      </div>
      
      <div class="space-y-2 text-xs">
        <!-- Health Orbs -->
        <div class="flex justify-between items-center {gameState.orbBag.health.available.length === 0 ? 'opacity-50' : ''}">
          <span class="font-medium text-red-500">♥ Health Orbs:</span>
          <div class="text-right">
            <span class="font-bold">{gameState.orbBag.health.available.length}</span>
            {#if gameState.orbBag.health.available.length > 0}
              <span class="text-gray-600">({gameState.orbBag.health.available.map(orb => `+${orb.amount}`).join(', ')})</span>
            {/if}
            <span class="text-gray-500">/ {gameState.orbBag.health.total.length}</span>
          </div>
        </div>
        
        <!-- Point Orbs -->
        <div class="flex justify-between items-center {gameState.orbBag.point.available.length === 0 ? 'opacity-50' : ''}">
          <span class="font-medium text-purple-500">★ Point Orbs:</span>
          <div class="text-right">
            <span class="font-bold">{gameState.orbBag.point.available.length}</span>
            {#if gameState.orbBag.point.available.length > 0}
              <span class="text-gray-600">({gameState.orbBag.point.available.map(orb => `+${orb.amount}`).join(', ')})</span>
            {/if}
            <span class="text-gray-500">/ {gameState.orbBag.point.total.length}</span>
          </div>
        </div>
        
        <!-- Bomb Orbs -->
        <div class="flex justify-between items-center {gameState.orbBag.bomb.available.length === 0 ? 'opacity-50' : ''}">
          <span class="font-medium text-orange-500">💥 Bomb Orbs:</span>
          <div class="text-right">
            <span class="font-bold">{gameState.orbBag.bomb.available.length}</span>
            {#if gameState.orbBag.bomb.available.length > 0}
              <span class="text-gray-600">({gameState.orbBag.bomb.available.map(orb => `-${orb.amount}`).join(', ')})</span>
            {/if}
            <span class="text-gray-500">/ {gameState.orbBag.bomb.total.length}</span>
          </div>
        </div>
        
        <!-- Points Per Any Orb -->
        {#if gameState.orbBag.points_per_anyorb.total.length > 0}
          <div class="flex justify-between items-center {gameState.orbBag.points_per_anyorb.available.length === 0 ? 'opacity-50' : ''}">
            <span class="font-medium text-blue-500">⚡ Points Per Any Orb:</span>
            <div class="text-right">
              <span class="font-bold">{gameState.orbBag.points_per_anyorb.available.length}</span>
              {#if gameState.orbBag.points_per_anyorb.available.length > 0}
                <span class="text-gray-600">({gameState.orbBag.points_per_anyorb.available[0].amount}×{totalAvailableOrbs - 1} = {gameState.orbBag.points_per_anyorb.available[0].amount * (totalAvailableOrbs - 1)} pts)</span>
              {/if}
              <span class="text-gray-500">/ {gameState.orbBag.points_per_anyorb.total.length}</span>
            </div>
          </div>
        {/if}
        
        <!-- Points Per Bomb Pulled -->
        {#if gameState.orbBag.points_per_bombpulled.total.length > 0}
          <div class="flex justify-between items-center {gameState.orbBag.points_per_bombpulled.available.length === 0 ? 'opacity-50' : ''}">
            <span class="font-medium text-yellow-500">🎯 Points Per Bomb Pulled:</span>
            <div class="text-right">
              <span class="font-bold">{gameState.orbBag.points_per_bombpulled.available.length}</span>
              {#if gameState.orbBag.points_per_bombpulled.available.length > 0}
                <span class="text-gray-600">({gameState.orbBag.points_per_bombpulled.available[0].amount}×{gameState.playerStats.bombsPulledThisLevel} = {gameState.orbBag.points_per_bombpulled.available[0].amount * gameState.playerStats.bombsPulledThisLevel} pts)</span>
              {/if}
              <span class="text-gray-500">/ {gameState.orbBag.points_per_bombpulled.total.length}</span>
            </div>
          </div>
        {/if}
        
        <!-- Multiplier Orbs -->
        {#if gameState.orbBag.multiplier.total.length > 0}
          <div class="flex justify-between items-center {gameState.orbBag.multiplier.available.length === 0 ? 'opacity-50' : ''}">
            <span class="font-medium text-orange-500">⭐ Multiplier Orbs:</span>
            <div class="text-right">
              <span class="font-bold">{gameState.orbBag.multiplier.available.length}</span>
              {#if gameState.orbBag.multiplier.available.length > 0}
                <span class="text-gray-600">(+{gameState.orbBag.multiplier.available[0].amount}× boost)</span>
              {/if}
              <span class="text-gray-500">/ {gameState.orbBag.multiplier.total.length}</span>
            </div>
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
