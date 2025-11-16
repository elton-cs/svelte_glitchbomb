<script lang="ts">
  import type { GameState, OrbType } from '../game/types.js';
  import OrbTypeDisplay from './OrbTypeDisplay.svelte';
  import ChipIcon from './ChipIcon.svelte';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  let calculationDisplay = $state('');

  function getCalculation(type: OrbType, amount: number): string | null {
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

  function handleOrbHover(orbType: OrbType, amount: number) {
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
      icon: '👾',
      color: 'text-gray-300'
    }
  ];

  const otherOrbTypes = [
    {
      type: 'bomb' as const,
      name: 'BOMBS',
      icon: '💣',
      color: 'text-orange-500'
    },
    {
      type: 'health' as const,
      name: 'HEALTH',
      icon: '❤️',
      color: 'text-red-500'
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

<!-- Glitch Rift - Command Display -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : 'opacity-60 pointer-events-none'}">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-sm font-bold text-white">GLITCH RIFT ({totalAvailableOrbs}) {gameState.phase === 'level' || gameState.phase === 'confirmation' ? '' : '(INACTIVE)'}</h2>
    <div class="text-xs text-white font-mono min-h-4">{calculationDisplay || 'hover for details'}</div>
  </div>
  
  <div class="grid grid-cols-5 gap-2 text-sm flex-1 overflow-y-auto">
    <!-- Bomb -->
    <OrbTypeDisplay
      orbType="bomb"
      icon="💣"
      name="BOMBS"
      color="text-orange-500"
      availableOrbs={gameState.orbBag.bomb.available}
      totalOrbs={gameState.orbBag.bomb.total}
      totalAvailableOrbs={totalAvailableOrbs}
      onOrbHover={handleOrbHover}
      onOrbLeave={handleOrbLeave}
    />

    <!-- Health -->
    <OrbTypeDisplay
      orbType="health"
      icon="❤️"
      name="HEALTH"
      color="text-red-500"
      availableOrbs={gameState.orbBag.health.available}
      totalOrbs={gameState.orbBag.health.total}
      totalAvailableOrbs={totalAvailableOrbs}
      onOrbHover={handleOrbHover}
      onOrbLeave={handleOrbLeave}
    />

    <!-- Combined Points Category -->
    <div class="space-y-2 {totalPointsAvailable === 0 ? 'opacity-50' : ''}">
      <!-- Header -->
      <div class="text-center mb-2">
        <div class="text-xl">⭐️</div>
        <h3 class="font-medium {totalPointsOwned === 0 ? 'text-gray-500' : 'text-green-400'} text-sm">POINTS</h3>
        <span class="{totalPointsOwned === 0 ? 'text-gray-500' : 'text-green-400'} text-sm">{totalPointsAvailable}/{totalPointsOwned}</span>
        <div class="{totalPointsOwned === 0 ? 'text-gray-500' : 'text-green-400'} text-sm">{pointsPercentage}%</div>
      </div>
      
      <!-- Combined Points Commands -->
      {#if totalPointsOwned > 0}
        <div class="flex flex-col gap-1">
          {#each pointsOrbTypes as pointType}
            {#each gameState.orbBag[pointType.type].available as orb}
              <div class="relative group">
                <div 
                  class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-sm font-bold transition-colors text-green-400"
                  role="button"
                  tabindex="0"
                  onmouseenter={() => handleOrbHover(pointType.type, orb.amount)}
                  onmouseleave={handleOrbLeave}
                  title="{pointType.name}: {orb.amount}"
                >
                  {#if pointType.type === 'point'}
                    {orb.amount}
                  {:else if pointType.type === 'points_per_anyorb'}
                    {orb.amount}/RC
                  {:else if pointType.type === 'points_per_bombpulled'}
                    {orb.amount}/B
                  {/if}
                </div>
              </div>
            {/each}
            <!-- Consumed commands for this type -->
            {#if gameState.orbBag[pointType.type].total.length > gameState.orbBag[pointType.type].available.length}
              {#each Array(gameState.orbBag[pointType.type].total.length - gameState.orbBag[pointType.type].available.length) as _, consumedIndex}
                {@const consumedOrb = gameState.orbBag[pointType.type].total[gameState.orbBag[pointType.type].available.length + consumedIndex]}
                <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-green-600 flex items-center justify-center text-sm"
                     title="Used {pointType.name}: {consumedOrb.amount}">
                  {#if pointType.type === 'point'}
                    {consumedOrb.amount}
                  {:else if pointType.type === 'points_per_anyorb'}
                    {consumedOrb.amount}/RC
                  {:else if pointType.type === 'points_per_bombpulled'}
                    {consumedOrb.amount}/B
                  {/if}
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <!-- Multiplier -->
    <OrbTypeDisplay
      orbType="multiplier"
      icon="⚡️"
      name="MULT"
      color="text-blue-400"
      availableOrbs={gameState.orbBag.multiplier.available}
      totalOrbs={gameState.orbBag.multiplier.total}
      totalAvailableOrbs={totalAvailableOrbs}
      onOrbHover={handleOrbHover}
      onOrbLeave={handleOrbLeave}
    />

    <!-- Combined Special Category -->
    <div class="space-y-2 {totalSpecialAvailable === 0 ? 'opacity-50' : ''}">
      <!-- Header -->
      <div class="text-center mb-2">
        <div class="text-xl">👑</div>
        <h3 class="font-medium {totalSpecialOwned === 0 ? 'text-gray-500' : 'text-yellow-400'} text-sm">SPECIAL</h3>
        <span class="{totalSpecialOwned === 0 ? 'text-gray-500' : 'text-yellow-400'} text-sm">{totalSpecialAvailable}/{totalSpecialOwned}</span>
        <div class="{totalSpecialOwned === 0 ? 'text-gray-500' : 'text-yellow-400'} text-sm">{specialPercentage}%</div>
      </div>
      
      <!-- Combined Special Commands -->
      {#if totalSpecialOwned > 0}
        <div class="flex flex-col gap-1">
          {#each specialOrbTypes as specialType}
            {#each gameState.orbBag[specialType.type].available as orb}
              <div class="relative group">
                <div 
                  class="min-w-8 h-8 px-1 border border-white bg-black hover:bg-white hover:text-black flex items-center justify-center text-sm font-bold transition-colors text-yellow-400"
                  role="button"
                  tabindex="0"
                  onmouseenter={() => handleOrbHover(specialType.type, orb.amount)}
                  onmouseleave={handleOrbLeave}
                  title="{specialType.name}: {orb.amount}"
                >
                  {#if specialType.type === 'bits'}
                    <div class="flex items-center gap-1">
                      <span>{orb.amount}</span>
                      <ChipIcon size="sm" class="text-yellow-400" />
                    </div>
                  {:else if specialType.type === 'glitchbytes'}
                    {orb.amount}👾
                  {/if}
                </div>
              </div>
            {/each}
            <!-- Consumed commands for this type -->
            {#if gameState.orbBag[specialType.type].total.length > gameState.orbBag[specialType.type].available.length}
              {#each Array(gameState.orbBag[specialType.type].total.length - gameState.orbBag[specialType.type].available.length) as _, consumedIndex}
                {@const consumedOrb = gameState.orbBag[specialType.type].total[gameState.orbBag[specialType.type].available.length + consumedIndex]}
                <div class="min-w-8 h-8 px-1 border border-gray-600 bg-gray-800 text-yellow-600 flex items-center justify-center text-sm"
                     title="Used {specialType.name}: {consumedOrb.amount}">
                  {#if specialType.type === 'bits'}
                    <div class="flex items-center gap-1">
                      <span>{consumedOrb.amount}</span>
                      <ChipIcon size="sm" class="text-yellow-600" />
                    </div>
                  {:else if specialType.type === 'glitchbytes'}
                    {consumedOrb.amount}👾
                  {/if}
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
