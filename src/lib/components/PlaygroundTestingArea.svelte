<script lang="ts">
  import type { PlaygroundState } from '../game/playgroundTypes.js';
  import { PLAYGROUND_ORB_TEMPLATES } from '../game/playgroundTypes.js';
  import { pullNextOrb, canPullOrb } from '../game/playgroundController.js';
  import { 
    resetPlaygroundStats, 
    restartPlayground, 
    startPlayground,
    getRemainingOrbs,
    removeOrbFromPlayground,
    canResetStats
  } from '../game/playgroundState.js';

  interface Props {
    playgroundState: PlaygroundState;
  }

  let { playgroundState }: Props = $props();

  function handlePullOrb() {
    pullNextOrb(playgroundState);
  }

  function handleStartPlayground() {
    startPlayground(playgroundState);
  }

  function handleReset() {
    resetPlaygroundStats(playgroundState);
  }

  function handleRestart() {
    restartPlayground(playgroundState);
  }

  function handleRemoveOrb(orbId: string) {
    removeOrbFromPlayground(playgroundState, orbId);
  }

  function getOrbTemplate(type: string) {
    return PLAYGROUND_ORB_TEMPLATES.find(t => t.type === type);
  }

  const remainingOrbs = $derived(getRemainingOrbs(playgroundState));
  const canPull = $derived(canPullOrb(playgroundState));
  const canReset = $derived(canResetStats(playgroundState));
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col space-y-4">
  <h2 class="text-sm font-bold text-white">TESTING AREA</h2>
  
  <!-- Stats Display -->
  <div class="bg-black border border-gray-500 rounded p-3">
    <h3 class="text-xs font-bold mb-2 text-white">PLAYER STATS</h3>
    <div class="grid grid-cols-3 gap-2 text-center text-xs">
      <div>
        <div class="text-lg font-bold text-white">{playgroundState.playerStats.health}</div>
        <div class="text-white">HEALTH</div>
      </div>
      <div>
        <div class="text-lg font-bold text-white">{playgroundState.playerStats.points}</div>
        <div class="text-white">POINTS</div>
      </div>
      <div>
        <div class="text-lg font-bold text-white">{playgroundState.playerStats.levelMultiplier}×</div>
        <div class="text-white">MULT</div>
      </div>
      <div>
        <div class="text-sm font-bold text-white">{playgroundState.playerStats.glitchbytes}</div>
        <div class="text-white">GLITCH BYTES</div>
      </div>
      <div>
        <div class="text-sm font-bold text-white">{playgroundState.playerStats.chips}</div>
        <div class="text-white">CHIPS</div>
      </div>
      <div>
        <div class="text-sm font-bold text-white">{playgroundState.playerStats.bombsPulledThisLevel}</div>
        <div class="text-white">BOMBS PULLED</div>
      </div>
    </div>
  </div>

  <!-- Control Buttons -->
  <div class="grid grid-cols-2 gap-2">
    <button 
      onclick={handleStartPlayground}
      disabled={playgroundState.isActive || playgroundState.orbQueue.length === 0}
      class="py-2 px-3 rounded text-sm font-medium transition-colors border
             {!playgroundState.isActive && playgroundState.orbQueue.length > 0
               ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
               : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
    >
      START
    </button>
    <button 
      onclick={handlePullOrb}
      disabled={!canPull}
      class="py-2 px-3 rounded text-sm font-medium transition-colors border
             {canPull
               ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
               : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
    >
      PULL ORB
    </button>
    <button 
      onclick={handleReset}
      disabled={!canReset}
      class="py-2 px-3 rounded text-sm font-medium transition-colors border
             {canReset
               ? 'bg-black text-white border-white hover:bg-white hover:text-black'
               : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
    >
      RESET STATS
    </button>
    <button 
      onclick={handleRestart}
      class="py-2 px-3 rounded text-sm font-medium transition-colors border bg-black text-white border-white hover:bg-white hover:text-black"
    >
      CLEAR ALL
    </button>
  </div>

  <!-- Orb Queue Display -->
  <div class="bg-black border border-gray-500 rounded p-3 flex-1 flex flex-col">
    <h3 class="text-xs font-bold mb-2 text-white">ORB QUEUE ({playgroundState.orbQueue.length})</h3>
    <div class="flex-1 overflow-y-auto space-y-1">
      {#each playgroundState.orbQueue as orb, index}
        {@const template = getOrbTemplate(orb.type)}
        {@const isPulled = index < playgroundState.currentOrbIndex}
        {@const isNext = index === playgroundState.currentOrbIndex}
        <div class="flex items-center justify-between text-xs p-2 rounded
                    {isPulled ? 'bg-gray-800 opacity-50' : isNext ? 'bg-gray-700 border border-white' : 'bg-gray-900'}">
          <div class="flex items-center space-x-2">
            <span class="text-gray-400 w-6">{index + 1}.</span>
            <span class="{template?.color}">{template?.emoji}</span>
            <span class="text-white">{template?.name}</span>
            <span class="text-gray-400">+{orb.amount}</span>
            {#if isPulled}
              <span class="text-green-500 text-xs">✓</span>
            {:else if isNext}
              <span class="text-yellow-500 text-xs">→</span>
            {/if}
          </div>
          {#if !isPulled && !playgroundState.isActive}
            <button 
              onclick={() => handleRemoveOrb(orb.id)}
              class="text-red-500 hover:text-red-300 text-xs px-1"
            >
              ✕
            </button>
          {/if}
        </div>
      {:else}
        <div class="text-center text-gray-500 text-xs py-4">
          No orbs in queue. Add orbs from the selection panel.
        </div>
      {/each}
    </div>
  </div>

  <!-- Game Log -->
  <div class="bg-black border border-gray-500 rounded p-3 max-h-32">
    <h3 class="text-xs font-bold mb-2 text-white">LOG</h3>
    <div class="overflow-y-auto max-h-20 space-y-1">
      {#each playgroundState.gameLog.slice(-5) as logEntry}
        <div class="text-xs text-gray-300">{logEntry}</div>
      {:else}
        <div class="text-xs text-gray-500">No actions yet</div>
      {/each}
    </div>
  </div>
</div>