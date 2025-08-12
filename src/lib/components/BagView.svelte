<script lang="ts">
  import { getTotalAvailableOrbs, getAvailableOrbCount, getTotalOrbCount } from '../game/orbs.js';
  import { pullOrb } from '../game/game.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handlePullOrb() {
    pullOrb(gameState);
  }

  const canPullOrb = $derived(gameState.phase === 'level' && getTotalAvailableOrbs(gameState.orbBag) > 0);
</script>

<div class="bg-black p-4 rounded border border-white">
  <h2 class="text-sm font-bold mb-3 text-white">Orb Bag</h2>
  
  <div class="space-y-3 mb-4">
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'health') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-red-500">Health Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'health')}</span>
        {#if gameState.orbBag.health.available.length > 0}
          <span class="text-sm text-white">({gameState.orbBag.health.available.map(orb => `+${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'health')}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'point') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-purple-500">Point Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'point')}</span>
        {#if gameState.orbBag.point.available.length > 0}
          <span class="text-sm text-white">({gameState.orbBag.point.available.map(orb => `+${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'point')}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'bomb') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-orange-500">Bomb Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'bomb')}</span>
        {#if gameState.orbBag.bomb.available.length > 0}
          <span class="text-sm text-white">({gameState.orbBag.bomb.available.map(orb => `-${orb.amount}`).join(', ')})</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'bomb')}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'points_per_anyorb') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-blue-500">Points Per Any Orb:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'points_per_anyorb')}</span>
        {#if gameState.orbBag.points_per_anyorb.available.length > 0}
          <span class="text-sm text-white">({gameState.orbBag.points_per_anyorb.available[0].amount}×{getTotalAvailableOrbs(gameState.orbBag) - 1} = {gameState.orbBag.points_per_anyorb.available[0].amount * (getTotalAvailableOrbs(gameState.orbBag) - 1)} pts)</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'points_per_anyorb')}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'points_per_bombpulled') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-yellow-500">Points Per Bomb Pulled:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'points_per_bombpulled')}</span>
        {#if gameState.orbBag.points_per_bombpulled.available.length > 0}
          <span class="text-sm text-white">({gameState.orbBag.points_per_bombpulled.available[0].amount}×{gameState.playerStats.bombsPulledThisLevel} = {gameState.orbBag.points_per_bombpulled.available[0].amount * gameState.playerStats.bombsPulledThisLevel} pts)</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'points_per_bombpulled')}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center {getAvailableOrbCount(gameState.orbBag, 'multiplier') === 0 ? 'opacity-50' : ''}">
      <span class="font-medium text-orange-500">Multiplier Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{getAvailableOrbCount(gameState.orbBag, 'multiplier')}</span>
        {#if gameState.orbBag.multiplier.available.length > 0}
          <span class="text-sm text-white">(+{gameState.orbBag.multiplier.available[0].amount}× boost)</span>
        {/if}
        <span class="text-gray-500">/ {getTotalOrbCount(gameState.orbBag, 'multiplier')}</span>
      </div>
    </div>
  </div>
  
  <div class="border border-white-t pt-3">
    <div class="flex justify-between items-center mb-3">
      <span class="font-medium">Total Available:</span>
      <span class="text-lg font-bold">{getTotalAvailableOrbs(gameState.orbBag)}</span>
    </div>
    
    <button 
      onclick={handlePullOrb}
      disabled={!canPullOrb}
      class="w-full py-2 px-4 rounded font-medium transition-colors
             {canPullOrb 
               ? 'bg-blue-600 text-white hover:bg-blue-700' 
               : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
    >
      {canPullOrb ? 'PULL ORB' : 'CANNOT PULL ORB'}
    </button>
  </div>
</div>