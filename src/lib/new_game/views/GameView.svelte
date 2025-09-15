<script lang="ts">
  import { game_state, back_to_menu, pull_orb, restart_game } from '../state/game_state.svelte';
  import CurrentView from '../components/CurrentView.svelte';
  import GameResult from '../components/GameResult.svelte';
  import PlaygroundOrbs from '../components/PlaygroundOrbs.svelte';

  let game = $derived(game_state.game!);
  let points_progress = $derived((game.points / game.milestone) * 100);
  let health_progress = $derived((game.health / game.max_health) * 100);
  let is_game_over = $derived(game.health <= 0);
  let is_win = $derived(game.points >= game.milestone);
  let show_result = $derived(is_game_over || is_win);
</script>

<div class="bg-black p-4 rounded-lg border border-white">
  <CurrentView />

  <!-- Game Stats - Always Visible -->
  <div class="text-center mb-6">
    <h2 class="text-3xl font-bold text-white">LEVEL {game.level}</h2>
  </div>

  <div class="grid grid-cols-3 gap-3 text-center mb-6">
    <!-- Chips -->
    <div>
      <div class="text-2xl font-bold text-yellow-400 mb-1">{game.chips}</div>
      <div class="text-white text-xs uppercase">Chips</div>
    </div>

    <!-- Multiplier -->
    <div>
      <div class="text-2xl font-bold text-blue-400 mb-1">{game.multiplier}x</div>
      <div class="text-white text-xs uppercase">Mult</div>
    </div>

    <!-- Level -->
    <div>
      <div class="text-2xl font-bold text-purple-400 mb-1">{game.level}</div>
      <div class="text-white text-xs uppercase">Level</div>
    </div>
  </div>

  <!-- Points Progress Bar -->
  <div class="mb-6">
    <div class="text-green-400 text-sm font-bold mb-2 text-center uppercase">
      Points {game.points}/{game.milestone}
    </div>
    <div class="bg-gray-800 rounded h-8 border border-gray-600">
      <div
        class="bg-white h-full rounded transition-all duration-300"
        style="width: {Math.min(100, points_progress)}%"
      ></div>
    </div>
  </div>

  <!-- Health Bar -->
  <div class="mb-6">
    <div class="text-red-400 text-sm font-bold mb-2 text-center uppercase">
      Health {game.health}/{game.max_health}
    </div>
    <div class="bg-gray-800 rounded h-8 border border-gray-600">
      <div
        class="bg-red-500 h-full rounded transition-all duration-300"
        style="width: {Math.min(100, health_progress)}%"
      ></div>
    </div>
  </div>

  <!-- Game Result Component - Shows when game ends -->
  {#if show_result}
    <div class="mb-6">
      <GameResult is_win={is_win} />
    </div>
  {/if}

  <!-- Playground Orbs Display -->
  <PlaygroundOrbs />

  <!-- Game Actions -->
  <div class="space-y-4">
    <button
      onclick={pull_orb}
      disabled={game.playground_orbs.length === 0 || show_result}
      class="w-full px-4 py-3 bg-white text-black font-bold uppercase tracking-wide border-2 border-white hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      Pull Orb ({game.playground_orbs.length} left)
    </button>

    {#if show_result}
      <button
        onclick={restart_game}
        class="w-full px-4 py-3 bg-green-600 text-white font-bold uppercase tracking-wide border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-colors"
      >
        Restart Game
      </button>
    {/if}

    <button
      onclick={back_to_menu}
      class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
    >
      Back to Menu
    </button>
  </div>
</div>