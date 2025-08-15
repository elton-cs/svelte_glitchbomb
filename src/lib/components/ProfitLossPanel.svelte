<script lang="ts">
  import type { GameState, PointHistoryEntry } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  // Calculate chart dimensions and data
  const chartData = $derived(() => {
    const history = gameState.pointHistory;
    if (history.length === 0) return { 
      points: [], 
      maxValue: 100, 
      minValue: -50, 
      zeroY: 50,
      range: 150 
    };
    
    const pointValues = history.map(h => h.points);
    const maxValue = Math.max(...pointValues, 100); // Minimum top of 100
    const minValue = Math.min(...pointValues, -50); // Minimum bottom of -50
    const range = maxValue - minValue;
    const zeroY = (maxValue / range) * 100; // Y position of zero line as percentage
    
    return { 
      points: history, 
      maxValue, 
      minValue, 
      zeroY,
      range 
    };
  });

  // Convert point history to SVG path coordinates
  const chartPaths = $derived(() => {
    const { points, maxValue, minValue, range } = chartData();
    if (points.length === 0) return { positive: '', negative: '', segments: [] };
    
    const width = 260; // SVG width minus padding for axes
    const height = 80; // SVG height minus padding for axes
    
    // Create segments for positive and negative sections
    let segments: Array<{path: string, color: string}> = [];
    let currentPath = '';
    let currentColor = '';
    
    points.forEach((entry: PointHistoryEntry, index: number) => {
      const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
      const y = height - ((entry.points - minValue) / range) * height;
      const isPositive = entry.points >= 0;
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
          currentPath = `M ${points.length === 1 ? width / 2 : ((index - 1) / (points.length - 1)) * width},${height - ((points[index - 1].points - minValue) / range) * height} L ${x},${y}`;
          currentColor = color;
        }
      }
      
      if (index === points.length - 1) {
        segments.push({ path: currentPath, color: currentColor });
      }
    });
    
    return { segments, points };
  });

  // Current profit/loss calculation
  const currentProfitLoss = $derived(() => {
    const totalPointsGained = gameState.playerStats.points;
    const levelCosts = gameState.currentLevel * 10; // Simplified cost calculation
    return totalPointsGained - levelCosts;
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
  
  <!-- Current P/L Display -->
  <div class="mb-4 text-center">
    <div class="text-xs text-gray-400 mb-1">Current Session</div>
    <div class="text-lg font-bold {profitLossClass()}">
      {currentProfitLoss() >= 0 ? '+' : ''}{currentProfitLoss()}
    </div>
    <div class="text-xs text-gray-400">
      {gameState.playerStats.points} pts earned
    </div>
  </div>

  <!-- Points Chart -->
  <div class="flex-1 flex flex-col">
    <div class="text-xs text-gray-400 mb-2">Points Over Time</div>
    
    {#if chartData().points.length > 0}
      <div class="flex-1 bg-gray-900 rounded border border-gray-700 p-2">
        <svg width="100%" height="120" viewBox="0 0 300 120" class="overflow-visible">
          <!-- Grid lines -->
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect x="30" y="10" width="260" height="80" fill="url(#grid)" opacity="0.3"/>
          
          <!-- Chart area -->
          <g transform="translate(30, 10)">
            <!-- Zero line (white) -->
            <line 
              x1="0" 
              y1={80 - ((0 - chartData().minValue) / chartData().range) * 80} 
              x2="260" 
              y2={80 - ((0 - chartData().minValue) / chartData().range) * 80} 
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
            {#each chartData().points as entry, index}
              {@const x = chartData().points.length === 1 ? 130 : (index / (chartData().points.length - 1)) * 260}
              {@const y = 80 - ((entry.points - chartData().minValue) / chartData().range) * 80}
              {@const pointColor = entry.points >= 0 ? '#10b981' : '#ef4444'}
              <circle 
                cx={x} 
                cy={y} 
                r="2" 
                fill={pointColor}
                stroke="white"
                stroke-width="1"
                class="hover:r-3 transition-all"
              >
                <title>{entry.action}: {entry.points} points</title>
              </circle>
            {/each}
          </g>
          
          <!-- Y-axis -->
          <line x1="30" y1="10" x2="30" y2="90" stroke="#9ca3af" stroke-width="1"/>
          <!-- X-axis -->
          <line x1="30" y1="90" x2="290" y2="90" stroke="#9ca3af" stroke-width="1"/>
          
          <!-- Y-axis labels -->
          <text x="25" y="15" fill="#9ca3af" font-size="8" text-anchor="end">{chartData().maxValue}</text>
          <text x="25" y="95" fill="#9ca3af" font-size="8" text-anchor="end">{chartData().minValue}</text>
          <text x="25" y={90 - ((0 - chartData().minValue) / chartData().range) * 80 + 3} fill="white" font-size="8" text-anchor="end" font-weight="bold">0</text>
          
          <!-- X-axis labels -->
          <text x="35" y="105" fill="#9ca3af" font-size="8">Start</text>
          <text x="285" y="105" fill="#9ca3af" font-size="8" text-anchor="end">
            {chartData().points.length > 1 ? `Pull ${chartData().points.length}` : 'Current'}
          </text>
        </svg>
      </div>
      
      <!-- Recent actions -->
      <div class="mt-2">
        <div class="text-xs text-gray-400 mb-1">Recent Actions:</div>
        <div class="text-xs space-y-1 max-h-16 overflow-y-auto">
          {#each gameState.pointHistory.slice(-3).reverse() as entry}
            <div class="flex justify-between">
              <span class="text-gray-300 truncate">{entry.action}</span>
              <span class="text-white">{entry.points}</span>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-gray-500 text-xs">
        No point data yet
      </div>
    {/if}
  </div>
</div>