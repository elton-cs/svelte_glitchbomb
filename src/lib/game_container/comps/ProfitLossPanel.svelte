<script lang="ts">
  import type { GameState, PointHistoryEntry } from "../../game/types";
  import {
    getLevelEntryCost,
    getCumulativeLevelCost,
  } from "../../game/economics";
  import { getLevelMilestone } from "../../game/levels";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  // Calculate chart dimensions and data
  const chartData = $derived(() => {
    const history = gameState.pointHistory;
    if (history.length === 0)
      return {
        points: [],
        profitLossValues: [],
        maxValue: getLevelMilestone(gameState.currentLevel),
        minValue: -getCumulativeLevelCost(gameState.currentLevel),
        zeroY: 50,
        range:
          getLevelMilestone(gameState.currentLevel) +
          getCumulativeLevelCost(gameState.currentLevel),
      };

    // Convert point history to profit/loss values using stored cumulative costs
    const profitLossValues = history.map((h) => h.points - h.cumulativeCost);

    // Use current level milestone as baseline, but extend if player exceeds it
    const currentMilestone = getLevelMilestone(gameState.currentLevel);
    const maxPoints = Math.max(...profitLossValues);
    const maxValue = Math.max(maxPoints, currentMilestone); // Use milestone as minimum, extend if needed

    // Use cumulative cost as baseline minimum, but extend if player goes further negative
    const minPoints = Math.min(...profitLossValues);
    const minValue = Math.min(
      minPoints,
      -getCumulativeLevelCost(gameState.currentLevel)
    ); // Use -cost as minimum, extend if needed
    const range = maxValue - minValue;
    const zeroY = (maxValue / range) * 100; // Y position of zero line as percentage

    return {
      points: history,
      profitLossValues,
      maxValue,
      minValue,
      zeroY,
      range,
    };
  });

  // Convert point history to SVG path coordinates
  const chartPaths = $derived(() => {
    const { points, profitLossValues, maxValue, minValue, range } = chartData();
    if (points.length === 0)
      return { segments: [], points: [], profitLossValues: [] };

    const width = 250; // SVG width minus padding for axes
    const height = 170; // SVG height minus padding for axes

    // Create segments for positive and negative sections
    let segments: Array<{ path: string; color: string }> = [];
    let currentPath = "";
    let currentColor = "";

    profitLossValues.forEach((profitLoss: number, index: number) => {
      const x =
        profitLossValues.length === 1
          ? width / 2
          : (index / (profitLossValues.length - 1)) * width;
      const y = height - ((profitLoss - minValue) / range) * height;
      const isPositive = profitLoss >= 0;
      const color = isPositive ? "#10b981" : "#ef4444"; // green or red

      if (index === 0) {
        currentPath = `M ${x},${y}`;
        currentColor = color;
      } else {
        if (color === currentColor) {
          currentPath += ` L ${x},${y}`;
        } else {
          // Color change - finish current segment and start new one
          segments.push({ path: currentPath, color: currentColor });
          const prevX =
            profitLossValues.length === 1
              ? width / 2
              : ((index - 1) / (profitLossValues.length - 1)) * width;
          const prevY =
            height -
            ((profitLossValues[index - 1] - minValue) / range) * height;
          currentPath = `M ${prevX},${prevY} L ${x},${y}`;
          currentColor = color;
        }
      }

      if (index === profitLossValues.length - 1) {
        segments.push({ path: currentPath, color: currentColor });
      }
    });

    return { segments, points, profitLossValues };
  });

  // Current profit/loss calculation
  const currentProfitLoss = $derived(() => {
    // In menu phase, show 0 since no game cost has been incurred
    if (gameState.phase === "menu") {
      return 0;
    }

    const totalPointsGained = gameState.playerStats.points;
    const cumulativeLevelCost = getCumulativeLevelCost(gameState.currentLevel);
    return totalPointsGained - cumulativeLevelCost;
  });

  const profitLossClass = $derived(() => {
    const pnl = currentProfitLoss();
    if (pnl > 0) return "text-green-400";
    if (pnl < 0) return "text-red-400";
    return "text-white";
  });
</script>

<div
  class="p-2 rounded-lg shadow-sm border border-white h-full flex flex-col min-h-0"
>
  <!-- P/L Header -->
  <div class="mb-1 flex justify-between items-center flex-shrink-0">
    <div class="text-md font-bold text-white">
      P/L: {gameState.playerStats.points}/{gameState.phase === "menu"
        ? 0
        : getCumulativeLevelCost(gameState.currentLevel)}
    </div>
    <div class="text-md font-bold {profitLossClass()}">
      {currentProfitLoss() >= 0 ? "+" : ""}{currentProfitLoss()}
    </div>
  </div>

  <!-- Profit/Loss Chart -->
  <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
    {#if chartData().points.length > 0}
      <div class="flex-1 rounded p-1 overflow-hidden min-h-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 220"
          class="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Grid lines -->
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#4b5563"
                stroke-width="0.5"
              />
            </pattern>
          </defs>
          <rect
            x="25"
            y="5"
            width="250"
            height="170"
            fill="url(#grid)"
            opacity="0.3"
          />

          <!-- Chart area -->
          <g transform="translate(25, 5)">
            <!-- Zero line (white) -->
            <line
              x1="0"
              y1={170 - ((0 - chartData().minValue) / chartData().range) * 170}
              x2="250"
              y2={170 - ((0 - chartData().minValue) / chartData().range) * 170}
              stroke="white"
              stroke-width="1"
              stroke-dasharray="2,2"
            />

            <!-- Chart segments with colors -->
            {#each chartPaths().segments as segment}
              <path
                d={segment.path}
                fill="none"
                stroke={segment.color}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            {/each}

            <!-- Data points -->
            {#each chartPaths().profitLossValues as profitLoss, index (index)}
              {@const x =
                chartPaths().profitLossValues.length === 1
                  ? 125
                  : (index / (chartPaths().profitLossValues.length - 1)) * 250}
              {@const y =
                170 -
                ((Number(profitLoss) - chartData().minValue) /
                  chartData().range) *
                  170}
              {@const pointColor =
                Number(profitLoss) >= 0 ? "#10b981" : "#ef4444"}
              {@const entry = chartPaths().points[index]}
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={pointColor}
                stroke="white"
                stroke-width="1"
                class="hover:r-4 transition-all"
              >
                <title
                  >{entry.action}: {Number(profitLoss) >= 0
                    ? "+"
                    : ""}{profitLoss} P/L</title
                >
              </circle>
            {/each}
          </g>

          <!-- Y-axis -->
          <line
            x1="25"
            y1="5"
            x2="25"
            y2="175"
            stroke="white"
            stroke-width="1"
          />
          <!-- X-axis -->
          <line
            x1="25"
            y1="175"
            x2="275"
            y2="175"
            stroke="white"
            stroke-width="1"
          />

          <!-- Y-axis labels -->
          <text x="20" y="10" fill="white" font-size="8" text-anchor="end"
            >{chartData().maxValue}</text
          >
          <text x="20" y="180" fill="white" font-size="8" text-anchor="end"
            >{chartData().minValue}</text
          >
          <text
            x="20"
            y={175 - ((0 - chartData().minValue) / chartData().range) * 170 + 3}
            fill="white"
            font-size="8"
            text-anchor="end"
            font-weight="bold">0</text
          >

          <!-- X-axis labels -->
          <text x="30" y="190" fill="white" font-size="8">Start</text>
          <text x="270" y="190" fill="white" font-size="8" text-anchor="end">
            {chartData().points.length > 1
              ? `Exec ${chartData().points.length}`
              : "Current"}
          </text>
        </svg>
      </div>
    {:else}
      <div
        class="flex-1 flex items-center justify-center text-gray-500 text-xs min-h-0"
      >
        No point data yet
      </div>
    {/if}
  </div>
</div>
