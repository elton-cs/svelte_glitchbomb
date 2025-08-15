<script lang="ts">
  import type { PlaygroundState, OrbTemplate } from '../game/playgroundTypes.js';
  import { PLAYGROUND_ORB_TEMPLATES } from '../game/playgroundTypes.js';
  import { addOrbToPlayground } from '../game/playgroundState.js';

  interface Props {
    playgroundState: PlaygroundState;
  }

  let { playgroundState }: Props = $props();
  let customAmounts: Record<string, number> = $state({});

  function handleAddOrb(template: OrbTemplate) {
    const customAmount = customAmounts[template.type];
    addOrbToPlayground(playgroundState, template, customAmount);
    // Reset custom amount after adding
    customAmounts[template.type] = template.defaultAmount;
  }

  // Initialize custom amounts with default values
  PLAYGROUND_ORB_TEMPLATES.forEach(template => {
    customAmounts[template.type] = template.defaultAmount;
  });
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">ORB SELECTION</h2>
  
  <div class="flex-1 space-y-3 overflow-y-auto">
    {#each PLAYGROUND_ORB_TEMPLATES as template}
      <div class="border border-gray-500 rounded p-2">
        <!-- Compact Single Row Layout -->
        <div class="flex items-center space-x-2">
          <!-- Orb Info -->
          <span class="{template.color} text-lg">{template.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="text-white font-medium text-sm">{template.name}</div>
            <div class="text-gray-400 text-xs">{template.description}</div>
          </div>
          
          <!-- Amount Input -->
          <div class="flex items-center space-x-1">
            <label for="amount-{template.type}" class="text-white text-xs">Amt:</label>
            <input 
              id="amount-{template.type}"
              type="number" 
              bind:value={customAmounts[template.type]}
              min="0.1"
              step={template.type === 'multiplier' ? '0.1' : '1'}
              class="bg-black border border-white text-white text-xs px-1 py-1 rounded w-16"
            />
          </div>
          
          <!-- Add Button -->
          <button 
            onclick={() => handleAddOrb(template)}
            disabled={playgroundState.isActive}
            class="py-1 px-2 rounded text-xs font-medium transition-colors border whitespace-nowrap
                   {playgroundState.isActive 
                     ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed' 
                     : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
          >
            ADD
          </button>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Quick Actions -->
  <div class="pt-3 border-t border-gray-500 mt-3">
    <div class="text-xs text-white mb-2">QUICK ADD:</div>
    <div class="grid grid-cols-2 gap-2">
      <button 
        onclick={() => {
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'health')!, 1);
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'point')!, 5);
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'bomb')!, 2);
        }}
        disabled={playgroundState.isActive}
        class="py-1 px-2 rounded text-xs font-medium transition-colors border
               {playgroundState.isActive 
                 ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed' 
                 : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
      >
        BASIC SET
      </button>
      <button 
        onclick={() => {
          // Add initial game bag orbs
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'health')!, 1);
          for(let i = 0; i < 3; i++) {
            addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'point')!, 5);
          }
          for(let i = 0; i < 5; i++) {
            addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'bomb')!, i < 2 ? 1 : i < 4 ? 2 : 3);
          }
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'points_per_anyorb')!, 2);
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'points_per_bombpulled')!, 3);
          addOrbToPlayground(playgroundState, PLAYGROUND_ORB_TEMPLATES.find(t => t.type === 'multiplier')!, 1.0);
        }}
        disabled={playgroundState.isActive}
        class="py-1 px-2 rounded text-xs font-medium transition-colors border
               {playgroundState.isActive 
                 ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed' 
                 : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
      >
        STARTING BAG
      </button>
    </div>
  </div>
</div>