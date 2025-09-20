<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { CATEGORY_INFO } from "../state/types";
    import { get_orb_display_text, get_orb_colors } from "../state/helpers";
    import SingleOrb from "./SingleOrb.svelte";

    let game = $derived(game_state.current_game!);
    let container: HTMLDivElement;

    // Auto-scroll to the right when new orbs are pulled
    $effect(() => {
        if (container && game.pulled_orbs.length > 3) {
            container.scrollLeft = container.scrollWidth;
        }
    });
</script>

<div bind:this={container} class="flex gap-0 overflow-x-auto scrollbar-hide mb-4 pb-2 justify-center">
    <!-- Show first 3 orbs or placeholders -->
    {#each Array(3) as _, index}
        {#if index < game.pulled_orbs.length}
            {@const orb = game.pulled_orbs[index]}
            {@const colors = get_orb_colors(orb.category)}
            {@const emoji = CATEGORY_INFO[orb.category].initial}
            <SingleOrb
                main_color={colors.main}
                accent_color={colors.accent}
                emoji={emoji}
                text={get_orb_display_text(orb)}
                show_info={true}
                size={48}
            />
        {:else}
            <!-- Placeholder orb -->
            <SingleOrb
                main_color="#374151"
                accent_color="#1f2937"
                emoji="?"
                text=""
                show_info={false}
                size={48}
            />
        {/if}
    {/each}

    <!-- Show additional orbs beyond the first 3 if any -->
    {#if game.pulled_orbs.length > 3}
        {#each game.pulled_orbs.slice(3) as orb, index}
            {@const colors = get_orb_colors(orb.category)}
            {@const emoji = CATEGORY_INFO[orb.category].initial}
            <SingleOrb
                main_color={colors.main}
                accent_color={colors.accent}
                emoji={emoji}
                text={get_orb_display_text(orb)}
                show_info={true}
                size={48}
            />
        {/each}
    {/if}
</div>
