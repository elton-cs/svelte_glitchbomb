<script lang="ts">
  import { game_state, back_to_menu, restart_from_beginning } from '../state/game_state.svelte';
  import CurrentView from '../components/CurrentView.svelte';

  let game = $derived(game_state.game!);
</script>

<div class="bg-black p-4 rounded-lg border border-white">
  <CurrentView />

  <!-- Victory Header -->
  <div class="text-center mb-8">
    <h1 class="text-6xl font-bold text-yellow-400 mb-4">VICTORY! 🏆</h1>
    <h2 class="text-2xl font-bold text-white mb-2">GAME COMPLETE!</h2>
    <p class="text-gray-300 text-sm">You have conquered all 7 levels!</p>
  </div>

  <!-- Final Stats Display -->
  <div class="bg-gray-900 p-4 rounded border border-gray-600 mb-6">
    <h3 class="text-white font-bold text-center mb-4 uppercase tracking-wide">Final Stats</h3>

    <div class="grid grid-cols-2 gap-4 text-center">
      <!-- Level -->
      <div>
        <div class="text-3xl font-bold text-purple-400 mb-1">{game.level}</div>
        <div class="text-white text-xs uppercase">Level</div>
      </div>

      <!-- Final Points -->
      <div>
        <div class="text-3xl font-bold text-green-400 mb-1">{game.points}</div>
        <div class="text-white text-xs uppercase">Final Points</div>
      </div>

      <!-- Health -->
      <div>
        <div class="text-3xl font-bold text-red-400 mb-1">{game.health}</div>
        <div class="text-white text-xs uppercase">Health</div>
      </div>

      <!-- Multiplier -->
      <div>
        <div class="text-3xl font-bold text-blue-400 mb-1">{game.multiplier}x</div>
        <div class="text-white text-xs uppercase">Multiplier</div>
      </div>

      <!-- Orbs Purchased -->
      <div>
        <div class="text-3xl font-bold text-orange-400 mb-1">{game.purchased_orbs.length}</div>
        <div class="text-white text-xs uppercase">Orbs Bought</div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="space-y-4">
    <button
      onclick={restart_from_beginning}
      class="w-full px-4 py-3 bg-white text-black font-bold uppercase tracking-wide border-2 border-white hover:bg-black hover:text-white transition-colors"
    >
      Restart Game
    </button>

    <button
      onclick={back_to_menu}
      class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
    >
      Main Menu
    </button>
  </div>
</div>