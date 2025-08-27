<script lang="ts">
  import { createInitialGameState, claimFreeBytes, saveGlitchbytes } from '../game/state.js';
  import StatsDisplay from './StatsDisplay.svelte';
  import ActionsPanel from './ActionsPanel.svelte';
  import MarketplaceView from './MarketplaceView.svelte';
  import PlayerStatsSection from './PlayerStatsSection.svelte';
  import OrbBagSection from './OrbBagSection.svelte';
  import GameLogSection from './GameLogSection.svelte';
  import ProfitLossPanel from './ProfitLossPanel.svelte';

  interface Props {
    devMode: boolean;
  }

  let { devMode }: Props = $props();
  let gameState = $state(createInitialGameState());
  
  function handleClaimBytes() {
    const newAmount = claimFreeBytes(gameState.playerStats.glitchbytes);
    gameState.playerStats.glitchbytes = newAmount;
  }
  
  function resetGlitchbytes() {
    gameState.playerStats.glitchbytes = 0;
  }
  
  // Save glitchbytes whenever they change
  $effect(() => {
    saveGlitchbytes(gameState.playerStats.glitchbytes);
  });
  
  const canClaimBytes = $derived(gameState.playerStats.glitchbytes < 100);
  
</script>

<div class="bg-black p-3">
  <div class="max-w-7xl mx-auto">
    <!-- Dev Tools Panel -->
    {#if devMode}
      <div class="flex flex-wrap gap-4 mb-6">
        <div class="bg-black p-3 rounded-lg shadow-sm border border-white flex-1 min-w-64">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-white text-sm">🔧 DEVELOPER TOOLS</h3>
            <span class="text-xs text-white">DEBUG MODE</span>
          </div>
          
          <div class="space-y-2">
            <button 
              onclick={resetGlitchbytes}
              class="w-full bg-black hover:bg-white hover:text-black border border-white text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              RESET GLITCH BYTES TO 0
            </button>
            {#if canClaimBytes}
              <button 
                onclick={handleClaimBytes}
                class="w-full bg-black hover:bg-white hover:text-black border border-white text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                CLAIM 1000 FREE BYTES!
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Top Bar with Glitch Bytes -->
    <div class="bg-black p-3 rounded-lg shadow-sm border border-white mb-4">
      <div class="flex justify-center items-center">
        <div class="text-center">
          <div class="text-4xl font-bold text-white mb-1">{gameState.playerStats.glitchbytes}</div>
          <div class="text-white text-xs tracking-wide">GLITCH BYTES</div>
        </div>
      </div>
    </div>

    <!-- Main Game UI 2x3 Grid -->
    <div class="grid grid-cols-3 grid-rows-2 gap-4 h-[800px]">
      <!-- Top Row: Player Stats | Orb Bag | Shop -->
      <div class="h-full">
        <PlayerStatsSection {gameState} />
      </div>

      <div class="h-full">
        <OrbBagSection {gameState} />
      </div>

      <div class="h-full">
        <MarketplaceView {gameState} />
      </div>

      <!-- Bottom Row: PnL | Log | Actions -->
      <div class="h-full">
        <ProfitLossPanel {gameState} />
      </div>

      <div class="h-full">
        <GameLogSection {gameState} />
      </div>

      <div class="h-full">
        <ActionsPanel {gameState} />
      </div>
    </div>
  </div>
</div>
