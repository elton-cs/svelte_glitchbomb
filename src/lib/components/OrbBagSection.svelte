<script lang="ts">
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
</script>

<!-- Orb Bag - Compact design -->
<div class="bg-white p-3 rounded-lg shadow-sm border h-full flex flex-col {gameState.phase === 'level' ? '' : 'opacity-60 pointer-events-none'}">
  <div class="mb-2">
    <h3 class="text-sm font-bold">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' ? '' : '(INACTIVE)'}</h3>
  </div>
  
  <div class="space-y-2 text-xs flex-1 overflow-y-auto">
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