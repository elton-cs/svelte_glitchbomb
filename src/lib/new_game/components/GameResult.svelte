<script lang="ts">
  interface Props {
    is_win: boolean;
    points: number;
  }

  let { is_win, points }: Props = $props();
</script>

<div class="bg-black p-6 rounded-lg border-2 border-white">
  <div class="text-center">
    {#if is_win}
      <h2 class="text-4xl font-bold text-green-400 mb-2">VICTORY!</h2>
      <p class="text-white text-lg mb-2">You reached the milestone!</p>
      <div class="bg-yellow-900 border border-yellow-600 rounded p-3 mb-2">
        <p class="text-yellow-300 text-sm">You earned <span class="font-bold">{points} points</span></p>
        <p class="text-yellow-300 text-xs">Cash out for <span class="font-bold">{points} moonrocks</span> or continue to shop</p>
      </div>
    {:else}
      <h2 class="text-4xl font-bold text-red-400 mb-2">GAME OVER</h2>
      <p class="text-white text-lg mb-2">Your health reached zero!</p>
      {#if points > 0}
        <div class="bg-yellow-900 border border-yellow-600 rounded p-3 mb-2">
          <p class="text-yellow-300 text-sm">You earned <span class="font-bold">{points} points</span></p>
          <p class="text-yellow-300 text-xs">Cash out for <span class="font-bold">{points} moonrocks</span></p>
        </div>
      {:else}
        <p class="text-gray-400 text-sm">No points earned this round</p>
      {/if}
    {/if}
  </div>
</div>