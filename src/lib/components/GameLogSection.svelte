<script lang="ts">
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<!-- Game Log - Always visible -->
<div class="bg-black p-3 rounded-lg border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">GAME LOG</h2>
  <div class="flex-1 overflow-y-auto">
    <div class="text-xs text-white space-y-0.5">
      {#if gameState.gameLog.length === 0}
        <p class="text-gray-500 italic">No actions yet...</p>
      {:else}
        {#each [...gameState.gameLog].reverse() as entry}
          <div class="flex gap-2">
            <span class="text-gray-400 font-mono">{entry.timestamp}</span>
            <span class="flex-1">{entry.action}{entry.details ? ` ${entry.details}` : ''}</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>