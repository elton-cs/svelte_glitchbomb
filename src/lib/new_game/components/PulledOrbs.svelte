<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { CATEGORY_INFO } from "../state/types";
    import { get_orb_display_text } from "../state/helpers";

    let game = $derived(game_state.current_game!);
    let container: HTMLDivElement;

    // Auto-scroll to the right when new orbs are pulled
    $effect(() => {
        if (container && game.pulled_orbs.length > 3) {
            container.scrollLeft = container.scrollWidth;
        }
    });
</script>

<div bind:this={container} class="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-2 justify-center">
    <!-- Show first 3 orbs or placeholders -->
    {#each Array(3) as _, index}
        {#if index < game.pulled_orbs.length}
            {@const orb = game.pulled_orbs[index]}
            {@const categoryInfo = CATEGORY_INFO[orb.category]}
            <div
                class="{categoryInfo.color} border border-white w-12 h-12 rounded-full text-black text-xs font-mono font-bold flex-shrink-0 flex items-center justify-center"
            >
                {get_orb_display_text(orb)}
            </div>
        {:else}
            <!-- Placeholder circle -->
            <div
                class="bg-gray-800 border border-gray-600 w-12 h-12 rounded-full text-gray-500 text-xs font-mono font-bold flex-shrink-0 flex items-center justify-center"
            >
                ?
            </div>
        {/if}
    {/each}

    <!-- Show additional orbs beyond the first 3 if any -->
    {#if game.pulled_orbs.length > 3}
        {#each game.pulled_orbs.slice(3) as orb, index}
            {@const categoryInfo = CATEGORY_INFO[orb.category]}
            <div
                class="{categoryInfo.color} border border-white w-12 h-12 rounded-full text-black text-xs font-mono font-bold flex-shrink-0 flex items-center justify-center"
            >
                {get_orb_display_text(orb)}
            </div>
        {/each}
    {/if}
</div>
