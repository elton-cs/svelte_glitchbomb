<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { CATEGORY_INFO } from "../state/types";
    import { get_orb_display_text } from "../state/helpers";

    let game = $derived(game_state.current_game!);
</script>

<div class="mb-6">
    <div class="text-white text-sm font-bold mb-3 text-center uppercase">
        Pulled Orbs
    </div>

    {#if game.pulled_orbs.length === 0}
        <div class="text-center text-gray-400 text-sm">No orbs pulled yet</div>
    {:else}
        <div class="flex flex-wrap gap-2 justify-start">
            {#each game.pulled_orbs as orb, index}
                {@const categoryInfo = CATEGORY_INFO[orb.category]}
                <div
                    class="{categoryInfo.color} border border-white px-3 py-2 rounded text-black text-sm font-mono font-bold"
                >
                    {get_orb_display_text(orb)}
                </div>
            {/each}
        </div>
    {/if}
</div>
