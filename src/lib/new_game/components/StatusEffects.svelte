<script lang="ts">
    import { game_state } from "../state/game_state.svelte";

    let game = $derived(game_state.current_game);
    let has_active_effects = $derived(game && game.bomb_immunity_effect.is_active);
</script>

{#if has_active_effects}
    <div class="mb-4 p-3 bg-black border border-white rounded">
        <div class="text-xs uppercase text-gray-400 mb-2 tracking-wide">Active Effects</div>

        <!-- Bomb Immunity Effect -->
        {#if game && game.bomb_immunity_effect.is_active}
            <div class="flex items-center justify-between bg-gray-900 border border-gray-700 rounded p-2">
                <div class="flex items-center gap-2">
                    <span class="text-lg">🛡️</span>
                    <span class="text-white text-sm font-bold">Bomb Immunity</span>
                </div>
                <div class="text-yellow-400 font-bold text-sm">
                    {game.bomb_immunity_effect.turns_remaining} {game.bomb_immunity_effect.turns_remaining === 1 ? 'turn' : 'turns'}
                </div>
            </div>
        {/if}

        <!-- Future status effects can be added here -->
    </div>
{/if}