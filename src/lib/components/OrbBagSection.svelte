<script lang="ts">
  import type { GameState, Orb, OrbType } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length +
                                      gameState.orbBag.cheddah.available.length +
                                      gameState.orbBag.moonrocks.available.length);

  interface OrbGroup {
    amount: number;
    count: number;
    calculation?: string;
  }

  interface OrbDisplay {
    type: OrbType;
    name: string;
    icon: string;
    color: string;
    available: OrbGroup[];
    total: OrbGroup[];
    totalAvailable: number;
    totalOwned: number;
  }

  // Group orbs by type and amount
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
        const bombs = gameState.playerStats.bombsPulledThisLevel;
        return `${amount}×${bombs} = ${amount * bombs} pts`;
      case 'multiplier':
        return `+${amount}× boost`;
      default:
        return undefined;
    }
  }

  const orbDisplays = $derived.by(() => {
    const displays: OrbDisplay[] = [
      {
        type: 'health',
        name: 'HEALTH',
        icon: '♥',
        color: 'text-red-500',
        available: groupOrbs(gameState.orbBag.health.available),
        total: groupOrbs(gameState.orbBag.health.total),
        totalAvailable: gameState.orbBag.health.available.length,
        totalOwned: gameState.orbBag.health.total.length
      },
      {
        type: 'point',
        name: 'POINTS',
        icon: '★',
        color: 'text-purple-500',
        available: groupOrbs(gameState.orbBag.point.available),
        total: groupOrbs(gameState.orbBag.point.total),
        totalAvailable: gameState.orbBag.point.available.length,
        totalOwned: gameState.orbBag.point.total.length
      },
      {
        type: 'bomb',
        name: 'BOMBS',
        icon: '💥',
        color: 'text-orange-500',
        available: groupOrbs(gameState.orbBag.bomb.available),
        total: groupOrbs(gameState.orbBag.bomb.total),
        totalAvailable: gameState.orbBag.bomb.available.length,
        totalOwned: gameState.orbBag.bomb.total.length
      },
      {
        type: 'points_per_anyorb',
        name: 'COMBO',
        icon: '⚡',
        color: 'text-blue-500',
        available: groupOrbs(gameState.orbBag.points_per_anyorb.available),
        total: groupOrbs(gameState.orbBag.points_per_anyorb.total),
        totalAvailable: gameState.orbBag.points_per_anyorb.available.length,
        totalOwned: gameState.orbBag.points_per_anyorb.total.length
      },
      {
        type: 'points_per_bombpulled',
        name: 'DANGER',
        icon: '🎯',
        color: 'text-yellow-500',
        available: groupOrbs(gameState.orbBag.points_per_bombpulled.available),
        total: groupOrbs(gameState.orbBag.points_per_bombpulled.total),
        totalAvailable: gameState.orbBag.points_per_bombpulled.available.length,
        totalOwned: gameState.orbBag.points_per_bombpulled.total.length
      },
      {
        type: 'multiplier',
        name: 'MULTIPLIER',
        icon: '⭐',
        color: 'text-orange-400',
        available: groupOrbs(gameState.orbBag.multiplier.available),
        total: groupOrbs(gameState.orbBag.multiplier.total),
        totalAvailable: gameState.orbBag.multiplier.available.length,
        totalOwned: gameState.orbBag.multiplier.total.length
      },
      {
        type: 'cheddah',
        name: 'CHEDDAH',
        icon: '🧀',
        color: 'text-yellow-400',
        available: groupOrbs(gameState.orbBag.cheddah.available),
        total: groupOrbs(gameState.orbBag.cheddah.total),
        totalAvailable: gameState.orbBag.cheddah.available.length,
        totalOwned: gameState.orbBag.cheddah.total.length
      },
      {
        type: 'moonrocks',
        name: 'MOONROCKS',
        icon: '🌙',
        color: 'text-gray-300',
        available: groupOrbs(gameState.orbBag.moonrocks.available),
        total: groupOrbs(gameState.orbBag.moonrocks.total),
        totalAvailable: gameState.orbBag.moonrocks.available.length,
        totalOwned: gameState.orbBag.moonrocks.total.length
      }
    ];

    // Add calculations to available orb groups
    displays.forEach(display => {
      display.available.forEach(group => {
        group.calculation = getCalculation(display.type, group.amount);
      });
    });

    return displays;
  });
</script>

<!-- Orb Bag - Visual Square Design -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' ? '' : 'opacity-60 pointer-events-none'}">
  <h2 class="text-sm font-bold mb-3 text-white">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' ? '' : '(INACTIVE)'}</h2>
  
  <div class="space-y-2 text-xs flex-1 overflow-y-auto">
    {#each orbDisplays as orb}
      <div class="flex items-center justify-between gap-2 {orb.totalAvailable === 0 ? 'opacity-50' : ''}">
        <!-- Orb Type Label -->
        <div class="font-medium {orb.color} min-w-0 flex-shrink-0">
          {orb.icon} {orb.name}:
        </div>
        
        <!-- Orb Squares (Available + Consumed) -->
        <div class="flex items-center gap-1 min-w-0 flex-shrink">
          <!-- Available Orbs -->
          {#each orb.available as group}
            {#each Array(group.count) as _, i}
              <div class="relative group">
                <div class="w-5 h-5 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-xs font-bold transition-colors {orb.color}">
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
          
          <!-- Consumed Orbs -->
          {#each orb.total as group}
            {#each Array(Math.max(0, group.count - (orb.available.find(a => a.amount === group.amount)?.count || 0))) as _, i}
              <div class="w-5 h-5 border border-gray-600 bg-gray-800 text-gray-500 flex items-center justify-center text-xs">
                {group.amount}
              </div>
            {/each}
          {/each}
        </div>
        
        <!-- Count and Calculation Summary -->
        <div class="text-right text-white flex-shrink-0 min-w-0">
          <div class="text-xs">
            {orb.totalAvailable}/{orb.totalOwned}
          </div>
          <!-- Show calculation for special orbs -->
          {#if orb.available.length > 0 && (orb.type === 'points_per_anyorb' || orb.type === 'points_per_bombpulled' || orb.type === 'multiplier')}
            <div class="text-xs opacity-75">
              {#each orb.available as group}
                {#if group.calculation}
                  ({group.calculation})
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>