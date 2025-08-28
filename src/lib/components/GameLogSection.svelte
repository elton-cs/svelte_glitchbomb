<script lang="ts">
  import type { GameState, GameLogEntry } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function formatLogEntry(entry: GameLogEntry): string {
    const action = entry.action;
    const details = entry.details || '';
    
    // Chip icon SVG for inline use
    const chipIcon = `<svg class="w-3 h-3 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.38" y="3.38" width="17.25" height="17.25" rx="2.18" stroke="currentColor" stroke-width="1.92" fill="none"/>
      <rect x="7.21" y="7.21" width="9.58" height="9.58" rx="1.92" stroke="currentColor" stroke-width="1.92" fill="none"/>
      <line x1="7.21" y1="0.5" x2="7.21" y2="2.42" stroke="currentColor" stroke-width="1.92"/>
      <line x1="12" y1="0.5" x2="12" y2="2.42" stroke="currentColor" stroke-width="1.92"/>
      <line x1="16.79" y1="0.5" x2="16.79" y2="2.42" stroke="currentColor" stroke-width="1.92"/>
      <line x1="7.21" y1="21.58" x2="7.21" y2="23.5" stroke="currentColor" stroke-width="1.92"/>
      <line x1="12" y1="21.58" x2="12" y2="23.5" stroke="currentColor" stroke-width="1.92"/>
      <line x1="16.79" y1="21.58" x2="16.79" y2="23.5" stroke="currentColor" stroke-width="1.92"/>
      <line x1="0.5" y1="16.79" x2="2.42" y2="16.79" stroke="currentColor" stroke-width="1.92"/>
      <line x1="0.5" y1="12" x2="2.42" y2="12" stroke="currentColor" stroke-width="1.92"/>
      <line x1="0.5" y1="7.21" x2="2.42" y2="7.21" stroke="currentColor" stroke-width="1.92"/>
      <line x1="21.58" y1="16.79" x2="23.5" y2="16.79" stroke="currentColor" stroke-width="1.92"/>
      <line x1="21.58" y1="12" x2="23.5" y2="12" stroke="currentColor" stroke-width="1.92"/>
      <line x1="21.58" y1="7.21" x2="23.5" y2="7.21" stroke="currentColor" stroke-width="1.92"/>
    </svg>`;
    
    // Map different actions to command format with colors - only use the colored category
    if (action.includes('Converted') && action.includes('points to') && action.includes('chips')) {
      // Extract chips amount from "Converted X points to Y chips (+Y total: Z)"
      const chipsMatch = action.match(/Converted \d+ points to (\d+) chips/);
      if (chipsMatch) {
        const chips = chipsMatch[1];
        return `<span class="text-blue-500">CHIPS</span> > +${chips} ${chipIcon}`;
      } else {
        return `<span class="text-blue-500">CHIPS</span> > ${action} ${details}`.trim();
      }
    } else if (action.includes('points')) {
      const match = action.match(/(\d+) points/);
      const points = match ? match[1] : '';
      if (action.includes('multiplier')) {
        return `<span class="text-green-400">POINTS</span> > +${points} Points (${details})`;
      } else {
        return `<span class="text-green-400">POINTS</span> > +${points} Points`;
      }
    } else if (action.includes('bomb')) {
      // Extract damage from bomb log entries like "Pulled bomb orb (-2 HP)"
      const damageMatch = action.match(/\(-(\d+)\s*HP\)/i);
      if (damageMatch) {
        const damage = damageMatch[1];
        return `<span class="text-orange-500">GLITCH BOMB</span> > -${damage} Health`;
      } else if (action.includes('Single')) {
        return `<span class="text-orange-500">GLITCH BOMB</span> > Single Bomb: -1 Health`;
      } else if (action.includes('Double')) {
        return `<span class="text-orange-500">GLITCH BOMB</span> > Double Bomb: -2 Health`;
      } else if (action.includes('Triple')) {
        return `<span class="text-orange-500">GLITCH BOMB</span> > TRIPLE BOMB: -3 Health`;
      } else if (details) {
        return `<span class="text-orange-500">GLITCH BOMB</span> > ${details}`;
      } else {
        return `<span class="text-orange-500">GLITCH BOMB</span> > Bomb detonated`;
      }
    } else if (action.includes('multiplier')) {
      const match = action.match(/(\d+)x/);
      const mult = match ? match[1] : '1';
      return `<span class="text-blue-400">MULTIPLIER</span> > +${mult}x Multiplier`;
    } else if (action.includes('health')) {
      const match = action.match(/(\d+) health/);
      const health = match ? match[1] : '1';
      return `<span class="text-red-500">HEALTH</span> > +${health} Health`;
    } else if (action.includes('purchased') || action.includes('bought') || action.includes('Bought')) {
      // Extract item name and cost from "Bought [item] for [cost] chips"
      const shopMatch = action.match(/Bought (.+?) for (\d+) chips/);
      if (shopMatch) {
        const item = shopMatch[1];
        const cost = shopMatch[2];
        return `<span class="text-orange-400">MOD SHOP</span> > install ${item} > -${cost} ${chipIcon}`;
      } else {
        return `<span class="text-orange-400">MOD SHOP</span> > ${action} ${details}`.trim();
      }
    } else if (action.includes('Advanced to level')) {
      // Extract level number and cost from "Advanced to level X (-Y glitchbytes)"
      const levelMatch = action.match(/Advanced to level (\d+) \(-(\d+) glitchbytes\)/);
      if (levelMatch) {
        const level = levelMatch[1];
        const cost = levelMatch[2];
        return `<span class="text-purple-500">ADVANCE</span> > level ${level} > -${cost} 👾`;
      } else {
        return `<span class="text-purple-500">ADVANCE</span> > ${action} ${details}`.trim();
      }
    } else if (action.includes('Cashed out') && action.includes('glitchbytes')) {
      // Extract glitchbytes amount from "Cashed out post-level: X points for Y glitchbytes"
      const gbMatch = action.match(/for (\d+) glitchbytes/);
      if (gbMatch) {
        const gb = gbMatch[1];
        return `<span class="text-cyan-500">GLITCH BYTES</span> > +${gb} 👾`;
      } else {
        return `<span class="text-cyan-500">GLITCH BYTES</span> > ${action} ${details}`.trim();
      }
    } else if (action.includes('chips')) {
      const match = action.match(/(\d+) chips/);
      const chips = match ? match[1] : '';
      return `<span class="text-yellow-400">SPECIAL</span> > +${chips} ${chipIcon}`;
    } else if (action.includes('glitchbytes')) {
      const match = action.match(/(\d+) glitchbytes/);
      const bytes = match ? match[1] : '';
      return `<span class="text-yellow-400">SPECIAL</span> > +${bytes} 👾`;
    } else if (action.includes('DEBUG:')) {
      return `<span class="text-yellow-500">DEBUG</span> > ${action.replace('DEBUG: ', '')} ${details}`.trim();
    } else if (action.includes('level') || action.includes('started') || action.includes('completed') || action.includes('Returned to main menu')) {
      return `<span class="text-cyan-400">SYSTEM</span> > ${action} ${details}`.trim();
    } else {
      return `<span class="text-red-500">UNCATEGORIZED</span> > ${action} ${details || ''}`.trim();
    }
  }
</script>

<!-- Game Log - Always visible -->
<div class="bg-black p-3 rounded-lg border border-white h-full flex flex-col min-h-0">
  <h2 class="text-sm font-bold mb-3 text-white">COMMAND HISTORY</h2>
  <div class="flex-1 overflow-y-auto min-h-0">
    <div class="text-sm font-mono space-y-0.5">
      {#if gameState.gameLog.length === 0}
        <p class="text-gray-500 italic">No commands executed...</p>
      {:else}
        {#each [...gameState.gameLog].reverse() as entry}
          <div class="flex gap-2">
            <span class="text-gray-400">{entry.timestamp}</span>
            <span class="flex-1">{@html formatLogEntry(entry)}</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
