<script lang="ts">
    import { game_state } from '../state/game_state.svelte';

    let game = $derived(game_state.current_game!);
    let health_hearts = $derived(() => {
        const hearts = [];
        for (let i = 0; i < game.max_health; i++) {
            hearts.push(i < game.health);
        }
        return hearts;
    });
</script>

<div class="health-display flex flex-col-reverse items-center justify-evenly">
    {#each health_hearts() as is_filled, index}
        <div class="heart-container">
            <img
                src="/src/assets/{is_filled ? 'red_heart' : 'black_heart'}.png"
                alt="{is_filled ? 'Full' : 'Empty'} Heart"
                width="32"
                height="32"
                class="heart-image transition-all duration-300"
                style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
            />
        </div>
    {/each}
</div>

<style>
    .health-display {
        min-height: 120px;
        width: 32px;
    }

    .heart-container {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>