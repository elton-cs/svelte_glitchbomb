<script lang="ts">
  import { init_game } from '../state/game_state.svelte';
  import CurrentView from '../components/CurrentView.svelte';

  function start_game() {
    init_game();
  }
</script>

<div class="bg-black p-4 rounded-lg border border-white">
  <div class="text-center mb-6">
    <h1 class="text-4xl font-bold text-white mb-2">GLITCH BOMB</h1>
    <p class="text-sm text-gray-400">Mobile Version</p>
  </div>

  <CurrentView />

  <button
    onclick={start_game}
    class="w-full px-6 py-3 bg-white text-black font-bold uppercase tracking-wide border-2 border-white hover:bg-black hover:text-white transition-colors"
  >
    Start Game
  </button>
</div>