<script lang="ts">
  import { purchaseOrb, purchaseShopItem } from '../game/game.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
  let holdTimeouts: { [key: string]: number | null } = {};
  let progressIntervals: { [key: string]: number | null } = {};
  let progressDelayTimeouts: { [key: string]: number | null } = {};
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

  const shopInventory = $derived.by(() => {
    const isShopOpen = (gameState.phase === 'marketplace' || gameState.phase === 'confirmation') && gameState.marketplace.available;
    
    if (isShopOpen) {
      // Shop is open - show actual items
      const availableShopItems = gameState.marketplace.currentShopItems;
      return availableShopItems.map(shopItem => {
        // Determine tier and colors based on item ID
        let tierColor = 'text-white';
        let tierBorder = 'border-white';
        
        if (shopItem.id.startsWith('common_')) {
          tierColor = 'text-white';
          tierBorder = 'border-gray-400';
        } else if (shopItem.id.startsWith('rare_')) {
          tierColor = 'text-white';
          tierBorder = 'border-blue-500';
        } else if (shopItem.id.startsWith('cosmic_')) {
          tierColor = 'text-white';
          tierBorder = 'border-purple-500';
        }
        
        // Keep red color for health orbs and preserve tier borders
        if (shopItem.type === 'health') {
          tierColor = 'text-white';
          // Keep the tier-based border color, don't override
        }
        
        return {
          id: shopItem.id,
          name: shopItem.name,
          description: shopItem.description,
          cost: shopItem.currentCost,
          baseCost: shopItem.baseCost,
          purchaseCount: shopItem.purchaseCount,
          icon: '',
          color: tierColor,
          borderColor: tierBorder,
          available: true,
          canPurchase: gameState.playerStats.cheddah >= shopItem.currentCost,
          isShopItem: true
        };
      });
    } else {
      // Shop is closed - show 6 placeholder items with X marks
      // Create placeholders that match expected tier distribution (3 common, 2 rare, 1 cosmic)
      const placeholders = [];
      
      // 3 common placeholders
      for (let i = 0; i < 3; i++) {
        placeholders.push({
          id: `placeholder_common_${i}`,
          name: '',
          description: '',
          cost: 0,
          baseCost: 0,
          purchaseCount: 0,
          icon: '×',
          color: 'text-gray-500',
          borderColor: 'border-gray-400',
          available: false,
          canPurchase: false,
          isShopItem: false
        });
      }
      
      // 2 rare placeholders
      for (let i = 0; i < 2; i++) {
        placeholders.push({
          id: `placeholder_rare_${i}`,
          name: '',
          description: '',
          cost: 0,
          baseCost: 0,
          purchaseCount: 0,
          icon: '×',
          color: 'text-gray-500',
          borderColor: 'border-blue-500',
          available: false,
          canPurchase: false,
          isShopItem: false
        });
      }
      
      // 1 cosmic placeholder
      placeholders.push({
        id: 'placeholder_cosmic_0',
        name: '',
        description: '',
        cost: 0,
        baseCost: 0,
        purchaseCount: 0,
        icon: '×',
        color: 'text-gray-500',
        borderColor: 'border-purple-500',
        available: false,
        canPurchase: false,
        isShopItem: false
      });
      
      return placeholders;
    }
  });
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {(gameState.phase === 'marketplace' || gameState.phase === 'confirmation') && gameState.marketplace.available ? '' : 'opacity-60'}">
  <h2 class="text-sm font-bold mb-3 text-white">{gameState.phase === 'confirmation' ? 'LEVEL COMPLETE!' : 'SHOP'} {(gameState.phase === 'marketplace' || gameState.phase === 'confirmation') && gameState.marketplace.available ? '' : '(CLOSED)'}</h2>
  
  <!-- 2x3 Shop Grid -->
  <div class="grid grid-cols-2 gap-2 flex-1">
    {#each shopInventory as item}
      <button
        disabled={!item.available || !item.canPurchase || gameState.phase !== 'marketplace' || !gameState.marketplace.available}
        onclick={item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available && item.isShopItem ? () => handleShopItemPurchase(item.id) : undefined}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border {item.borderColor}
               {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                 ? 'bg-black text-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center w-full">
          {#if item.icon}
            <!-- Placeholder X mark - always gray -->
            <div class="text-3xl {item.color}">{item.icon}</div>
          {:else}
            <!-- Actual shop item - no color classes so hover works -->
            {#if item.name}
              <div class="font-medium uppercase">{item.name}</div>
            {/if}
            {#if item.description}
              <div class="text-xs opacity-75">{item.description}</div>
            {/if}
            {#if item.available && item.cost > 0}
              <div class="text-xs opacity-90">
                {item.cost} CHEDDAH
                {#if item.purchaseCount > 0}
                  <div class="text-xs opacity-70">
                    (was {item.baseCost}, bought {item.purchaseCount}x)
                  </div>
                {/if}
              </div>
            {:else if !item.available && item.cost === 0}
              <div class="text-xs opacity-60 {item.color}">CLOSED</div>
            {:else if !item.available}
              <div class="text-xs opacity-60">LOCKED</div>
            {/if}
          {/if}
        </div>
      </button>
    {/each}
  </div>
  
  <!-- Footer -->
  <div class="mt-3 text-xs text-center h-4">
    <p class="text-white uppercase tracking-wide">
      CHEDDAH: <span class="font-medium">{gameState.playerStats.cheddah}</span>
    </p>
  </div>
  
  <div class="mt-1 text-xs text-center h-4">
    {#if gameState.phase === 'confirmation'}
      <p class="text-white font-bold">CONVERT {gameState.playerStats.points} POINTS?</p>
    {:else if gameState.phase === 'marketplace' && gameState.marketplace.available && gameState.playerStats.cheddah === 0}
      <p class="text-red-400">NO CHEDDAH TO SPEND</p>
    {:else if gameState.phase === 'marketplace' && gameState.marketplace.available}
      <p class="text-white">CLICK TO BUY</p>
    {:else}
      <p>&nbsp;</p>
    {/if}
  </div>
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