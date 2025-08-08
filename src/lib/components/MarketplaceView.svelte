<script lang="ts">
  import { purchaseOrb } from '../game/game.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
  let holdTimeouts: { [key: string]: NodeJS.Timeout | null } = {};

  function handleSinglePurchase(orbType: 'health' | 'point') {
    purchaseOrb(gameState, orbType, 1);
  }

  function handleMouseDown(orbType: 'health' | 'point') {
    // Clear any existing timeout
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
    }
    
    // Set timeout for hold-to-buy-all (2 seconds)
    holdTimeouts[orbType] = setTimeout(() => {
      const cost = orbType === 'health' ? gameState.marketplace.healthOrbCost : gameState.marketplace.pointOrbCost;
      const maxQuantity = Math.floor(gameState.playerStats.cheddah / cost);
      if (maxQuantity > 0) {
        purchaseOrb(gameState, orbType, maxQuantity);
      }
      holdTimeouts[orbType] = null;
    }, 2000);
  }

  function handleMouseUp(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
      // Execute single purchase since hold was released before 2 seconds
      handleSinglePurchase(orbType);
    }
  }

  function handleMouseLeave(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
    }
  }

  const canPurchaseHealth = $derived(gameState.playerStats.cheddah >= gameState.marketplace.healthOrbCost);
  const canPurchasePoint = $derived(gameState.playerStats.cheddah >= gameState.marketplace.pointOrbCost);

  // Market items - 2 available, 4 locked placeholders
  const marketItems = $derived([
    {
      id: 'health',
      name: 'Health',
      cost: gameState.marketplace.healthOrbCost,
      icon: '♥',
      color: 'text-red-500',
      bgColor: 'bg-red-600 hover:bg-red-700',
      available: true,
      canPurchase: canPurchaseHealth
    },
    {
      id: 'point',
      name: 'Point',
      cost: gameState.marketplace.pointOrbCost,
      icon: '★',
      color: 'text-purple-500',
      bgColor: 'bg-purple-600 hover:bg-purple-700',
      available: true,
      canPurchase: canPurchasePoint
    },
    {
      id: 'locked1',
      name: 'Locked',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked2',
      name: 'Locked',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked3',
      name: 'Locked',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    },
    {
      id: 'locked4',
      name: 'Locked',
      cost: 0,
      icon: '🔒',
      color: 'text-gray-400',
      bgColor: 'bg-gray-300',
      available: false,
      canPurchase: false
    }
  ]);
</script>

{#if gameState.phase === 'marketplace' && gameState.marketplace.available}
  <div class="bg-white p-3 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-bold">Marketplace</h2>
      <div class="text-right">
        <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
        <div class="text-xs text-gray-600">Cheddah</div>
      </div>
    </div>
    
    <!-- 2x3 Grid Layout -->
    <div class="grid grid-cols-2 gap-3">
      {#each marketItems as item}
        <button
          disabled={!item.available || !item.canPurchase}
          onmousedown={item.available ? () => handleMouseDown(item.id as 'health' | 'point') : undefined}
          onmouseup={item.available ? () => handleMouseUp(item.id as 'health' | 'point') : undefined}
          onmouseleave={item.available ? () => handleMouseLeave(item.id as 'health' | 'point') : undefined}
          class="aspect-square p-3 rounded-lg font-medium transition-colors select-none flex flex-col items-center justify-center gap-1
                 {item.available && item.canPurchase
                   ? `${item.bgColor} text-white active:scale-95` 
                   : 'bg-gray-200 text-gray-500 cursor-not-allowed'}"
        >
          <div class="text-2xl {item.color}">{item.icon}</div>
          <div class="text-sm font-medium">{item.name}</div>
          {#if item.available}
            <div class="text-xs opacity-90">{item.cost}</div>
          {/if}
        </button>
      {/each}
    </div>
    
    <div class="mt-3 text-xs text-gray-500 text-center">
      Click to buy one • Hold 2s to buy max
    </div>
    
    {#if gameState.playerStats.cheddah === 0}
      <p class="text-xs text-gray-500 text-center mt-2">
        No cheddah remaining
      </p>
    {/if}
  </div>
{/if}