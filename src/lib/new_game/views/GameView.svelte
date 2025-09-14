<script lang="ts">
  import { gameState } from '../state/game_state.svelte';

  $: game = gameState.game!;
  $: pointsProgress = (game.points / game.milestone) * 100;
  $: healthProgress = (game.health / game.max_health) * 100;
</script>

<div class="p-4 space-y-6">
  <h2 class="text-2xl font-bold mb-4">Game</h2>

  <div class="grid grid-cols-2 gap-4">
    <!-- Level -->
    <div class="bg-gray-900 p-4 rounded border border-gray-700">
      <div class="text-sm text-gray-400 mb-1">Level</div>
      <div class="text-2xl font-bold">{game.level}</div>
    </div>

    <!-- Multiplier -->
    <div class="bg-gray-900 p-4 rounded border border-gray-700">
      <div class="text-sm text-gray-400 mb-1">Multiplier</div>
      <div class="text-2xl font-bold">{game.multiplier}x</div>
    </div>
  </div>

  <!-- Points Progress Bar -->
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-400">Points</span>
      <span class="font-bold">{game.points} / {game.milestone}</span>
    </div>
    <div class="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
      <div
        class="bg-blue-500 h-full transition-all duration-300"
        style="width: {pointsProgress}%"
      ></div>
    </div>
  </div>

  <!-- Health Bar -->
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-400">Health</span>
      <span class="font-bold">{game.health} / {game.max_health}</span>
    </div>
    <div class="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
      <div
        class="bg-red-500 h-full transition-all duration-300"
        style="width: {healthProgress}%"
      ></div>
    </div>
  </div>

  <!-- Chips -->
  <div class="bg-gray-900 p-4 rounded border border-gray-700">
    <div class="text-sm text-gray-400 mb-1">Chips</div>
    <div class="text-2xl font-bold">{game.chips}</div>
  </div>
</div>