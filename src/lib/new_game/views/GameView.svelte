<script lang="ts">
    import {
        game_state,
        back_to_menu,
        pull_orb,
        restart_game,
        enter_shop_and_pay,
        cash_out_and_quit,
        cash_out_after_win,
    } from "../state/game_state.svelte";
    import { GameView } from "../state/types";
    import { get_level_cost, can_afford_level } from "../state/helpers";
    import GameResult from "../components/GameResult.svelte";
    import OrbCategoryBar from "../components/OrbCategoryBar.svelte";
    import PulledOrbs from "../components/PulledOrbs.svelte";
    import StatusEffects from "../components/StatusEffects.svelte";
    import HealthDisplay from "../components/HealthDisplay.svelte";
    import BombDisplay from "../components/BombDisplay.svelte";

    let game = $derived(game_state.current_game!);
    let points_progress = $derived((game.points / game.milestone) * 100);
    let health_progress = $derived((game.health / game.max_health) * 100);
    let is_game_over = $derived(game.health <= 0);
    let is_win = $derived(game.points >= game.milestone);
    let show_result = $derived(is_game_over || is_win);

    // Next level calculations for button display
    let next_level = $derived(game.level + 1);
    let next_level_cost = $derived(get_level_cost(next_level));
    let can_afford_next_level = $derived(
        can_afford_level(game_state.player, next_level),
    );

    // Restart game calculations (level 1 cost)
    let restart_cost = $derived(get_level_cost(1));
    let can_afford_restart = $derived(can_afford_level(game_state.player, 1));

    // Auto-trigger Victory view for level 7 completion
    $effect(() => {
        if (is_win && game.level === 7) {
            game_state.current_view = GameView.Victory;
        }
    });
</script>

<div class="bg-black p-6 rounded-lg border border-white w-full min-h-[600px]">
    <div class="flex">
        <!-- Left edge: Bomb display -->
        <div class="w-12 flex items-center justify-center">
            <BombDisplay />
        </div>

        <!-- Center: Main game content -->
        <div class="flex-1 px-6">
            <!-- Pulled Orbs Display -->
            <PulledOrbs />

            <div class="grid grid-cols-2 gap-3 text-center mb-4">
                <!-- Top Row: Moonrocks and Chips -->
                <div>
                    <div class="text-2xl font-bold text-purple-400 mb-1">
                        {game_state.player.moonrocks}
                    </div>
                    <div class="text-white text-xs uppercase">Moonrocks</div>
                </div>

                <div>
                    <div class="text-2xl font-bold text-yellow-400 mb-1">
                        {game.glitchchips}
                    </div>
                    <div class="text-white text-xs uppercase">Chips</div>
                </div>
            </div>

            <div class="mb-6">
                <!-- Stats Grid with Progress Bar -->
                <div class="grid grid-cols-2 gap-3 text-center mb-4">
                    <!-- Bottom Row: Multiplier and Level -->
                    <div>
                        <div class="text-2xl font-bold text-blue-400 mb-1">
                            {game.multiplier}x
                        </div>
                        <div class="text-white text-xs uppercase">Mult</div>
                    </div>

                    <div>
                        <div class="text-2xl font-bold text-green-400 mb-1">
                            {game.level}
                        </div>
                        <div class="text-white text-xs uppercase">Level</div>
                    </div>
                </div>

                <!-- Points Progress Bar -->
                <div>
                    <div
                        class="text-green-400 text-sm font-bold mb-2 text-center uppercase"
                    >
                        Points {game.points}/{game.milestone}
                    </div>
                    <div class="bg-gray-800 rounded h-8 border border-gray-600">
                        <div
                            class="bg-white h-full rounded transition-all duration-300"
                            style="width: {Math.min(100, points_progress)}%"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Status Effects Display -->
            <StatusEffects />

            <!-- Orb Category Distribution -->
            <OrbCategoryBar />

            <!-- Game Actions -->
            <div class="space-y-4">
                <button
                    onclick={pull_orb}
                    disabled={game.playground_orbs.length === 0 || show_result}
                    class="w-full px-4 py-3 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Pull Orb ({game.playground_orbs.length} left)
                </button>

                <!-- Quit & Cash Out Button - Available during active gameplay -->
                {#if !show_result}
                    <button
                        onclick={cash_out_and_quit}
                        class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
                    >
                        Cash Out (+{game.points} moonrocks)
                    </button>
                {/if}

                {#if show_result}
                    {#if is_win}
                        <!-- Two options after winning -->
                        {#if game.level < 7}
                            <!-- For levels 1-6: Next Level or Cash Out -->
                            <button
                                onclick={enter_shop_and_pay}
                                disabled={!can_afford_next_level}
                                class="w-full px-4 py-3 font-bold uppercase tracking-wide border-2 transition-colors {can_afford_next_level
                                    ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                                    : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'}"
                            >
                                {can_afford_next_level
                                    ? `Next Level (-${next_level_cost} moonrocks)`
                                    : `Insufficient Moonrocks (-${next_level_cost})`}
                            </button>
                            <button
                                onclick={cash_out_after_win}
                                class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
                            >
                                Cash Out (+{game.points} moonrocks)
                            </button>
                        {:else}
                            <!-- For level 7: Only cash out since game is complete -->
                            <button
                                onclick={cash_out_after_win}
                                class="w-full px-4 py-3 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
                            >
                                Cash Out (+{game.points} moonrocks)
                            </button>
                        {/if}
                    {:else}
                        <!-- Game over: Only restart, no cash out allowed -->
                        <button
                            onclick={restart_game}
                            disabled={!can_afford_restart}
                            class="w-full px-4 py-3 font-bold uppercase tracking-wide border-2 transition-colors {can_afford_restart
                                ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                                : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'}"
                        >
                            {can_afford_restart
                                ? `Restart Game (-${restart_cost} moonrocks)`
                                : `Insufficient Moonrocks (-${restart_cost})`}
                        </button>
                    {/if}
                {/if}

                <button
                    onclick={back_to_menu}
                    class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        </div>

        <!-- Right edge: Health display -->
        <div class="w-12 flex items-center justify-center">
            <HealthDisplay />
        </div>
    </div>

    <!-- Victory/Loss Popup Overlay -->
    {#if show_result}
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-black border-2 border-white rounded-lg p-6 max-w-sm mx-4 text-center">
                <GameResult {is_win} points={game.points} />
            </div>
        </div>
    {/if}
</div>
