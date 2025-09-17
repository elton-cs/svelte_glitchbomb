<script lang="ts">
  import { init_game, game_state } from '../state/game_state.svelte';
  import { get_level_cost } from '../state/helpers';
  import CurrentView from '../components/CurrentView.svelte';
  import Button from '../components/Button.svelte';

  let level_1_cost = get_level_cost(1);
  let can_afford = $derived(game_state.player.moonrocks >= level_1_cost);
  let error_message = $state('');

  function start_game() {
    const success = init_game();
    if (!success) {
      error_message = 'Insufficient moonrocks to start the game!';
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
  <div class="text-center mb-6">
    <h1 class="text-4xl font-bold text-white mb-2">GLITCH BOMB</h1>
    <p class="text-sm text-gray-400">Mobile Version</p>
  </div>

  <CurrentView />

  <!-- Moonrocks Balance -->
  <div class="text-center mb-6">
    <div class="text-3xl font-bold text-purple-400 mb-1">{game_state.player.moonrocks}</div>
    <div class="text-white text-xs uppercase">Moonrocks</div>
  </div>

  <!-- Game Cost Info -->
  <div class="text-center mb-6">
    <div class="text-gray-300 text-sm mb-2">Starting a game costs:</div>
    <div class="text-yellow-400 text-lg font-bold">{level_1_cost} Moonrocks</div>
  </div>

  <!-- Messages -->
  {#if game_state.cash_out_message}
    <div class="bg-green-900 border border-green-500 text-green-300 px-4 py-2 rounded mb-4 text-center text-sm">
      {game_state.cash_out_message}
    </div>
  {/if}

  {#if error_message}
    <div class="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-center text-sm">
      {error_message}
    </div>
  {/if}

  <Button
    onclick={start_game}
    disabled={!can_afford}
    size="large"
  >
    {can_afford ? 'Start Game' : 'Insufficient Moonrocks'}
  </Button>
</div>