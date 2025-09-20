<script lang="ts">
    import {
        game_state,
        back_to_menu,
        pull_orb,
        cash_out_and_quit,
    } from "../state/game_state.svelte";
    import { GameView } from "../state/types";
    import GameResult from "../components/GameResult.svelte";
    import OrbCategoryBar from "../components/OrbCategoryBar.svelte";
    import PulledOrbs from "../components/PulledOrbs.svelte";
    import StatusEffects from "../components/StatusEffects.svelte";
    import HealthDisplay from "../components/HealthDisplay.svelte";
    import BombDisplay from "../components/BombDisplay.svelte";
    import Button from "../components/Button.svelte";
    import OrbPullAnimation from "../components/OrbPullAnimation.svelte";

    let game = $derived(game_state.current_game!);
    let points_progress = $derived((game.points / game.milestone) * 100);
    let health_progress = $derived((game.health / game.max_health) * 100);
    let is_game_over = $derived(game.health <= 0);
    let is_win = $derived(game.points >= game.milestone);
    let show_result = $derived(is_game_over || is_win);


    // Auto-trigger Victory view for level 7 completion
    $effect(() => {
        if (is_win && game.level === 7) {
            game_state.current_view = GameView.Victory;
        }
    });
</script>

<div class="bg-black p-6 rounded-lg border border-white w-full min-h-[600px]">
    <!-- Pulled Orbs Display -->
    <PulledOrbs />

    <!-- Horizontal Stats Container: Bomb + Stats + Health -->
    <div class="flex items-center gap-4 mb-6">
        <!-- Left: Bomb display -->
        <div class="flex-shrink-0">
            <BombDisplay />
        </div>

        <!-- Center: Stats Grid -->
        <div class="flex-1">
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

        <!-- Right: Health display -->
        <div class="flex-shrink-0">
            <HealthDisplay />
        </div>
    </div>

    <!-- Status Effects Display -->
    <StatusEffects />

    <!-- Orb Category Distribution -->
    <OrbCategoryBar />

    <!-- Game Actions -->
    <div class="space-y-4">
        <!-- Orb Pull Animation -->
        <OrbPullAnimation
            disabled={game.playground_orbs.length === 0 || show_result}
            orbs_remaining={game.playground_orbs.length}
        />

        <!-- Quit & Cash Out Button - Available during active gameplay -->
        {#if !show_result}
            <Button
                onclick={cash_out_and_quit}
            >
                Cash Out (+{game.points} moonrocks)
            </Button>
        {/if}

        <Button
            onclick={back_to_menu}
        >
            Back to Menu
        </Button>
    </div>

    <!-- Victory/Loss Popup Overlay -->
    {#if show_result}
        <div class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div class="bg-black border-2 border-white rounded-lg p-6 max-w-sm mx-4 text-center pointer-events-auto">
                <GameResult {is_win} points={game.points} />
            </div>
        </div>
    {/if}
</div>
