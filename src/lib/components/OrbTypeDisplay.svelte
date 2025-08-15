<script lang="ts">
  import type { Orb, OrbType } from '../game/types.js';

  interface Props {
    orbType: OrbType;
    icon: string;
    name: string;
    color: string;
    availableOrbs: Orb[];
    totalOrbs: Orb[];
    totalAvailableOrbs: number; // For calculation purposes
    bombsPulledThisLevel: number; // For danger orb calculations
  }

  let { 
    orbType, 
    icon, 
    name, 
    color, 
    availableOrbs, 
    totalOrbs, 
    totalAvailableOrbs, 
    bombsPulledThisLevel 
  }: Props = $props();

  interface OrbGroup {
    amount: number;
    count: number;
    calculation?: string;
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

  // Calculate potential points for special orbs
  function getCalculation(type: OrbType, amount: number): string | undefined {
    switch (type) {
      case 'points_per_anyorb':
        const remaining = totalAvailableOrbs - 1;
        return `${amount}×${remaining} = ${amount * remaining} pts`;
      case 'points_per_bombpulled':
        return `${amount}×${bombsPulledThisLevel} = ${amount * bombsPulledThisLevel} pts`;
      case 'multiplier':
        return `+${amount}× boost`;
      default:
        return undefined;
    }
  }

  const availableGroups = $derived(groupOrbs(availableOrbs).map(group => ({
    ...group,
    calculation: getCalculation(orbType, group.amount)
  })));

  const totalGroups = $derived(groupOrbs(totalOrbs));
  const totalAvailable = $derived(availableOrbs.length);
  const totalOwned = $derived(totalOrbs.length);
</script>

<div class="space-y-2 {totalAvailable === 0 ? 'opacity-50' : ''}">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h3 class="font-medium {color} text-sm">{icon} {name}:</h3>
    <span class="text-white text-xs">{totalAvailable}/{totalOwned}</span>
  </div>
  
  <!-- Available Orbs -->
  {#if availableGroups.length > 0}
    <div class="flex flex-wrap gap-1 items-start">
      {#each availableGroups as group}
        {#each Array(group.count) as _, i}
          <div class="relative group">
            <div class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-xs font-bold transition-colors {color}">
              {group.amount}
            </div>
            <!-- Tooltip with calculation -->
            {#if group.calculation}
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {group.calculation}
              </div>
            {/if}
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
  
  <!-- Calculation Summary for special orbs -->
  {#if availableGroups.length > 0 && (orbType === 'points_per_anyorb' || orbType === 'points_per_bombpulled')}
    <div class="text-xs text-white opacity-75">
      {#each availableGroups as group}
        {#if group.calculation}
          <div>{group.count}× {group.calculation}</div>
        {/if}
      {/each}
    </div>
  {/if}
</div>