<script lang="ts">
  import type { Orb, OrbType } from '../game/types.js';

  interface Props {
    orbType: OrbType;
    icon: string;
    name: string;
    color: string;
    availableOrbs: Orb[];
    totalOrbs: Orb[];
    onOrbHover: (orbType: OrbType, amount: number) => void;
    onOrbLeave: () => void;
  }

  let { 
    orbType, 
    icon, 
    name, 
    color, 
    availableOrbs, 
    totalOrbs,
    onOrbHover,
    onOrbLeave
  }: Props = $props();

  interface OrbGroup {
    amount: number;
    count: number;
  }

  // Group orbs by amount
  function groupOrbs(orbs: Orb[]): OrbGroup[] {
    const groups = new Map<number, number>();
    orbs.forEach(orb => {
      groups.set(orb.amount, (groups.get(orb.amount) || 0) + 1);
    });
    return Array.from(groups.entries())
      .map(([amount, count]) => ({ amount, count }))
      .sort((a, b) => a.amount - b.amount);
  }

  const availableGroups = $derived(groupOrbs(availableOrbs));

  const totalGroups = $derived(groupOrbs(totalOrbs));
  const totalAvailable = $derived(availableOrbs.length);
  const totalOwned = $derived(totalOrbs.length);
</script>

<div class="space-y-2 {totalAvailable === 0 ? 'opacity-50' : ''}">
  <!-- Header -->
  <div class="text-center mb-2">
    <h3 class="font-medium {color} text-xs">{icon} {name}</h3>
    <span class="text-white text-xs">{totalAvailable}/{totalOwned}</span>
  </div>
  
  <!-- Available Orbs -->
  {#if availableGroups.length > 0}
    <div class="flex flex-col gap-1">
      {#each availableGroups as group}
        {#each Array(group.count) as _, i}
          <div class="relative group">
            <div 
              class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-xs font-bold transition-colors {color}"
              role="button"
              tabindex="0"
              onmouseenter={() => onOrbHover(orbType, group.amount)}
              onmouseleave={onOrbLeave}
            >
              {group.amount}
            </div>
          </div>
        {/each}
      {/each}
      
      <!-- Consumed Orbs (grayed out) -->
      {#each totalGroups as group}
        {#each Array(Math.max(0, group.count - (availableGroups.find(a => a.amount === group.amount)?.count || 0))) as _, i}
          <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-gray-500 flex items-center justify-center text-xs">
            {group.amount}
          </div>
        {/each}
      {/each}
    </div>
  {:else}
    <!-- No orbs available -->
    <div class="text-gray-500 text-xs">No orbs available</div>
  {/if}
</div>