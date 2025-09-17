<script lang="ts">
    import {
        game_state,
        back_to_menu,
        restart_from_beginning,
    } from "../state/game_state.svelte";
    import { get_level_cost } from "../state/helpers";
    import CurrentView from "../components/CurrentView.svelte";
    import Button from "../components/Button.svelte";

    let game = $derived(game_state.current_game!);
    let restart_cost = get_level_cost(1);
    let can_afford_restart = $derived(game_state.player.moonrocks >= restart_cost);
    let error_message = $state('');

    function handle_restart() {
        const success = restart_from_beginning();
        if (!success) {
            error_message = 'Insufficient moonrocks to restart!';
            // Clear error message after 3 seconds
            setTimeout(() => {
                error_message = '';
            }, 3000);
        } else {
            error_message = '';
        }
    }
</script>

<div class="bg-black p-6 rounded-lg border border-white w-full min-h-[600px]">
    <CurrentView />

    <!-- Victory Header -->
    <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-yellow-400 mb-4">VICTORY! 🏆</h1>
        <h2 class="text-2xl font-bold text-white mb-2">GAME COMPLETE!</h2>
        <p class="text-gray-300 text-sm">You have conquered all 7 levels!</p>
    </div>

    <!-- Final Stats Display -->
    <div class="bg-gray-900 p-4 rounded border border-gray-600 mb-6">
        <h3
            class="text-white font-bold text-center mb-4 uppercase tracking-wide"
        >
            Final Stats
        </h3>

        <div class="space-y-4">
            <!-- Top Row: 2 items -->
            <div class="grid grid-cols-2 gap-4 text-center">
                <!-- Level -->
                <div>
                    <div class="text-3xl font-bold text-purple-400 mb-1">
                        {game.level}
                    </div>
                    <div class="text-white text-xs uppercase">Level</div>
                </div>

                <!-- Final Points -->
                <div>
                    <div class="text-3xl font-bold text-green-400 mb-1">
                        {game.points}
                    </div>
                    <div class="text-white text-xs uppercase">Final Points</div>
                </div>
            </div>

            <!-- Middle Row: 2 items -->
            <div class="grid grid-cols-2 gap-4 text-center">
                <!-- Moonrocks -->
                <div>
                    <div class="text-3xl font-bold text-purple-400 mb-1">
                        {game_state.player.moonrocks}
                    </div>
                    <div class="text-white text-xs uppercase">Moonrocks</div>
                </div>

                <!-- Health -->
                <div>
                    <div class="text-3xl font-bold text-red-400 mb-1">
                        {game.health}
                    </div>
                    <div class="text-white text-xs uppercase">Health</div>
                </div>
            </div>

            <!-- Bottom Row: 2 items -->
            <div class="grid grid-cols-2 gap-4 text-center">
                <!-- Multiplier -->
                <div>
                    <div class="text-3xl font-bold text-blue-400 mb-1">
                        {game.multiplier}x
                    </div>
                    <div class="text-white text-xs uppercase">Multiplier</div>
                </div>

                <!-- Orbs Purchased -->
                <div>
                    <div class="text-3xl font-bold text-orange-400 mb-1">
                        {game.purchased_orbs.length}
                    </div>
                    <div class="text-white text-xs uppercase">Orbs Bought</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Error Message -->
    {#if error_message}
        <div class="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-center text-sm">
            {error_message}
        </div>
    {/if}

    <!-- Action Buttons -->
    <div class="space-y-4">
        <Button
            onclick={handle_restart}
            disabled={!can_afford_restart}
            variant="secondary"
            size="large"
        >
            {can_afford_restart
                ? `Restart Game (${restart_cost} Moonrocks)`
                : `Insufficient Moonrocks (Need ${restart_cost})`
            }
        </Button>

        <Button
            onclick={back_to_menu}
        >
            Main Menu
        </Button>
    </div>
</div>
