<script lang="ts">
  import type { GameState } from '../game/types.js';
  import OrbTypeDisplay from './OrbTypeDisplay.svelte';

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

  const orbTypes = [
    {
      type: 'health' as const,
      name: 'HEALTH',
      icon: '♥',
      color: 'text-red-500'
    },
    {
      type: 'point' as const,
      name: 'POINTS',
      icon: '★',
      color: 'text-purple-500'
    },
    {
      type: 'bomb' as const,
      name: 'BOMBS',
      icon: '💥',
      color: 'text-orange-500'
    },
    {
      type: 'points_per_anyorb' as const,
      name: 'COMBO',
      icon: '⚡',
      color: 'text-blue-500'
    },
    {
      type: 'points_per_bombpulled' as const,
      name: 'DANGER',
      icon: '🎯',
      color: 'text-yellow-500'
    },
    {
      type: 'multiplier' as const,
      name: 'MULTIPLIER',
      icon: '⭐',
      color: 'text-orange-400'
    },
    {
      type: 'cheddah' as const,
      name: 'CHEDDAH',
      icon: '🧀',
      color: 'text-yellow-400'
    },
    {
      type: 'moonrocks' as const,
      name: 'MOONROCKS',
      icon: '🌙',
      color: 'text-gray-300'
    }
  ];
</script>

<!-- Orb Bag - Visual Square Design -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : 'opacity-60 pointer-events-none'}">
  <h2 class="text-sm font-bold mb-3 text-white">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : '(INACTIVE)'}</h2>
  
  <div class="grid grid-cols-1 gap-4 text-xs flex-1 overflow-y-auto">
    {#each orbTypes as orbTypeInfo}
      <OrbTypeDisplay
        orbType={orbTypeInfo.type}
        icon={orbTypeInfo.icon}
        name={orbTypeInfo.name}
        color={orbTypeInfo.color}
        availableOrbs={gameState.orbBag[orbTypeInfo.type].available}
        totalOrbs={gameState.orbBag[orbTypeInfo.type].total}
        totalAvailableOrbs={totalAvailableOrbs}
        bombsPulledThisLevel={gameState.playerStats.bombsPulledThisLevel}
        levelMultiplier={gameState.playerStats.levelMultiplier}
      />
    {/each}
  </div>
</div>