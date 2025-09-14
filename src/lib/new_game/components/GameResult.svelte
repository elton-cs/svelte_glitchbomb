<script lang="ts">
  import { back_to_menu } from '../state/game_state.svelte';

  interface Props {
    is_win: boolean;
  }

  let { is_win }: Props = $props();
</script>

<div class="bg-black p-6 rounded-lg border-2 border-white">
  <div class="text-center mb-6">
    {#if is_win}
      <h2 class="text-4xl font-bold text-green-400 mb-2">VICTORY!</h2>
      <p class="text-white text-lg">You reached the milestone!</p>
    {:else}
      <h2 class="text-4xl font-bold text-red-400 mb-2">GAME OVER</h2>
      <p class="text-white text-lg">Your health reached zero!</p>
    {/if}
  </div>

  <button
    onclick={back_to_menu}
    class="w-full px-6 py-3 bg-white text-black font-bold uppercase tracking-wide border-2 border-white hover:bg-gray-200 transition-colors"
  >
    Back to Menu
  </button>
</div>