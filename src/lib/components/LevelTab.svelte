<script lang="ts">
  import GlitchHeader from './GlitchHeader.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
    devMode: boolean;
    showMatrixWarning: boolean;
  }

  let { gameState, devMode, showMatrixWarning = $bindable() }: Props = $props();
</script>

<div class="flex flex-col h-full">
  <GlitchHeader {gameState} {devMode} />

  <!-- Two Panels -->
  <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 flex-1">
    <div class="flex flex-col min-h-[250px]">
      <PlayerStatsSection {gameState} />
    </div>

    <div class="flex flex-col min-h-[200px]">
      <ActionsPanel {gameState} bind:showMatrixWarning />
    </div>
  </div>
</div>
