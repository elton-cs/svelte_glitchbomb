<script lang="ts">
  import type { GameState, PointHistoryEntry } from '../game/types.js';
  import { getLevelEntryCost, getCumulativeLevelCost } from '../game/economics.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  // Calculate chart dimensions and data
  const chartData = $derived(() => {
    const history = gameState.pointHistory;
    if (history.length === 0) return { 
      points: [], 
      profitLossValues: [],
      maxValue: 50, 
      minValue: -20, 
      zeroY: 50,
      range: 70 
    };
    
    // Convert point history to profit/loss values
    const cumulativeLevelCost = getCumulativeLevelCost(gameState.currentLevel);
    const profitLossValues = history.map(h => h.points - cumulativeLevelCost);
    
    const maxValue = Math.max(...profitLossValues, 50); // Minimum top of 50
    const minValue = Math.min(...profitLossValues, -20); // Minimum bottom of -20
    const range = maxValue - minValue;
    const zeroY = (maxValue / range) * 100; // Y position of zero line as percentage
    
    return { 
      points: history, 
      profitLossValues,
      maxValue, 
      minValue, 
      zeroY,
      range 
    };
  });

  // Convert point history to SVG path coordinates
  const chartPaths = $derived(() => {
    const { points, profitLossValues, maxValue, minValue, range } = chartData();
    if (points.length === 0) return { segments: [], points: [], profitLossValues: [] };
    
    const width = 260; // SVG width minus padding for axes
    const height = 200; // SVG height minus padding for axes
    
    // Create segments for positive and negative sections
    let segments: Array<{path: string, color: string}> = [];
    let currentPath = '';
    let currentColor = '';
    
    profitLossValues.forEach((profitLoss: number, index: number) => {
      const x = profitLossValues.length === 1 ? width / 2 : (index / (profitLossValues.length - 1)) * width;
      const y = height - ((profitLoss - minValue) / range) * height;
      const isPositive = profitLoss >= 0;
      const color = isPositive ? '#10b981' : '#ef4444'; // green or red
      
      if (index === 0) {
        currentPath = `M ${x},${y}`;
        currentColor = color;
      } else {
        if (color === currentColor) {
          currentPath += ` L ${x},${y}`;
        } else {
          // Color change - finish current segment and start new one
          segments.push({ path: currentPath, color: currentColor });
          const prevX = profitLossValues.length === 1 ? width / 2 : ((index - 1) / (profitLossValues.length - 1)) * width;
          const prevY = height - ((profitLossValues[index - 1] - minValue) / range) * height;
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
    const totalPointsGained = gameState.playerStats.points;
    const cumulativeLevelCost = getCumulativeLevelCost(gameState.currentLevel);
    return totalPointsGained - cumulativeLevelCost;
  });

  const profitLossClass = $derived(() => {
    const pnl = currentProfitLoss();
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-white';
  });
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">PROFIT/LOSS</h2>
  
  <!-- Compact P/L Header -->
  <div class="mb-2 flex justify-between items-center">
    <div class="text-xs text-gray-400">P/L: {gameState.playerStats.points} vs {getCumulativeLevelCost(gameState.currentLevel)}</div>
    <div class="text-sm font-bold {profitLossClass()}">
      {currentProfitLoss() >= 0 ? '+' : ''}{currentProfitLoss()}
    </div>
  </div>

  <!-- Profit/Loss Chart -->
  <div class="flex-1 flex flex-col">
    
    {#if chartData().points.length > 0}
      <div class="flex-1 bg-gray-900 rounded border border-gray-700 p-1">
        <svg width="100%" height="100%" viewBox="0 0 300 240" class="overflow-visible">
          <!-- Grid lines -->
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect x="30" y="10" width="260" height="200" fill="url(#grid)" opacity="0.3"/>
          
          <!-- Chart area -->
          <g transform="translate(30, 10)">
            <!-- Zero line (white) -->
            <line 
              x1="0" 
              y1={200 - ((0 - chartData().minValue) / chartData().range) * 200} 
              x2="260" 
              y2={200 - ((0 - chartData().minValue) / chartData().range) * 200} 
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
              {@const x = chartPaths().profitLossValues.length === 1 ? 130 : (index / (chartPaths().profitLossValues.length - 1)) * 260}
              {@const y = 200 - ((Number(profitLoss) - chartData().minValue) / chartData().range) * 200}
              {@const pointColor = Number(profitLoss) >= 0 ? '#10b981' : '#ef4444'}
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
                <title>{entry.action}: {Number(profitLoss) >= 0 ? '+' : ''}{profitLoss} P/L</title>
              </circle>
            {/each}
          </g>
          
          <!-- Y-axis -->
          <line x1="30" y1="10" x2="30" y2="210" stroke="#9ca3af" stroke-width="1"/>
          <!-- X-axis -->
          <line x1="30" y1="210" x2="290" y2="210" stroke="#9ca3af" stroke-width="1"/>
          
          <!-- Y-axis labels -->
          <text x="25" y="15" fill="#9ca3af" font-size="8" text-anchor="end">{chartData().maxValue}</text>
          <text x="25" y="215" fill="#9ca3af" font-size="8" text-anchor="end">{chartData().minValue}</text>
          <text x="25" y={210 - ((0 - chartData().minValue) / chartData().range) * 200 + 3} fill="white" font-size="8" text-anchor="end" font-weight="bold">0</text>
          
          <!-- X-axis labels -->
          <text x="35" y="225" fill="#9ca3af" font-size="8">Start</text>
          <text x="285" y="225" fill="#9ca3af" font-size="8" text-anchor="end">
            {chartData().points.length > 1 ? `Pull ${chartData().points.length}` : 'Current'}
          </text>
        </svg>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-gray-500 text-xs">
        No point data yet
      </div>
    {/if}
  </div>
</div>