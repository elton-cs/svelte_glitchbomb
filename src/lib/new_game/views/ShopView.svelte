<script lang="ts">
    import {
        game_state,
        back_to_menu,
        buy_item,
        continue_to_next_level,
    } from "../state/game_state.svelte";
    import { CATEGORY_INFO, type ShopItem } from "../state/types";
    import { get_modifier_text, get_rarity_name, get_orb_display, get_tier_border_color } from "../state/helpers";
    import CurrentView from "../components/CurrentView.svelte";
    import Button from "../components/Button.svelte";

    let game = $derived(game_state.current_game!);
    let next_level = $derived(game.level + 1);

    // Get next level milestone
    function get_next_level_milestone(current_level: number): number {
        const milestones = [12, 18, 28, 44, 70, 100, 150];
        if (current_level >= milestones.length) return 150;
        return milestones[current_level]; // current_level is 1-indexed, so this gets next milestone
    }

    // Handle continuing to next level (payment already completed)
    function handle_continue_to_next_level() {
        continue_to_next_level();
    }

    // Purchase item with sound feedback (simplified without audio)
    function purchase_with_feedback(index: number) {
        const success = buy_item(index);
        if (!success) {
            console.log("Purchase failed - not enough chips");
        }
    }

    // Map shop items to enhanced display format
    const enhanced_shop_items = $derived.by(() => {
        return game.shop_items.map((item, index) => {
            const orb_display = get_orb_display(item);
            const tier_border = get_tier_border_color(item.rarity.rarity);
            const can_afford = game.glitchchips >= item.price;

            return {
                id: `shop_item_${index}`,
                name: get_rarity_name(item),
                modifier_text: get_modifier_text(item),
                cost: item.price,
                base_cost: item.base_price,
                purchase_count: item.purchase_count,
                available: true,
                can_purchase: can_afford,
                is_shop_item: true,
                orb_display,
                tier_border,
                index
            };
        });
    });
</script>

<div class="bg-black p-2 rounded-lg shadow-sm border border-white h-full flex flex-col">
    <CurrentView />

    <!-- Header with Balance -->
    <div class="flex items-center justify-between mb-2">
        <div>
            <h2 class="text-lg font-bold text-white mb-1">MOD SHOP</h2>
            <div class="text-purple-400 text-sm font-bold">
                Level {game.level}
            </div>
        </div>
        <div class="text-right">
            <div class="text-sm font-bold text-yellow-400 flex items-center gap-1">
                BALANCE: <span class="text-lg">{game.glitchchips}</span> <span class="text-lg">🪙</span>
            </div>
            <div class="text-xs text-purple-400">
                MOONROCKS: {game_state.player.moonrocks}
            </div>
        </div>
    </div>

    <!-- Shop Grid - Fixed 3x2 layout -->
    <div class="grid grid-cols-3 grid-rows-2 gap-2 flex-1 mb-4">
        {#each enhanced_shop_items as item}
            <button
                disabled={!item.available || !item.can_purchase}
                onclick={item.available && item.can_purchase ? () => purchase_with_feedback(item.index) : undefined}
                class="group relative p-2 rounded text-sm font-medium transition-colors border {item.tier_border} min-h-0 overflow-hidden
                       {item.available && item.can_purchase
                         ? 'bg-black text-white hover:bg-white hover:text-black'
                         : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-50'}"
            >
                <!-- Purchase count badge -->
                {#if item.purchase_count > 0}
                    <div class="absolute bottom-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center z-10 border transition-colors
                                {item.available && item.can_purchase
                                  ? 'bg-black text-white border-white group-hover:bg-white group-hover:text-black group-hover:border-black'
                                  : 'bg-gray-800 text-gray-600 border-gray-600'}">
                        {item.purchase_count}x
                    </div>
                {/if}

                <div class="h-full w-full flex flex-col">
                    <!-- Stacked layout: Name, Inner Card, Price -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="flex-1 flex flex-col justify-start">
                            {#if item.name}
                                <div class="font-bold uppercase text-xs leading-tight mb-2">{item.name}</div>
                            {/if}

                            <!-- Inner card view with orb display -->
                            {#if item.orb_display}
                                <div class="flex-1 flex items-center justify-center mb-2">
                                    <div class="border-2 {item.available && item.can_purchase ? item.orb_display.border_color : 'border-gray-600'} bg-black rounded px-3 py-2 flex flex-col items-center justify-center min-h-16 min-w-16 transition-colors
                                                {item.available && item.can_purchase
                                                  ? 'group-hover:bg-white group-hover:border-black'
                                                  : ''}">
                                        <div class="text-xl mb-1">{item.orb_display.icon}</div>
                                        {#if item.orb_display.is_chip_orb}
                                            <div class="flex items-center gap-1">
                                                <div class="text-sm font-bold {item.available && item.can_purchase ? item.orb_display.color : 'text-gray-600'} transition-colors
                                                            {item.available && item.can_purchase
                                                              ? 'group-hover:text-black'
                                                              : ''}">{item.orb_display.text}</div>
                                                <span class="text-sm {item.available && item.can_purchase ? item.orb_display.color : 'text-gray-600'} transition-colors {item.available && item.can_purchase ? 'group-hover:text-black' : ''}">🪙</span>
                                            </div>
                                        {:else}
                                            <div class="text-sm font-bold {item.available && item.can_purchase ? item.orb_display.color : 'text-gray-600'} transition-colors
                                                        {item.available && item.can_purchase
                                                          ? 'group-hover:text-black'
                                                          : ''}">{item.orb_display.text}</div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Price section at bottom -->
                        <div class="flex items-center justify-between">
                            <div></div> <!-- Spacer -->
                            <div class="flex items-center gap-1">
                                {#if item.available && item.cost > 0}
                                    {#if item.purchase_count > 0}
                                        <div class="text-xs opacity-60 line-through">{item.base_cost}</div>
                                    {/if}
                                    <div class="text-lg font-bold {item.available && item.can_purchase ? 'text-white group-hover:text-black' : 'text-gray-600'} transition-colors">{item.cost}</div>
                                    <span class="text-lg {item.available && item.can_purchase ? 'text-white' : 'text-gray-600'} transition-colors {item.available && item.can_purchase ? 'group-hover:text-black' : ''}">🪙</span>
                                {:else if !item.available && item.cost === 0}
                                    <div class="text-sm opacity-60 text-gray-500">CLOSED</div>
                                {:else if !item.available}
                                    <div class="text-sm opacity-60">LOCKED</div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        {/each}
    </div>

    <!-- Milestone and Navigation -->
    <div class="text-center mb-4">
        {#if game.level < 7}
            <div class="text-gray-400 text-xs mb-3">
                Next Level Milestone: {get_next_level_milestone(game.level)}
            </div>
        {:else}
            <div class="text-green-400 text-xs mb-3">Final Level Complete!</div>
        {/if}
    </div>

    <div class="space-y-3">
        {#if game.level < 7}
            <Button
                onclick={handle_continue_to_next_level}
                size="large"
            >
                Continue to Level {next_level}
            </Button>
        {:else}
            <Button
                onclick={back_to_menu}
                size="large"
                class="bg-green-500 border-green-500 hover:bg-white hover:text-green-500"
            >
                Game Complete! Return to Menu
            </Button>
        {/if}

        <Button
            onclick={back_to_menu}
        >
            Back to Menu
        </Button>
    </div>
</div>
