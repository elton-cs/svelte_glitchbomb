<script lang="ts">
  import { gameState } from '../game/state.js';
  import { pullOrb } from '../game/game.js';
  import { getTotalAvailableOrbs } from '../game/orbs.js';

  function handlePullOrb() {
    pullOrb();
  }

  $: canPullOrb = gameState.phase === 'level' && getTotalAvailableOrbs(gameState.orbBag) > 0;
</script>

<div class="bg-gray-100 p-4 rounded border">
  <h2 class="text-lg font-bold mb-3">Orb Bag</h2>
  
  <div class="space-y-3 mb-4">
    <div class="flex justify-between items-center">
      <span class="font-medium text-red-500">Health Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{gameState.orbBag.health.available}</span>
        <span class="text-gray-500">/ {gameState.orbBag.health.total}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="font-medium text-purple-500">Point Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{gameState.orbBag.point.available}</span>
        <span class="text-gray-500">/ {gameState.orbBag.point.total}</span>
      </div>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="font-medium text-orange-500">Bomb Orbs:</span>
      <div class="text-right">
        <span class="text-lg font-bold">{gameState.orbBag.bomb.available}</span>
        <span class="text-gray-500">/ {gameState.orbBag.bomb.total}</span>
      </div>
    </div>
  </div>
  
  <div class="border-t pt-3">
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
      {canPullOrb ? 'Pull Orb' : 'Cannot Pull Orb'}
    </button>
  </div>
</div>