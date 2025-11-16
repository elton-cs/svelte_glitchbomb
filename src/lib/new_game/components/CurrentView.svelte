<script lang="ts">
  import { game_state } from '../state/game_state.svelte';
  import { GameView } from '../state/types';

  function get_view_name(view: GameView): string {
    return GameView[view];
  }
</script>

<div class="text-center mb-6">
  <p class="text-gray-400 text-sm mb-2">Current View</p>
  <p class="text-xl font-bold text-white">{get_view_name(game_state.current_view)}</p>
</div>