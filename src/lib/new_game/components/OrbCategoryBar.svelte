<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { OrbCategory, CATEGORY_INFO } from "../state/types";

    let game = $derived(game_state.current_game!);

    // Calculate category counts and percentages
    function get_category_stats(category: OrbCategory) {
        if (
            !game ||
            !game.playground_orbs ||
            game.playground_orbs.length === 0
        ) {
            return { count: 0, percentage: 0 };
        }

        const total_orbs = game.playground_orbs.length;
        const count = game.playground_orbs.filter(
            (orb) => orb.category === category,
        ).length;
        const percentage =
            total_orbs > 0 ? Math.round((count / total_orbs) * 100) : 0;

        return { count, percentage };
    }
</script>

<div class="mb-4">
    <div class="text-white text-sm font-bold mb-2 text-center uppercase">
        Orb Distribution
    </div>

    {#if game.playground_orbs.length === 0}
        <div class="text-center text-gray-400 text-xs">No orbs remaining</div>
    {:else}
        <!-- Category Boxes -->
        <div class="grid grid-cols-5 gap-2">
            {#each [OrbCategory.Bomb, OrbCategory.Health, OrbCategory.Point, OrbCategory.Multiplier, OrbCategory.Special] as category}
                {@const info = CATEGORY_INFO[category]}
                {@const stats = get_category_stats(category)}
                <div
                    class="{info.color} border border-white rounded p-2 text-center"
                >
                    <div class="text-black text-xs font-bold">
                        {info.initial}
                    </div>
                    <div class="text-black text-xs">{stats.percentage}%</div>
                </div>
            {/each}
        </div>
    {/if}
</div>
