<script lang="ts">
  import { gameState, initGame } from '../state/game_state.svelte';
  import { GameView } from '../state/types';

  function getViewName(view: GameView): string {
    return GameView[view];
  }

  function startGame() {
    initGame();
  }
</script>

<div class="p-4">
  <h2 class="text-2xl font-bold mb-4">Game State</h2>
  <p class="text-lg mb-4">Current View: <span class="font-semibold text-blue-500">{getViewName(gameState.currentView)}</span></p>

  <button
    onclick={startGame}
    class="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
  >
    Start Game
  </button>
</div>