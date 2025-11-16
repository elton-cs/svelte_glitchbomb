<script lang="ts">
  import { purchaseOrb, purchaseShopItem } from "../../game/game.js";
  import type { GameState } from "../../game/types.js";
  import ChipIcon from "./ChipIcon.svelte";
  import { audioManager } from "../../utils/audio.js";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handleSinglePurchase(orbType: "health" | "point") {
    purchaseOrb(gameState, orbType, 1);
  }

  function handleShopItemPurchase(shopItemId: string) {
    purchaseShopItem(gameState, shopItemId, 1);
  }

  // Helper function to play buy sound with purchase action
  function playBuyAndPurchase(shopItemId: string) {
    audioManager.playSoundEffect("buy", 0.4);
    handleShopItemPurchase(shopItemId);
  }

  // Get orb display text and styling for each shop item type
  function getOrbDisplay(type: string, amount: number) {
    switch (type) {
      case "point":
      case "points_per_anyorb":
      case "points_per_bombpulled":
        // All points-related orbs use the POINTS category emoji and color
        let text = amount.toString();
        if (type === "points_per_anyorb") text = `${amount}/RC`;
        if (type === "points_per_bombpulled") text = `${amount}/B`;
        return {
          text,
          icon: "⭐️",
          color: "text-green-400",
          borderColor: "border-green-400",
        };
      case "multiplier":
        return {
          text: amount.toString(),
          icon: "⚡️",
          color: "text-blue-400",
          borderColor: "border-blue-400",
        };
      case "health":
        return {
          text: amount.toString(),
          icon: "❤️",
          color: "text-red-500",
          borderColor: "border-red-500",
        };
      case "bomb":
        return {
          text: amount.toString(),
          icon: "💣",
          color: "text-orange-500",
          borderColor: "border-orange-500",
        };
      case "bits":
      case "glitchbytes":
        // Both chips and glitchbytes use crown emoji (SPECIAL category)
        const specialText = type === "bits" ? amount.toString() : `${amount}👾`;
        const specialIcon = "👑";
        return {
          text: specialText,
          icon: specialIcon,
          color: "text-yellow-400",
          borderColor: "border-yellow-400",
          isChipOrb: type === "bits",
        };
      default:
        return {
          text: amount.toString(),
          icon: "?",
          color: "text-white",
          borderColor: "border-white",
        };
    }
  }

  const shopInventory = $derived.by(() => {
    const isShopOpen =
      gameState.phase === "marketplace" && gameState.marketplace.available;

    if (isShopOpen) {
      // Shop is open - show actual items
      const availableShopItems = gameState.marketplace.currentShopItems;

      // Sort items: common first (top row), then rare and cosmic (bottom row)
      const sortedItems = [...availableShopItems].sort((a, b) => {
        const getOrder = (id: string) => {
          if (id.startsWith("common_")) return 1;
          if (id.startsWith("rare_")) return 2;
          if (id.startsWith("cosmic_")) return 3;
          return 4;
        };
        return getOrder(a.id) - getOrder(b.id);
      });

      return sortedItems.map((shopItem) => {
        // Determine tier and colors based on item ID
        let tierColor = "text-white";
        let tierBorder = "border-white";

        if (shopItem.id.startsWith("common_")) {
          tierColor = "text-white";
          tierBorder = "border-gray-400";
        } else if (shopItem.id.startsWith("rare_")) {
          tierColor = "text-white";
          tierBorder = "border-blue-500";
        } else if (shopItem.id.startsWith("cosmic_")) {
          tierColor = "text-white";
          tierBorder = "border-purple-500";
        }

        // Keep red color for health orbs and preserve tier borders
        if (shopItem.type === "health") {
          tierColor = "text-white";
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
          icon: "",
          color: tierColor,
          borderColor: tierBorder,
          available: true,
          canPurchase: gameState.playerStats.chips >= shopItem.currentCost,
          isShopItem: true,
          orbDisplay,
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
          name: "",
          description: "",
          cost: 0,
          baseCost: 0,
          purchaseCount: 0,
          icon: "×",
          color: "text-gray-500",
          borderColor: "border-gray-400",
          available: false,
          canPurchase: false,
          isShopItem: false,
          orbDisplay: null,
        });
      }

      // 2 rare placeholders
      for (let i = 0; i < 2; i++) {
        placeholders.push({
          id: `placeholder_rare_${i}`,
          name: "",
          description: "",
          cost: 0,
          baseCost: 0,
          purchaseCount: 0,
          icon: "×",
          color: "text-gray-500",
          borderColor: "border-blue-500",
          available: false,
          canPurchase: false,
          isShopItem: false,
          orbDisplay: null,
        });
      }

      // 1 cosmic placeholder
      placeholders.push({
        id: "placeholder_cosmic_0",
        name: "",
        description: "",
        cost: 0,
        baseCost: 0,
        purchaseCount: 0,
        icon: "×",
        color: "text-gray-500",
        borderColor: "border-purple-500",
        available: false,
        canPurchase: false,
        isShopItem: false,
        orbDisplay: null,
      });

      return placeholders;
    }
  });
</script>

<div
  class="bg-black p-1 sm:p-2 rounded-lg shadow-sm border border-white h-full flex flex-col {(gameState.phase ===
    'marketplace' ||
    gameState.phase === 'confirmation') &&
  gameState.marketplace.available
    ? ''
    : 'opacity-60'}"
>
  <div class="flex items-center justify-between mb-1 sm:mb-2">
    <h2 class="text-xs sm:text-sm font-bold text-white">
      {gameState.phase === "confirmation" ? "LEVEL COMPLETE!" : "MOD SHOP"}
      {(gameState.phase === "marketplace" ||
        gameState.phase === "confirmation") &&
      gameState.marketplace.available
        ? ""
        : "(CLOSED)"}
    </h2>
    <div class="text-xs sm:text-sm font-bold text-yellow-400 flex items-center gap-0.5 sm:gap-1">
      BALANCE: <span class="text-lg sm:text-xl"
        >{gameState.playerStats.chips}</span
      >
      <ChipIcon size="md" class="text-yellow-400" />
    </div>
  </div>

  <!-- Shop Grid - Fixed 2x3 layout -->
  <div class="grid grid-cols-3 grid-rows-2 gap-1 sm:gap-2 flex-1">
    {#each shopInventory as item}
      <button
        disabled={!item.available ||
          !item.canPurchase ||
          gameState.phase !== "marketplace" ||
          !gameState.marketplace.available}
        onclick={item.available &&
        item.canPurchase &&
        gameState.phase === "marketplace" &&
        gameState.marketplace.available &&
        item.isShopItem
          ? () => playBuyAndPurchase(item.id)
          : undefined}
        class="group relative p-1 sm:p-2 rounded text-xs sm:text-sm font-medium transition-colors border {item.borderColor} min-h-0 overflow-hidden
               {item.available &&
        item.canPurchase &&
        gameState.phase === 'marketplace' &&
        gameState.marketplace.available
          ? 'bg-black text-white hover:bg-white hover:text-black'
          : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-50'}"
      >
        <!-- Purchase count badge -->
        {#if item.purchaseCount > 0}
          <div
            class="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full min-w-4 text-center z-10 border transition-colors
                      {item.available &&
            item.canPurchase &&
            gameState.phase === 'marketplace' &&
            gameState.marketplace.available
              ? 'bg-black text-white border-white group-hover:bg-white group-hover:text-black group-hover:border-black'
              : 'bg-gray-800 text-gray-600 border-gray-600'}"
          >
            {item.purchaseCount}x
          </div>
        {/if}

        <div class="h-full w-full flex flex-col">
          {#if item.icon}
            <!-- Placeholder X mark - always gray -->
            <div class="flex-1 flex items-center justify-center">
              <div class="text-2xl sm:text-4xl {item.color}">{item.icon}</div>
            </div>
          {:else}
            <!-- Stacked layout: Name, Inner Card, Price -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex-1 flex flex-col justify-start">
                {#if item.name}
                  <div class="font-bold uppercase text-[10px] sm:text-xs leading-tight mb-1 sm:mb-2">
                    {item.name}
                  </div>
                {/if}

                <!-- Inner card view with orb display -->
                {#if item.orbDisplay}
                  <div class="flex-1 flex items-center justify-center mb-1 sm:mb-2">
                    <div
                      class="border-2 {item.available &&
                      item.canPurchase &&
                      gameState.phase === 'marketplace' &&
                      gameState.marketplace.available
                        ? item.orbDisplay.borderColor
                        : 'border-gray-600'} bg-black rounded px-2 sm:px-3 py-1 sm:py-2 flex flex-col items-center justify-center min-h-12 sm:min-h-16 min-w-12 sm:min-w-16 transition-colors
                                {item.available &&
                      item.canPurchase &&
                      gameState.phase === 'marketplace' &&
                      gameState.marketplace.available
                        ? 'group-hover:bg-white group-hover:border-black'
                        : ''}"
                    >
                      <div class="text-lg sm:text-xl mb-0.5 sm:mb-1">{item.orbDisplay.icon}</div>
                      {#if item.orbDisplay.isChipOrb}
                        <div class="flex items-center gap-0.5 sm:gap-1">
                          <div
                            class="text-xs sm:text-sm font-bold {item.available &&
                            item.canPurchase &&
                            gameState.phase === 'marketplace' &&
                            gameState.marketplace.available
                              ? item.orbDisplay.color
                              : 'text-gray-600'} transition-colors
                                      {item.available &&
                            item.canPurchase &&
                            gameState.phase === 'marketplace' &&
                            gameState.marketplace.available
                              ? 'group-hover:text-black'
                              : ''}"
                          >
                            {item.orbDisplay.text}
                          </div>
                          <ChipIcon
                            size="sm"
                            class="{item.available &&
                            item.canPurchase &&
                            gameState.phase === 'marketplace' &&
                            gameState.marketplace.available
                              ? item.orbDisplay.color
                              : 'text-gray-600'} transition-colors {item.available &&
                            item.canPurchase &&
                            gameState.phase === 'marketplace' &&
                            gameState.marketplace.available
                              ? 'group-hover:text-black'
                              : ''}"
                          />
                        </div>
                      {:else}
                        <div
                          class="text-xs sm:text-sm font-bold {item.available &&
                          item.canPurchase &&
                          gameState.phase === 'marketplace' &&
                          gameState.marketplace.available
                            ? item.orbDisplay.color
                            : 'text-gray-600'} transition-colors
                                    {item.available &&
                          item.canPurchase &&
                          gameState.phase === 'marketplace' &&
                          gameState.marketplace.available
                            ? 'group-hover:text-black'
                            : ''}"
                        >
                          {item.orbDisplay.text}
                        </div>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Price section at bottom -->
              <div class="flex items-center justify-between">
                <div></div>
                <!-- Spacer -->
                <div class="flex items-center gap-0.5 sm:gap-1">
                  {#if item.available && item.cost > 0}
                    {#if item.purchaseCount > 0}
                      <div class="text-[10px] sm:text-xs opacity-60 line-through">
                        {item.baseCost}
                      </div>
                    {/if}
                    <div
                      class="text-sm sm:text-lg font-bold {item.available &&
                      item.canPurchase &&
                      gameState.phase === 'marketplace' &&
                      gameState.marketplace.available
                        ? 'text-white group-hover:text-black'
                        : 'text-gray-600'} transition-colors"
                    >
                      {item.cost}
                    </div>
                    <ChipIcon
                      size="md"
                      class="{item.available &&
                      item.canPurchase &&
                      gameState.phase === 'marketplace' &&
                      gameState.marketplace.available
                        ? 'text-white'
                        : 'text-gray-600'} transition-colors {item.available &&
                      item.canPurchase &&
                      gameState.phase === 'marketplace' &&
                      gameState.marketplace.available
                        ? 'group-hover:text-black'
                        : ''}"
                    />
                  {:else if !item.available && item.cost === 0}
                    <div class="text-xs sm:text-sm opacity-60 {item.color}">CLOSED</div>
                  {:else if !item.available}
                    <div class="text-xs sm:text-sm opacity-60">LOCKED</div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
