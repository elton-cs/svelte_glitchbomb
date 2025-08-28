<script lang="ts">
  import { purchaseOrb, purchaseShopItem } from '../game/game.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handleSinglePurchase(orbType: 'health' | 'point') {
    purchaseOrb(gameState, orbType, 1);
  }

  function handleShopItemPurchase(shopItemId: string) {
    purchaseShopItem(gameState, shopItemId, 1);
  }

  // Get orb display text and styling for each shop item type
  function getOrbDisplay(type: string, amount: number) {
    switch (type) {
      case 'point':
      case 'points_per_anyorb':
      case 'points_per_bombpulled':
        // All points-related orbs use the POINTS category emoji and color
        let text = amount.toString();
        if (type === 'points_per_anyorb') text = `${amount}/C`;
        if (type === 'points_per_bombpulled') text = `${amount}/B`;
        return {
          text,
          icon: '⭐️',
          color: 'text-green-400',
          borderColor: 'border-green-400'
        };
      case 'multiplier':
        return {
          text: amount.toString(),
          icon: '⚡️',
          color: 'text-blue-400',
          borderColor: 'border-blue-400'
        };
      case 'health':
        return {
          text: amount.toString(),
          icon: '❤️',
          color: 'text-red-500',
          borderColor: 'border-red-500'
        };
      case 'bomb':
        return {
          text: amount.toString(),
          icon: '💣',
          color: 'text-orange-500',
          borderColor: 'border-orange-500'
        };
      case 'bits':
      case 'glitchbytes':
        // Both bits and glitchbytes use the SPECIAL category emoji and color
        const specialText = type === 'bits' ? `${amount}B` : `${amount}GB`;
        return {
          text: specialText,
          icon: '👑',
          color: 'text-yellow-400',
          borderColor: 'border-yellow-400'
        };
      default:
        return {
          text: amount.toString(),
          icon: '?',
          color: 'text-white',
          borderColor: 'border-white'
        };
    }
  }


  const shopInventory = $derived.by(() => {
    const isShopOpen = gameState.phase === 'marketplace' && gameState.marketplace.available;
    
    if (isShopOpen) {
      // Shop is open - show actual items
      const availableShopItems = gameState.marketplace.currentShopItems;
      
      // Sort items: common first (top row), then rare and cosmic (bottom row)
      const sortedItems = [...availableShopItems].sort((a, b) => {
        const getOrder = (id: string) => {
          if (id.startsWith('common_')) return 1;
          if (id.startsWith('rare_')) return 2;
          if (id.startsWith('cosmic_')) return 3;
          return 4;
        };
        return getOrder(a.id) - getOrder(b.id);
      });
      
      return sortedItems.map(shopItem => {
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
        
        const orbDisplay = getOrbDisplay(shopItem.type, shopItem.amount);
        
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
          canPurchase: gameState.playerStats.bits >= shopItem.currentCost,
          isShopItem: true,
          orbDisplay
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
          isShopItem: false,
          orbDisplay: null
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
          isShopItem: false,
          orbDisplay: null
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
        isShopItem: false,
        orbDisplay: null
      });
      
      return placeholders;
    }
  });
</script>

<div class="bg-black p-2 rounded-lg shadow-sm border border-white h-full flex flex-col {(gameState.phase === 'marketplace' || gameState.phase === 'confirmation') && gameState.marketplace.available ? '' : 'opacity-60'}">
  <h2 class="text-sm font-bold mb-2 text-white">{gameState.phase === 'confirmation' ? 'LEVEL COMPLETE!' : 'MOD SHOP'} {(gameState.phase === 'marketplace' || gameState.phase === 'confirmation') && gameState.marketplace.available ? '' : '(CLOSED)'}</h2>
  
  <!-- Shop Grid - Fixed 2x3 layout -->
  <div class="grid grid-cols-3 grid-rows-2 gap-2 flex-1">
    {#each shopInventory as item}
      <button
        disabled={!item.available || !item.canPurchase || gameState.phase !== 'marketplace' || !gameState.marketplace.available}
        onclick={item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available && item.isShopItem ? () => handleShopItemPurchase(item.id) : undefined}
        class="group relative p-2 rounded text-sm font-medium transition-colors border {item.borderColor} min-h-0 overflow-hidden
               {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                 ? 'bg-black text-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 cursor-not-allowed'}"
      >
        <!-- Purchase count badge -->
        {#if item.purchaseCount > 0}
          <div class="absolute bottom-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center z-10 border transition-colors
                      {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                        ? 'bg-black text-white border-white group-hover:bg-white group-hover:text-black group-hover:border-black' 
                        : 'bg-black text-gray-500 border-gray-500'}">
            {item.purchaseCount}x
          </div>
        {/if}
        
        <div class="h-full w-full flex flex-col">
          {#if item.icon}
            <!-- Placeholder X mark - always gray -->
            <div class="flex-1 flex items-center justify-center">
              <div class="text-4xl {item.color}">{item.icon}</div>
            </div>
          {:else}
            <!-- Stacked layout: Name, Inner Card, Price -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex-1 flex flex-col justify-start">
                {#if item.name}
                  <div class="font-bold uppercase text-xs leading-tight mb-2">{item.name}</div>
                {/if}
                
                <!-- Inner card view with orb display -->
                {#if item.orbDisplay}
                  <div class="flex-1 flex items-center justify-center mb-2">
                    <div class="border-2 {item.orbDisplay.borderColor} bg-black rounded px-3 py-2 flex flex-col items-center justify-center min-h-16 min-w-16 transition-colors 
                                {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                                  ? 'group-hover:bg-white group-hover:border-black' 
                                  : ''}">
                      <div class="text-xl mb-1">{item.orbDisplay.icon}</div>
                      <div class="text-sm font-bold {item.orbDisplay.color} transition-colors
                                  {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                                    ? 'group-hover:text-black' 
                                    : ''}">{item.orbDisplay.text}</div>
                    </div>
                  </div>
                {/if}
              </div>
              
              <!-- Price section at bottom -->
              <div class="flex items-center justify-between">
                <div></div> <!-- Spacer -->
                <div class="flex items-center gap-1">
                  {#if item.available && item.cost > 0}
                    {#if item.purchaseCount > 0}
                      <div class="text-xs opacity-60 line-through">{item.baseCost}</div>
                    {/if}
                    <div class="text-lg font-bold">{item.cost}</div>
                    <div class="text-lg font-bold">B</div>
                  {:else if !item.available && item.cost === 0}
                    <div class="text-sm opacity-60 {item.color}">CLOSED</div>
                  {:else if !item.available}
                    <div class="text-sm opacity-60">LOCKED</div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
  
  <!-- Footer -->
  <div class="mt-2 text-sm text-center h-5">
    <p class="text-white uppercase tracking-wide">
      BITS: <span class="font-medium">{gameState.playerStats.bits}</span>
    </p>
  </div>
  
</div>

