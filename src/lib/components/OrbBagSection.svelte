<script lang="ts">
  import type { GameState } from '../game/types.js';
  import OrbTypeDisplay from './OrbTypeDisplay.svelte';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  let calculationDisplay = $state('');

  function getCalculation(type: typeof orbTypes[number]['type'], amount: number): string | null {
    switch (type) {
      case 'point':
        const multipliedPoints = Math.floor(amount * gameState.playerStats.levelMultiplier);
        return gameState.playerStats.levelMultiplier > 1 ? `${amount}×${gameState.playerStats.levelMultiplier} = ${multipliedPoints} pts` : `${amount} pts`;
      case 'points_per_anyorb':
        const remaining = totalAvailableOrbs - 1;
        const comboPoints = Math.floor(amount * remaining * gameState.playerStats.levelMultiplier);
        if (gameState.playerStats.levelMultiplier > 1) {
          return `${amount}×${remaining}×${gameState.playerStats.levelMultiplier} = ${comboPoints} pts`;
        } else {
          return `${amount}×${remaining} = ${amount * remaining} pts`;
        }
      case 'points_per_bombpulled':
        const dangerPoints = Math.floor(amount * gameState.playerStats.bombsPulledThisLevel * gameState.playerStats.levelMultiplier);
        if (gameState.playerStats.levelMultiplier > 1) {
          return `${amount}×${gameState.playerStats.bombsPulledThisLevel}×${gameState.playerStats.levelMultiplier} = ${dangerPoints} pts`;
        } else {
          return `${amount}×${gameState.playerStats.bombsPulledThisLevel} = ${dangerPoints} pts`;
        }
      case 'multiplier':
        return `+${amount}× boost`;
      case 'bits':
        return `+${amount} bits`;
      case 'glitchbytes':
        return `+${amount} glitchbytes`;
      default:
        return null;
    }
  }

  function handleOrbHover(orbType: typeof orbTypes[number]['type'], amount: number) {
    const calculation = getCalculation(orbType, amount);
    calculationDisplay = calculation || '';
  }

  function handleOrbLeave() {
    calculationDisplay = '';
  }

  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length +
                                      gameState.orbBag.bits.available.length +
                                      gameState.orbBag.glitchbytes.available.length);

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
      type: 'bits' as const,
      name: 'BITS',
      icon: 'B',
      color: 'text-yellow-400'
    },
    {
      type: 'glitchbytes' as const,
      name: 'GLITCH BYTES',
      icon: '🌙',
      color: 'text-gray-300'
    }
  ];
</script>

<!-- Orb Bag - Visual Square Design -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : 'opacity-60 pointer-events-none'}">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-sm font-bold text-white">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : '(INACTIVE)'}</h2>
    <div class="text-xs text-white font-mono min-h-4">{calculationDisplay || 'hover for point calculation preview'}</div>
  </div>
  
  <div class="grid grid-cols-1 gap-4 text-xs flex-1 overflow-y-auto">
    {#each orbTypes as orbTypeInfo}
      <OrbTypeDisplay
        orbType={orbTypeInfo.type}
        icon={orbTypeInfo.icon}
        name={orbTypeInfo.name}
        color={orbTypeInfo.color}
        availableOrbs={gameState.orbBag[orbTypeInfo.type].available}
        totalOrbs={gameState.orbBag[orbTypeInfo.type].total}
        onOrbHover={handleOrbHover}
        onOrbLeave={handleOrbLeave}
      />
    {/each}
  </div>
</div>