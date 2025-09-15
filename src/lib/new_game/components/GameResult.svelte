<script lang="ts">
  interface Props {
    is_win: boolean;
  }

  let { is_win }: Props = $props();
</script>

<div class="bg-black p-6 rounded-lg border-2 border-white">
  <div class="text-center">
    {#if is_win}
      <h2 class="text-4xl font-bold text-green-400 mb-2">VICTORY!</h2>
      <p class="text-white text-lg">You reached the milestone!</p>
    {:else}
      <h2 class="text-4xl font-bold text-red-400 mb-2">GAME OVER</h2>
      <p class="text-white text-lg">Your health reached zero!</p>
    {/if}
  </div>
</div>