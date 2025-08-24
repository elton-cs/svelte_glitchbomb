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

  const pointsOrbTypes = [
    {
      type: 'point' as const,
      name: 'POINTS',
      icon: '★',
      color: 'text-purple-500'
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
    }
  ];

  const specialOrbTypes = [
    {
      type: 'bits' as const,
      name: 'BITS',
      icon: 'B',
      color: 'text-yellow-400'
    },
    {
      type: 'glitchbytes' as const,
      name: 'GLITCH BYTES',
      icon: 'GB',
      color: 'text-gray-300'
    }
  ];

  const otherOrbTypes = [
    {
      type: 'health' as const,
      name: 'HEALTH',
      icon: '❤️',
      color: 'text-red-500'
    },
    {
      type: 'bomb' as const,
      name: 'BOMBS',
      icon: '💣',
      color: 'text-orange-500'
    },
    {
      type: 'multiplier' as const,
      name: 'MULT',
      icon: '⚡️',
      color: 'text-blue-400'
    }
  ];

  const totalPointsAvailable = $derived(
    gameState.orbBag.point.available.length + 
    gameState.orbBag.points_per_anyorb.available.length + 
    gameState.orbBag.points_per_bombpulled.available.length
  );
  
  const totalPointsOwned = $derived(
    gameState.orbBag.point.total.length + 
    gameState.orbBag.points_per_anyorb.total.length + 
    gameState.orbBag.points_per_bombpulled.total.length
  );

  const totalSpecialAvailable = $derived(
    gameState.orbBag.bits.available.length + 
    gameState.orbBag.glitchbytes.available.length
  );
  
  const totalSpecialOwned = $derived(
    gameState.orbBag.bits.total.length + 
    gameState.orbBag.glitchbytes.total.length
  );

  const pointsPercentage = $derived(
    totalAvailableOrbs > 0 ? Math.round((totalPointsAvailable / totalAvailableOrbs) * 100) : 0
  );
  
  const specialPercentage = $derived(
    totalAvailableOrbs > 0 ? Math.round((totalSpecialAvailable / totalAvailableOrbs) * 100) : 0
  );
</script>

<!-- Orb Bag - Visual Square Design -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : 'opacity-60 pointer-events-none'}">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-sm font-bold text-white">ORB BAG ({totalAvailableOrbs}) {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : '(INACTIVE)'}</h2>
    <div class="text-xs text-white font-mono min-h-4">{calculationDisplay || 'hover for point calculation preview'}</div>
  </div>
  
  <div class="grid grid-cols-5 gap-2 text-xs flex-1 overflow-y-auto">
    <!-- Combined Points Category -->
    <div class="space-y-2 {totalPointsAvailable === 0 ? 'opacity-50' : ''}">
      <!-- Header -->
      <div class="text-center mb-2">
        <div class="text-lg">⭐️</div>
        <h3 class="font-medium text-green-400 text-xs">POINTS</h3>
        <span class="text-green-400 text-xs">{totalPointsAvailable}/{totalPointsOwned}</span>
        <div class="text-green-400 text-xs">{pointsPercentage}%</div>
      </div>
      
      <!-- Combined Points Orbs -->
      {#if totalPointsAvailable > 0}
        <div class="flex flex-col gap-1">
          {#each pointsOrbTypes as pointType}
            {#each gameState.orbBag[pointType.type].available as orb}
              <div class="relative group">
                <div 
                  class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-xs font-bold transition-colors text-green-400"
                  role="button"
                  tabindex="0"
                  onmouseenter={() => handleOrbHover(pointType.type, orb.amount)}
                  onmouseleave={handleOrbLeave}
                  title="{pointType.name}: {orb.amount}"
                >
                  {#if pointType.type === 'point'}
                    {orb.amount}
                  {:else if pointType.type === 'points_per_anyorb'}
                    {orb.amount}/C
                  {:else if pointType.type === 'points_per_bombpulled'}
                    {orb.amount}/B
                  {/if}
                </div>
              </div>
            {/each}
            <!-- Consumed orbs for this type -->
            {#if gameState.orbBag[pointType.type].total.length > gameState.orbBag[pointType.type].available.length}
              {#each Array(gameState.orbBag[pointType.type].total.length - gameState.orbBag[pointType.type].available.length) as _, consumedIndex}
                {@const consumedOrb = gameState.orbBag[pointType.type].total[gameState.orbBag[pointType.type].available.length + consumedIndex]}
                <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-green-600 flex items-center justify-center text-xs"
                     title="Used {pointType.name}: {consumedOrb.amount}">
                  {#if pointType.type === 'point'}
                    {consumedOrb.amount}
                  {:else if pointType.type === 'points_per_anyorb'}
                    {consumedOrb.amount}/C
                  {:else if pointType.type === 'points_per_bombpulled'}
                    {consumedOrb.amount}/B
                  {/if}
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {:else}
        <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-gray-500 flex items-center justify-center text-xs">
          NONE
        </div>
      {/if}
    </div>

    <!-- Combined Special Category -->
    <div class="space-y-2 {totalSpecialAvailable === 0 ? 'opacity-50' : ''}">
      <!-- Header -->
      <div class="text-center mb-2">
        <div class="text-lg">👑</div>
        <h3 class="font-medium text-yellow-400 text-xs">SPECIAL</h3>
        <span class="text-yellow-400 text-xs">{totalSpecialAvailable}/{totalSpecialOwned}</span>
        <div class="text-yellow-400 text-xs">{specialPercentage}%</div>
      </div>
      
      <!-- Combined Special Orbs -->
      {#if totalSpecialAvailable > 0}
        <div class="flex flex-col gap-1">
          {#each specialOrbTypes as specialType}
            {#each gameState.orbBag[specialType.type].available as orb}
              <div class="relative group">
                <div 
                  class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-xs font-bold transition-colors text-yellow-400"
                  role="button"
                  tabindex="0"
                  onmouseenter={() => handleOrbHover(specialType.type, orb.amount)}
                  onmouseleave={handleOrbLeave}
                  title="{specialType.name}: {orb.amount}"
                >
                  {#if specialType.type === 'bits'}
                    {orb.amount}B
                  {:else if specialType.type === 'glitchbytes'}
                    {orb.amount}GB
                  {/if}
                </div>
              </div>
            {/each}
            <!-- Consumed orbs for this type -->
            {#if gameState.orbBag[specialType.type].total.length > gameState.orbBag[specialType.type].available.length}
              {#each Array(gameState.orbBag[specialType.type].total.length - gameState.orbBag[specialType.type].available.length) as _, consumedIndex}
                {@const consumedOrb = gameState.orbBag[specialType.type].total[gameState.orbBag[specialType.type].available.length + consumedIndex]}
                <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-yellow-600 flex items-center justify-center text-xs"
                     title="Used {specialType.name}: {consumedOrb.amount}">
                  {#if specialType.type === 'bits'}
                    {consumedOrb.amount}B
                  {:else if specialType.type === 'glitchbytes'}
                    {consumedOrb.amount}GB
                  {/if}
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {:else}
        <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-gray-500 flex items-center justify-center text-xs">
          NONE
        </div>
      {/if}
    </div>

    <!-- Other Orb Types -->
    {#each otherOrbTypes as orbTypeInfo}
      <OrbTypeDisplay
        orbType={orbTypeInfo.type}
        icon={orbTypeInfo.icon}
        name={orbTypeInfo.name}
        color={orbTypeInfo.color}
        availableOrbs={gameState.orbBag[orbTypeInfo.type].available}
        totalOrbs={gameState.orbBag[orbTypeInfo.type].total}
        totalAvailableOrbs={totalAvailableOrbs}
        onOrbHover={handleOrbHover}
        onOrbLeave={handleOrbLeave}
      />
    {/each}
  </div>
</div>
