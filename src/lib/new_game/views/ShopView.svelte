<script lang="ts">
    import {
        game_state,
        back_to_menu,
        buy_item,
        continue_to_next_level,
    } from "../state/game_state.svelte";
    import { CATEGORY_INFO, type ShopItem } from "../state/types";
    import { get_modifier_text, get_rarity_name } from "../state/helpers";
    import CurrentView from "../components/CurrentView.svelte";

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


    // Purchase item
    function purchase(index: number) {
        const success = buy_item(index);
        if (!success) {
            // Could add feedback for failed purchase
            console.log("Purchase failed - not enough chips");
        }
    }
</script>

<div class="bg-black p-6 rounded-lg border border-white w-full min-h-[600px]">
    <CurrentView />

    <div class="text-center mb-6">
        <h2 class="text-4xl font-bold text-white mb-2">SHOP</h2>
        <div class="text-purple-400 text-sm font-bold mb-1">
            Level {game.level}
        </div>

        <!-- Moonrocks and Chips Display -->
        <div class="grid grid-cols-2 gap-4 mb-2">
            <div>
                <div class="text-purple-400 text-lg font-bold">
                    {game_state.player.moonrocks}
                </div>
                <div class="text-white text-xs uppercase">Moonrocks</div>
            </div>
            <div>
                <div class="text-yellow-400 text-lg font-bold">
                    {game.glitchchips}
                </div>
                <div class="text-white text-xs uppercase">Chips</div>
            </div>
        </div>

        {#if game.level < 7}
            <div class="text-gray-400 text-xs">
                Next Level Milestone: {get_next_level_milestone(game.level)}
            </div>
        {:else}
            <div class="text-green-400 text-xs mt-1">Final Level Complete!</div>
        {/if}
    </div>

    <!-- Shop Items Grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
        {#each game.shop_items as item, index}
            {@const category_info = CATEGORY_INFO[item.orb.category]}
            {@const can_afford = game.glitchchips >= item.price}
            <div class="border border-white rounded p-3 bg-gray-900">
                <!-- Item Header -->
                <div class="flex items-center justify-between mb-2">
                    <div
                        class="{category_info.color} px-2 py-1 rounded text-black text-xs font-bold"
                    >
                        {get_modifier_text(item)}
                    </div>
                    <div
                        class="{item.rarity
                            .color} px-2 py-1 rounded text-white text-xs font-bold"
                    >
                        {get_rarity_name(item)}
                    </div>
                </div>

                <!-- Price and Buy Button -->
                <div class="text-center">
                    <div class="text-yellow-400 font-bold mb-2">
                        {item.price} chips
                    </div>
                    <button
                        onclick={() => purchase(index)}
                        disabled={!can_afford}
                        class="w-full px-3 py-2 text-xs font-bold uppercase tracking-wide border transition-colors {can_afford
                            ? 'bg-white text-black border-white hover:bg-black hover:text-white'
                            : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'}"
                    >
                        {can_afford ? "Buy" : "Too Expensive"}
                    </button>
                </div>
            </div>
        {/each}
    </div>


    <div class="space-y-3">
        {#if game.level < 7}
            <button
                onclick={handle_continue_to_next_level}
                class="w-full px-4 py-3 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
            >
                Continue to Level {next_level}
            </button>
        {:else}
            <button
                onclick={back_to_menu}
                class="w-full px-4 py-3 bg-green-500 text-white font-bold uppercase tracking-wide border-2 border-green-500 hover:bg-white hover:text-green-500 transition-colors"
            >
                Game Complete! Return to Menu
            </button>
        {/if}

        <button
            onclick={back_to_menu}
            class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
        >
            Back to Menu
        </button>
    </div>
</div>
