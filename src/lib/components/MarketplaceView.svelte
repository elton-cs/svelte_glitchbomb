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


  const shopInventory = $derived.by(() => {
    const isShopOpen = gameState.phase === 'marketplace' && gameState.marketplace.available;
    
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
        class="relative py-1 px-1 rounded font-medium transition-colors border {item.borderColor}
               {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                 ? 'bg-black text-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 cursor-not-allowed'}"
      >
        <!-- Purchase count badge -->
        {#if item.purchaseCount > 0}
          <div class="absolute top-1 left-1 bg-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center z-10 border
                      {item.available && item.canPurchase && gameState.phase === 'marketplace' && gameState.marketplace.available
                        ? 'text-white border-white' 
                        : 'text-gray-500 border-gray-500'}">
            {item.purchaseCount}x
          </div>
        {/if}
        
        <div class="h-full w-full flex items-center p-1">
          {#if item.icon}
            <!-- Placeholder X mark - always gray -->
            <div class="flex-1 flex items-center justify-center">
              <div class="text-4xl {item.color}">{item.icon}</div>
            </div>
          {:else}
            <!-- Two column layout: Content | Price -->
            <div class="flex-1 flex flex-col justify-center min-w-0 pr-1">
              {#if item.name}
                <div class="font-medium uppercase text-lg leading-tight truncate">{item.name}</div>
              {/if}
              {#if item.description}
                <div class="text-sm opacity-75 leading-tight truncate">{item.description}</div>
              {/if}
            </div>
            
            <!-- Vertical price column on right -->
            <div class="flex flex-col items-center justify-center text-center w-10">
              {#if item.available && item.cost > 0}
                {#if item.purchaseCount > 0}
                  <div class="flex items-center justify-center gap-1">
                    <div class="text-xs opacity-60 line-through">{item.baseCost}</div>
                    <div class="text-lg font-bold">{item.cost}</div>
                  </div>
                {:else}
                  <div class="text-lg font-bold">{item.cost}</div>
                {/if}
                <div class="text-lg">🧀</div>
              {:else if !item.available && item.cost === 0}
                <div class="text-sm opacity-60 {item.color} transform rotate-90">CLOSED</div>
              {:else if !item.available}
                <div class="text-sm opacity-60 transform rotate-90">LOCKED</div>
              {/if}
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
  
  <!-- Footer -->
  <div class="mt-3 text-sm text-center h-5">
    <p class="text-white uppercase tracking-wide">
      CHEDDAH: <span class="font-medium">{gameState.playerStats.cheddah}</span>
    </p>
  </div>
  
  <div class="mt-1 text-sm text-center h-5">
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

