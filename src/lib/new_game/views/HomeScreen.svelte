<script lang="ts">
  import { game_state, init_game } from '../state/game_state.svelte';
  import { GameView } from '../state/types';

  function get_view_name(view: GameView): string {
    return GameView[view];
  }

  function start_game() {
    init_game();
  }
</script>

<div class="bg-black p-4 rounded-lg border border-white">
  <div class="text-center mb-6">
    <h1 class="text-4xl font-bold text-white mb-2">GLITCH BOMB</h1>
    <p class="text-sm text-gray-400">Mobile Version</p>
  </div>

  <div class="text-center mb-6">
    <p class="text-gray-400 text-sm mb-2">Current View</p>
    <p class="text-xl font-bold text-white">{get_view_name(game_state.current_view)}</p>
  </div>

  <button
    onclick={start_game}
    class="w-full px-6 py-3 bg-white text-black font-bold uppercase tracking-wide border-2 border-white hover:bg-black hover:text-white transition-colors"
  >
    Start Game
  </button>
</div>