<script lang="ts">
    import { game_state } from '../state/game_state.svelte';
    import { ModifierType } from '../state/types';

    let game = $derived(game_state.current_game!);

    // Count bombs by damage value in the bag (starting + purchased)
    let bombs_by_type = $derived(() => {
        const all_orbs = [...game.starting_orbs, ...game.purchased_orbs];
        const bomb_counts = { 1: 0, 2: 0, 3: 0 };

        all_orbs.forEach(orb => {
            const bomb_modifier = orb.modifiers.find(mod => mod.type === ModifierType.Bomb);
            if (bomb_modifier) {
                const damage_value = bomb_modifier.value.value;
                if (damage_value >= 1 && damage_value <= 3) {
                    bomb_counts[damage_value as 1 | 2 | 3]++;
                }
            }
        });

        return bomb_counts;
    });

    // Count pulled bombs by damage value
    let pulled_bombs_by_type = $derived(() => {
        const pulled_counts = { 1: 0, 2: 0, 3: 0 };

        game.pulled_orbs.forEach(orb => {
            const bomb_modifier = orb.modifiers.find(mod => mod.type === ModifierType.Bomb);
            if (bomb_modifier) {
                const damage_value = bomb_modifier.value.value;
                if (damage_value >= 1 && damage_value <= 3) {
                    pulled_counts[damage_value as 1 | 2 | 3]++;
                }
            }
        });

        return pulled_counts;
    });

    // Generate bomb display array with type information
    let bomb_display = $derived(() => {
        const display = [];

        // For each bomb type (1, 2, 3)
        for (let bomb_type = 1; bomb_type <= 3; bomb_type++) {
            const total_of_type = bombs_by_type()[bomb_type as 1 | 2 | 3];
            const pulled_of_type = pulled_bombs_by_type()[bomb_type as 1 | 2 | 3];

            // Add each bomb of this type to display
            for (let i = 0; i < total_of_type; i++) {
                display.push({
                    bomb_type: bomb_type,
                    is_pulled: i < pulled_of_type
                });
            }
        }

        return display;
    });
</script>

<div class="bomb-display flex flex-col-reverse items-center gap-1">
    {#each bomb_display() as bomb_info, index}
        <div class="bomb-container">
            <img
                src="/src/assets/bomb{bomb_info.bomb_type}.png"
                alt="Bomb {bomb_info.bomb_type}"
                width="32"
                height="32"
                class="bomb-image transition-all duration-300 {bomb_info.is_pulled ? 'pulled' : 'unpulled'}"
                style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
            />
        </div>
    {/each}
</div>

<style>
    .bomb-display {
        min-height: 120px;
        width: 32px;
    }

    .bomb-container {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bomb-image {
        transition: filter 0.3s ease;
    }

    .bomb-image.unpulled {
        filter: grayscale(100%) brightness(0.5);
    }

    .bomb-image.pulled {
        filter: none;
    }
</style>