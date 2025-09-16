<script lang="ts">
    import { game_state } from "../state/game_state.svelte";
    import { ModifierType, type Orb, type Modifier } from "../state/types";

    let game = $derived(game_state.current_game!);

    // Get modifier initial from type
    function get_modifier_initial(type: ModifierType): string {
        switch (type) {
            case ModifierType.Point:
                return "P";
            case ModifierType.Health:
                return "H";
            case ModifierType.Bomb:
                return "B";
            case ModifierType.Multiplier:
                return "M";
            default:
                return "?";
        }
    }

    // Generate display text for an orb (e.g., "B3", "P5H1", "B3M5")
    function get_orb_display_text(orb: Orb): string {
        return orb.modifiers
            .map(
                (modifier: Modifier) =>
                    `${get_modifier_initial(modifier.type)}${modifier.value.value}`,
            )
            .join("");
    }
</script>

<div class="mb-6">
    <div class="text-white text-sm font-bold mb-3 text-center uppercase">
        Playground Orbs
    </div>

    {#if game.playground_orbs.length === 0}
        <div class="text-center text-gray-400 text-sm">No orbs remaining</div>
    {:else}
        <div class="flex flex-wrap gap-2 justify-center">
            {#each game.playground_orbs as orb, index}
                <div
                    class="bg-gray-800 border border-white px-3 py-2 rounded text-white text-sm font-mono"
                >
                    {get_orb_display_text(orb)}
                </div>
            {/each}
        </div>
    {/if}
</div>
