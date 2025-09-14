<script lang="ts">
  import { gameState } from '../state/game_state.svelte';
  import { GameView } from '../state/types';

  function getViewName(view: GameView): string {
    return GameView[view];
  }
</script>

<div class="p-4">
  <h2 class="text-2xl font-bold mb-4">Game State</h2>
  <p class="text-lg">Current View: <span class="font-semibold text-blue-500">{getViewName(gameState.currentView)}</span></p>
</div>