<script lang="ts">
  import type { GameState, PointHistoryEntry } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  // Calculate chart dimensions and data
  const chartData = $derived(() => {
    const history = gameState.pointHistory;
    if (history.length === 0) return { points: [], maxPoints: 0, minTime: 0, maxTime: 0 };
    
    const maxPoints = Math.max(...history.map(h => h.points), 0);
    const minTime = history[0]?.timestamp || 0;
    const maxTime = history[history.length - 1]?.timestamp || 0;
    
    return { points: history, maxPoints, minTime, maxTime };
  });

  // Convert point history to SVG path coordinates
  const chartPath = $derived(() => {
    const { points, maxPoints, minTime, maxTime } = chartData();
    if (points.length === 0) return '';
    
    const width = 280; // SVG width minus padding
    const height = 100; // SVG height minus padding
    
    const pathPoints = points.map((entry: PointHistoryEntry, index: number) => {
      const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
      const y = maxPoints === 0 ? height / 2 : height - (entry.points / maxPoints) * height;
      return `${x},${y}`;
    });
    
    return `M ${pathPoints.join(' L ')}`;
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
          <rect width="300" height="120" fill="url(#grid)" opacity="0.3"/>
          
          <!-- Chart area -->
          <g transform="translate(10, 10)">
            <!-- Points line -->
            {#if chartPath()}
              <path 
                d={chartPath()} 
                fill="none" 
                stroke="#10b981" 
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
              <!-- Data points -->
              {#each chartData().points as entry, index}
                {@const x = chartData().points.length === 1 ? 140 : (index / (chartData().points.length - 1)) * 280}
                {@const y = chartData().maxPoints === 0 ? 50 : 100 - (entry.points / chartData().maxPoints) * 100}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="2" 
                  fill="#10b981"
                  class="hover:r-3 transition-all"
                >
                  <title>{entry.action}: {entry.points} points</title>
                </circle>
              {/each}
            {/if}
          </g>
          
          <!-- Y-axis labels -->
          <text x="5" y="15" fill="#9ca3af" font-size="8">{chartData().maxPoints}</text>
          <text x="5" y="110" fill="#9ca3af" font-size="8">0</text>
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