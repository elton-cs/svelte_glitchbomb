<script lang="ts">
  import GlitchHeader from './GlitchHeader.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
    devMode: boolean;
  }

  let { gameState, devMode }: Props = $props();
</script>

<div class="flex flex-col h-full">
  <GlitchHeader {gameState} {devMode} />

  <!-- Two Panels -->
  <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 flex-1">
    <div class="flex flex-col min-h-[200px]">
      <OrbBagSection {gameState} />
    </div>

    <div class="flex flex-col min-h-[250px]">
      <MarketplaceView {gameState} />
    </div>
  </div>
</div>
