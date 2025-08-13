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
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' ? '' : 'opacity-60 pointer-events-none'}">
  <h2 class="text-sm font-bold mb-3 text-white">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' ? '' : '(INACTIVE)'}</h2>
  
  <div class="space-y-2 text-xs flex-1 overflow-y-auto">
    <!-- Health Orbs -->
    <div class="flex justify-between items-center {gameState.orbBag.health.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-red-500">♥ HEALTH ORBS:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.health.available.length}</span>
        {#if gameState.orbBag.health.available.length > 0}
          <span class="text-white">({gameState.orbBag.health.available.map(orb => `+${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.health.total.length}</span>
      </div>
    </div>
    
    <!-- Point Orbs -->
    <div class="flex justify-between items-center {gameState.orbBag.point.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-purple-500">★ POINT ORBS:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.point.available.length}</span>
        {#if gameState.orbBag.point.available.length > 0}
          <span class="text-white">({gameState.orbBag.point.available.map(orb => `+${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.point.total.length}</span>
      </div>
    </div>
    
    <!-- Bomb Orbs -->
    <div class="flex justify-between items-center {gameState.orbBag.bomb.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-orange-500">💥 BOMB ORBS:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.bomb.available.length}</span>
        {#if gameState.orbBag.bomb.available.length > 0}
          <span class="text-white">({gameState.orbBag.bomb.available.map(orb => `-${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.bomb.total.length}</span>
      </div>
    </div>
    
    <!-- Points Per Any Orb -->
    <div class="flex justify-between items-center {gameState.orbBag.points_per_anyorb.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-blue-500">⚡ POINTS PER ANY ORB:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.points_per_anyorb.available.length}</span>
        {#if gameState.orbBag.points_per_anyorb.available.length > 0}
          <span class="text-white">({gameState.orbBag.points_per_anyorb.available[0].amount}×{totalAvailableOrbs - 1} = {gameState.orbBag.points_per_anyorb.available[0].amount * (totalAvailableOrbs - 1)} pts)</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.points_per_anyorb.total.length}</span>
      </div>
    </div>
    
    <!-- Points Per Bomb Pulled -->
    <div class="flex justify-between items-center {gameState.orbBag.points_per_bombpulled.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-yellow-500">🎯 POINTS PER BOMB PULLED:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.points_per_bombpulled.available.length}</span>
        {#if gameState.orbBag.points_per_bombpulled.available.length > 0}
          <span class="text-white">({gameState.orbBag.points_per_bombpulled.available[0].amount}×{gameState.playerStats.bombsPulledThisLevel} = {gameState.orbBag.points_per_bombpulled.available[0].amount * gameState.playerStats.bombsPulledThisLevel} pts)</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.points_per_bombpulled.total.length}</span>
      </div>
    </div>
    
    <!-- Multiplier Orbs -->
    <div class="flex justify-between items-center {gameState.orbBag.multiplier.available.length === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-orange-500">⭐ MULTIPLIER ORBS:</span>
      <div class="text-right">
        <span class="font-bold text-white">{gameState.orbBag.multiplier.available.length}</span>
        {#if gameState.orbBag.multiplier.available.length > 0}
          <span class="text-white">(+{gameState.orbBag.multiplier.available[0].amount}× boost)</span>
        {/if}
        <span class="text-white">/ {gameState.orbBag.multiplier.total.length}</span>
      </div>
    </div>
  </div>
</div>