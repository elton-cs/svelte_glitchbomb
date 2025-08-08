<script lang="ts">
  import { createInitialGameState, claimFreeRocks, saveMoonrocks } from '../game/state.js';
  import { getLevelMilestone } from '../game/levels.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import BagView from './BagView.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';

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
  
  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
  
  const canClaimRocks = $derived(gameState.playerStats.moonrocks < 100);
  
</script>

<div class="min-h-screen bg-black p-3">
  <div class="max-w-md mx-auto space-y-4">
    <!-- Header -->
    <header class="text-center mb-4 relative">
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
    
    <!-- Moonrocks - Separate section -->
    <div class="bg-white p-3 rounded-lg shadow-sm border">
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
      <div class="bg-red-50 p-3 rounded-lg shadow-sm border border-red-200">
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

    <!-- Stats - Compact horizontal layout - Only show when game started -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="grid grid-cols-3 gap-2 text-center text-xs mb-2">
          <div>
            <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
            <div class="text-gray-600">CHEDDAH</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">{gameState.currentLevel}</div>
            <div class="text-gray-600">LEVEL</div>
          </div>
          <div>
            <div class="text-lg font-bold text-purple-600">{gameState.playerStats.points}</div>
            <div class="text-gray-600">POINTS</div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div class="text-lg font-bold text-red-600">{gameState.playerStats.health}</div>
            <div class="text-gray-600">HEALTH</div>
          </div>
          <div>
            <div class="text-lg font-bold text-orange-600">{gameState.playerStats.levelMultiplier}×</div>
            <div class="text-gray-600">MULT</div>
          </div>
          <div>
            <div class="text-lg font-bold text-gray-600">{getLevelMilestone(gameState.currentLevel)}</div>
            <div class="text-gray-600">MILESTONE</div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Health Status - Show when game started -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center text-sm">
          <span class="text-sm font-bold">HEALTH</span>
          <span class="text-gray-600">{gameState.playerStats.health}/5</span>
        </div>
        <div class="mt-1">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300 {gameState.playerStats.health <= 2 ? 'bg-red-500' : 'bg-green-500'}"
              style="width: {(gameState.playerStats.health / 5) * 100}%"
            ></div>
          </div>
        </div>
        {#if gameState.playerStats.health <= 2}
          <p class="text-red-600 font-medium text-xs mt-1">⚠️ LOW HEALTH!</p>
        {/if}
      </div>
    {/if}

    <!-- Milestone Progress -->
    {#if gameState.gameStarted}
      <div class="bg-white p-3 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center text-sm">
          <span class="text-sm font-bold">POINTS</span>
          <span class="text-gray-600">{gameState.playerStats.points}/{getLevelMilestone(gameState.currentLevel)}</span>
        </div>
        <div class="mt-1">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-purple-500 h-2 rounded-full transition-all duration-300"
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

    <!-- Orb Bag - Compact design - Only show when game started -->
    {#if gameState.gameStarted}
    <div class="bg-white p-3 rounded-lg shadow-sm border">
      <div class="mb-2">
        <h3 class="text-sm font-bold">ORB BAG ({totalAvailableOrbs})</h3>
      </div>
      
      <div class="space-y-2 text-xs">
        <!-- Health Orbs -->
        <div class="flex justify-between items-center {gameState.orbBag.health.available.length === 0 ? 'opacity-50' : ''}">
          <span class="font-medium text-red-500">♥ HEALTH ORBS:</span>
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
          <span class="font-medium text-purple-500">★ POINT ORBS:</span>
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
          <span class="font-medium text-orange-500">💥 BOMB ORBS:</span>
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
            <span class="font-medium text-blue-500">⚡ POINTS PER ANY ORB:</span>
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
            <span class="font-medium text-yellow-500">🎯 POINTS PER BOMB PULLED:</span>
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
            <span class="font-medium text-orange-500">⭐ MULTIPLIER ORBS:</span>
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
    {/if}

    <!-- How to Play - Only show on menu, compact -->
    {#if gameState.phase === 'menu'}
      <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h3 class="font-medium text-blue-800 mb-1 text-sm">HOW TO PLAY</h3>
        <div class="text-xs text-blue-700 space-y-0.5">
          <p>• PULL ORBS: HEALTH (+1), POINTS (+5), AVOID BOMBS (-2 HP)</p>
          <p>• REACH MILESTONES: 12→18→28→44→66 POINTS</p>
          <p>• BUY ORBS BETWEEN LEVELS, CASH OUT ANYTIME</p>
        </div>
      </div>
    {/if}
  </div>
</div>
