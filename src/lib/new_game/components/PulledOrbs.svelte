<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { CATEGORY_INFO } from "../state/types";
    import { get_orb_display_text } from "../state/helpers";

    let game = $derived(game_state.current_game!);
</script>

{#if game.pulled_orbs.length > 0}
    <div class="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-2">
        {#each game.pulled_orbs as orb, index}
            {@const categoryInfo = CATEGORY_INFO[orb.category]}
            <div
                class="{categoryInfo.color} border border-white px-3 py-2 rounded text-black text-sm font-mono font-bold flex-shrink-0"
            >
                {get_orb_display_text(orb)}
            </div>
        {/each}
    </div>
{/if}
