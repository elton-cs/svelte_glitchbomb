<script lang="ts">
  import { purchaseOrb, purchaseShopItem } from '../game/game.js';
  import { getAvailableShopItems } from '../game/shopItems.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
  let holdTimeouts: { [key: string]: NodeJS.Timeout | null } = {};
  let progressIntervals: { [key: string]: NodeJS.Timeout | null } = {};
  let progressDelayTimeouts: { [key: string]: NodeJS.Timeout | null } = {};
  let holdProgress: { [key: string]: number } = $state({});
  let mousePosition = $state({ x: 0, y: 0 });
  let activeHold: string | null = $state(null);

  function handleSinglePurchase(orbType: 'health' | 'point') {
    purchaseOrb(gameState, orbType, 1);
  }

  function handleShopItemPurchase(shopItemId: string) {
    purchaseShopItem(gameState, shopItemId, 1);
  }

  function handleMouseDown(event: MouseEvent, orbType: 'health' | 'point') {
    // Clear any existing timeouts/intervals
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
    }
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
    }
    
    // Track mouse position
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    holdProgress[orbType] = 0;
    activeHold = null; // Clear any existing progress bar
    
    const startTime = Date.now();
    const duration = 1000; // 1 second
    const progressDelay = 300; // 0.3 second delay before showing progress
    
    // Delay before showing progress bar and starting progress
    progressDelayTimeouts[orbType] = setTimeout(() => {
      // Only start if we're still holding (timeout hasn't been cleared)
      if (holdTimeouts[orbType]) {
        activeHold = orbType;
        
        // Update progress every 16ms (~60fps)
        progressIntervals[orbType] = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const adjustedElapsed = Math.max(0, elapsed - progressDelay);
          holdProgress[orbType] = Math.min((adjustedElapsed / duration) * 100, 100);
          
          if (elapsed >= duration + progressDelay) {
            clearInterval(progressIntervals[orbType]!);
            progressIntervals[orbType] = null;
          }
        }, 16);
      }
      progressDelayTimeouts[orbType] = null;
    }, progressDelay);
    
    // Set timeout for hold-to-buy-all (1 second + delay)
    holdTimeouts[orbType] = setTimeout(() => {
      const cost = orbType === 'health' ? gameState.marketplace.healthOrbCost : gameState.marketplace.pointOrbCost;
      const maxQuantity = Math.floor(gameState.playerStats.cheddah / cost);
      if (maxQuantity > 0) {
        purchaseOrb(gameState, orbType, maxQuantity);
      }
      holdTimeouts[orbType] = null;
      activeHold = null;
      holdProgress[orbType] = 0;
    }, 1000 + progressDelay);
  }

  function handleMouseUp(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
      
      // Only execute single purchase if progress is minimal (< 10%)
      // This prevents accidental purchases when someone starts holding but releases early
      if ((holdProgress[orbType] || 0) < 10) {
        handleSinglePurchase(orbType);
      }
    }
    
    // Clean up all timers and progress
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
      progressIntervals[orbType] = null;
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
      progressDelayTimeouts[orbType] = null;
    }
    activeHold = null;
    holdProgress[orbType] = 0;
  }

  function handleMouseLeave(orbType: 'health' | 'point') {
    if (holdTimeouts[orbType]) {
      clearTimeout(holdTimeouts[orbType]);
      holdTimeouts[orbType] = null;
    }
    
    // Clean up all timers and progress
    if (progressIntervals[orbType]) {
      clearInterval(progressIntervals[orbType]);
      progressIntervals[orbType] = null;
    }
    if (progressDelayTimeouts[orbType]) {
      clearTimeout(progressDelayTimeouts[orbType]);
      progressDelayTimeouts[orbType] = null;
    }
    activeHold = null;
    holdProgress[orbType] = 0;
  }

  const marketItems = $derived.by(() => {
    const availableShopItems = getAvailableShopItems(gameState.currentLevel);
    const items = availableShopItems.map(shopItem => {
      // Determine tier and colors based on item ID
      let tierColor = 'text-white';
      let tierBorder = 'border-white hover:border-gray-300';
      
      if (shopItem.id.startsWith('common_')) {
        tierColor = 'text-gray-300';
        tierBorder = 'border-gray-400 hover:border-gray-300';
      } else if (shopItem.id.startsWith('rare_')) {
        tierColor = 'text-blue-400';
        tierBorder = 'border-blue-400 hover:border-blue-300';
      } else if (shopItem.id.startsWith('cosmic_')) {
        tierColor = 'text-purple-400';
        tierBorder = 'border-purple-400 hover:border-purple-300';
      }
      
      // Override with specific orb type colors for health
      if (shopItem.type === 'health') {
        tierColor = 'text-red-400';
        tierBorder = 'border-red-400 hover:border-red-300';
      }
      
      return {
        id: shopItem.id,
        name: shopItem.name,
        description: shopItem.description,
        cost: shopItem.cost,
        icon: '',
        color: tierColor,
        borderColor: tierBorder,
        available: true,
        canPurchase: gameState.playerStats.cheddah >= shopItem.cost,
        isShopItem: true
      };
    });
    
    // Always maintain exactly 6 slots - fill remaining with locked placeholders
    const totalSlots = 6;
    const remainingSlots = totalSlots - items.length;
    
    for (let i = 0; i < remainingSlots; i++) {
      items.push({
        id: `locked${i + 1}`,
        name: 'LOCKED',
        description: '???',
        cost: 0,
        icon: '',
        color: 'text-gray-600',
        borderColor: 'border-gray-700',
        available: false,
        canPurchase: false,
        isShopItem: false
      });
    }
    
    return items;
  });
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'marketplace' && gameState.marketplace.available ? '' : 'opacity-60'}">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-sm font-bold text-white">MARKETPLACE {gameState.phase === 'marketplace' && gameState.marketplace.available ? '' : '(INACTIVE)'}</h2>
    <div class="text-right">
      <div class="text-lg font-bold text-white">{gameState.playerStats.cheddah}</div>
      <div class="text-xs text-gray-400">CHEDDAH</div>
    </div>
  </div>
  
  <!-- 2x3 Grid Layout -->
  <div class="grid grid-cols-2 gap-2 flex-1">
    {#each marketItems as item}
      <button
        disabled={!item.available || !item.canPurchase || gameState.phase !== 'marketplace' || !gameState.marketplace.available}
        onclick={item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available && item.isShopItem ? () => handleShopItemPurchase(item.id) : undefined}
        class="p-2 rounded font-medium transition-colors select-none flex items-center gap-2 text-left border-2
               {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                 ? `${item.borderColor} bg-black active:scale-95` 
                 : 'bg-gray-900 text-gray-600 cursor-not-allowed border-gray-700'}"
      >
        {#if item.icon}<div class="text-lg {item.color}">{item.icon}</div>{/if}
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium truncate">{item.name}</div>
          <div class="text-xs opacity-75 truncate">{item.description}</div>
          {#if item.available && item.cost > 0}
            <div class="text-xs opacity-90">{item.cost} cheddah</div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
  
  <div class="mt-3 text-xs text-center {gameState.phase === 'marketplace' && gameState.marketplace.available ? 'text-gray-400' : 'text-gray-600'}">
    {#if gameState.phase === 'marketplace' && gameState.marketplace.available}
      CLICK TO PURCHASE
    {:else}
      MARKETPLACE UNAVAILABLE
    {/if}
  </div>
  
  {#if gameState.playerStats.cheddah === 0 && gameState.phase === 'marketplace' && gameState.marketplace.available}
    <p class="text-xs text-gray-400 text-center mt-2">
      NO CHEDDAH REMAINING
    </p>
  {/if}
</div>

<!-- Circular Progress Indicator -->
{#if activeHold}
  <div 
    class="fixed pointer-events-none z-50"
    style="left: {mousePosition.x - 25}px; top: {mousePosition.y - 25}px;"
  >
    <div class="relative w-12 h-12">
      <!-- White background circle -->
      <div class="absolute inset-0 bg-black rounded-full border-2 border-white"></div>
      
      <!-- Progress SVG -->
      <svg class="w-12 h-12 -rotate-90 absolute inset-0" viewBox="0 0 36 36">
        <!-- Progress circle -->
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="{activeHold === 'health' ? '#f87171' : '#ffffff'}"
          stroke-width="3"
          stroke-dasharray="{holdProgress[activeHold] || 0}, 100"
          stroke-linecap="round"
          class="transition-all duration-75 ease-linear"
        />
      </svg>
      
      <!-- Center icon -->
      <div class="absolute inset-0 flex items-center justify-center text-lg {activeHold === 'health' ? 'text-red-400' : 'text-white'}">
        {activeHold === 'health' ? 'H' : 'P'}
      </div>
    </div>
  </div>
{/if}