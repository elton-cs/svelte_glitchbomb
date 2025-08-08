<script lang="ts">
  import { gameState } from '../game/state.js';
  import { purchaseOrb } from '../game/game.js';

  let healthQuantity = 1;
  let pointQuantity = 1;

  function handlePurchaseHealth() {
    if (purchaseOrb('health', healthQuantity)) {
      healthQuantity = 1;
    }
  }

  function handlePurchasePoint() {
    if (purchaseOrb('point', pointQuantity)) {
      pointQuantity = 1;
    }
  }

  $: canPurchaseHealth = gameState.playerStats.cheddah >= gameState.marketplace.healthOrbCost * healthQuantity;
  $: canPurchasePoint = gameState.playerStats.cheddah >= gameState.marketplace.pointOrbCost * pointQuantity;
  $: maxHealthQuantity = Math.floor(gameState.playerStats.cheddah / gameState.marketplace.healthOrbCost);
  $: maxPointQuantity = Math.floor(gameState.playerStats.cheddah / gameState.marketplace.pointOrbCost);
</script>

{#if gameState.phase === 'marketplace' && gameState.marketplace.available}
  <div class="bg-gray-100 p-4 rounded border">
    <h2 class="text-lg font-bold mb-3">Marketplace</h2>
    
    <div class="mb-4 text-center">
      <div class="text-2xl font-bold text-green-600">{gameState.playerStats.cheddah}</div>
      <div class="text-sm text-gray-600">Available Cheddah</div>
    </div>
    
    <div class="space-y-4">
      <!-- Health Orbs -->
      <div class="border rounded p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium text-red-500">Health Orbs</span>
          <span class="text-gray-600">{gameState.marketplace.healthOrbCost} cheddah each</span>
        </div>
        
        <div class="flex items-center gap-2 mb-2">
          <label for="health-qty" class="text-sm">Quantity:</label>
          <input 
            id="health-qty"
            type="number" 
            bind:value={healthQuantity}
            min="1" 
            max={maxHealthQuantity}
            class="w-16 px-2 py-1 border rounded text-center"
          />
          <span class="text-sm text-gray-500">
            (Cost: {gameState.marketplace.healthOrbCost * healthQuantity})
          </span>
        </div>
        
        <button 
          onclick={handlePurchaseHealth}
          disabled={!canPurchaseHealth || maxHealthQuantity < 1}
          class="w-full py-2 px-4 rounded font-medium transition-colors
                 {canPurchaseHealth && maxHealthQuantity >= 1
                   ? 'bg-red-600 text-white hover:bg-red-700' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
        >
          Buy Health Orbs
        </button>
      </div>
      
      <!-- Point Orbs -->
      <div class="border rounded p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium text-purple-500">Point Orbs</span>
          <span class="text-gray-600">{gameState.marketplace.pointOrbCost} cheddah each</span>
        </div>
        
        <div class="flex items-center gap-2 mb-2">
          <label for="point-qty" class="text-sm">Quantity:</label>
          <input 
            id="point-qty"
            type="number" 
            bind:value={pointQuantity}
            min="1" 
            max={maxPointQuantity}
            class="w-16 px-2 py-1 border rounded text-center"
          />
          <span class="text-sm text-gray-500">
            (Cost: {gameState.marketplace.pointOrbCost * pointQuantity})
          </span>
        </div>
        
        <button 
          onclick={handlePurchasePoint}
          disabled={!canPurchasePoint || maxPointQuantity < 1}
          class="w-full py-2 px-4 rounded font-medium transition-colors
                 {canPurchasePoint && maxPointQuantity >= 1
                   ? 'bg-purple-600 text-white hover:bg-purple-700' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
        >
          Buy Point Orbs
        </button>
      </div>
    </div>
    
    {#if gameState.playerStats.cheddah === 0}
      <p class="text-sm text-gray-500 text-center mt-3">
        No cheddah remaining to spend
      </p>
    {/if}
  </div>
{/if}