<script lang="ts">
  import type {
    GameState,
    GameLogEntry,
    OrbPullLogEntry,
    ShopPurchaseLogEntry,
    LevelChangeLogEntry,
    PointsConversionLogEntry,
    GameEventLogEntry,
    SystemLogEntry,
  } from "../../game/types";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

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

  function formatOrbPullEntry(entry: OrbPullLogEntry): string {
    const { orbType, amount, effect } = entry.data;

    switch (orbType) {
      case "health":
        return `<span class="text-red-500">HEALTH</span> > +${effect.health} Health`;

      case "point":
        if (
          effect.appliedMultiplier &&
          effect.appliedMultiplier > 1 &&
          effect.basePoints
        ) {
          return `<span class="text-green-400">POINTS</span> > ${effect.basePoints} * ${effect.appliedMultiplier}x = +${effect.points} Points`;
        } else {
          return `<span class="text-green-400">POINTS</span> > +${effect.points} Points`;
        }

      case "bomb":
        const bombCount = effect.bombsPulled || 1;
        if (effect.bombDamage === 1) {
          return `<span class="text-orange-500">GLITCH BOMB</span> > Single Bomb: -1 Health`;
        } else if (effect.bombDamage === 2) {
          return `<span class="text-orange-500">GLITCH BOMB</span> > Double Bomb: -2 Health`;
        } else if (effect.bombDamage === 3) {
          return `<span class="text-orange-500">GLITCH BOMB</span> > TRIPLE BOMB: -3 Health`;
        } else {
          return `<span class="text-orange-500">GLITCH BOMB</span> > -${effect.bombDamage} Health`;
        }

      case "points_per_anyorb":
        const orbsConsumed = effect.orbsConsumed || 0;
        if (
          effect.appliedMultiplier &&
          effect.appliedMultiplier > 1 &&
          effect.basePoints
        ) {
          return `<span class="text-green-400">POINTS</span> > ${amount}/RC: ${amount} Points * ${orbsConsumed} Commands = ${effect.basePoints} * ${effect.appliedMultiplier}x = +${effect.points} Points`;
        } else {
          return `<span class="text-green-400">POINTS</span> > ${amount}/RC: ${amount} Points * ${orbsConsumed} Commands = +${effect.points} Points`;
        }

      case "points_per_bombpulled":
        const bombsPulled = effect.bombsPulled || 0;
        if (
          effect.appliedMultiplier &&
          effect.appliedMultiplier > 1 &&
          effect.basePoints
        ) {
          return `<span class="text-green-400">POINTS</span> > ${amount}/B: ${amount} Points * ${bombsPulled} Bomb Commands = ${effect.basePoints} * ${effect.appliedMultiplier}x = +${effect.points} Points`;
        } else {
          return `<span class="text-green-400">POINTS</span> > ${amount}/B: ${amount} Points * ${bombsPulled} Bomb Commands = +${effect.points} Points`;
        }

      case "multiplier":
        return `<span class="text-blue-400">MULTIPLIER</span> > +${effect.multiplier}x Multiplier`;

      case "bits":
        return `<span class="text-blue-500">CHIPS</span> > +${effect.chips} ${chipIcon}`;

      case "glitchbytes":
        return `<span class="text-cyan-500">MOONROCKS</span> > +${effect.glitchbytes} 👾`;

      default:
        return `<span class="text-yellow-400">SPECIAL</span> > ${orbType} orb pulled`;
    }
  }

  function formatShopPurchaseEntry(entry: ShopPurchaseLogEntry): string {
    const { itemName, cost } = entry.data;
    return `<span class="text-orange-400">MOD SHOP</span> > install ${itemName} > -${cost} ${chipIcon}`;
  }

  function formatLevelChangeEntry(entry: LevelChangeLogEntry): string {
    const { fromLevel, toLevel, cost, reward, reason } = entry.data;

    switch (reason) {
      case "advance":
        return `<span class="text-purple-500">ADVANCE</span> > level ${toLevel} > -${cost} 👾`;

      case "complete":
        return `<span class="text-cyan-400">SYSTEM</span> > Level ${fromLevel} completed!`;

      case "victory":
        return `<span class="text-purple-500">VICTORY</span> > Level ${fromLevel} completed > +${reward} 👾`;

      case "skip":
        if (reward) {
          return `<span class="text-yellow-500">DEBUG</span> > Level ${fromLevel} skipped to victory > +${reward} 👾`;
        } else {
          return `<span class="text-yellow-500">DEBUG</span> > Level ${fromLevel} skipped`;
        }

      default:
        return `<span class="text-cyan-400">SYSTEM</span> > Level change`;
    }
  }

  function formatPointsConversionEntry(
    entry: PointsConversionLogEntry
  ): string {
    const { pointsConverted, chipsGained, totalChips, conversionType } =
      entry.data;

    switch (conversionType) {
      case "manual":
        return `<span class="text-blue-500">CHIPS</span> > Converted ${pointsConverted} points > +${chipsGained} ${chipIcon}`;

      case "level_end":
        return `<span class="text-blue-500">CHIPS</span> > +${chipsGained} ${chipIcon}`;

      case "cash_out":
        return `<span class="text-cyan-500">MOONROCKS</span> > +${pointsConverted} 👾`;

      default:
        return `<span class="text-blue-500">CHIPS</span> > Points conversion`;
    }
  }

  function formatGameEventEntry(entry: GameEventLogEntry): string {
    const { event, details } = entry.data;

    switch (event) {
      case "game_start":
        return `<span class="text-cyan-400">SYSTEM</span> > Game started`;

      case "game_over":
        return `<span class="text-cyan-400">SYSTEM</span> > Game over`;

      case "return_to_menu":
        return `<span class="text-cyan-400">SYSTEM</span> > Returned to main menu`;

      case "cash_out":
        if (details?.glitchbytesEarned) {
          return `<span class="text-cyan-500">MOONROCKS</span> > +${details.glitchbytesEarned} 👾`;
        }
        return `<span class="text-cyan-400">SYSTEM</span> > Cashed out`;

      default:
        return `<span class="text-cyan-400">SYSTEM</span> > ${event}`;
    }
  }

  function formatSystemEntry(entry: SystemLogEntry): string {
    const { message, level } = entry.data;

    switch (level) {
      case "debug":
        return `<span class="text-yellow-500">DEBUG</span> > ${message}`;
      case "warning":
        return `<span class="text-orange-500">WARNING</span> > ${message}`;
      case "error":
        return `<span class="text-red-500">ERROR</span> > ${message}`;
      default:
        return `<span class="text-cyan-400">SYSTEM</span> > ${message}`;
    }
  }

  function formatLogEntry(entry: GameLogEntry): string {
    switch (entry.type) {
      case "orb_pulled":
        return formatOrbPullEntry(entry as OrbPullLogEntry);

      case "shop_purchase":
        return formatShopPurchaseEntry(entry as ShopPurchaseLogEntry);

      case "level_change":
        return formatLevelChangeEntry(entry as LevelChangeLogEntry);

      case "points_conversion":
        return formatPointsConversionEntry(entry as PointsConversionLogEntry);

      case "game_event":
        return formatGameEventEntry(entry as GameEventLogEntry);

      case "system":
        return formatSystemEntry(entry as SystemLogEntry);

      default:
        return `<span class="text-red-500">UNKNOWN</span> > Unknown log entry`;
    }
  }
</script>

<!-- Game Log - Always visible -->
<div
  class="p-3 rounded-lg border border-white h-full flex flex-col min-h-0"
>
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
