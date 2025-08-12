<script lang="ts">
  import { getLevelMilestone } from '../game/levels.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<!-- Stats - Compact horizontal layout -->
<div class="bg-white p-3 rounded-lg shadow-sm border h-full flex flex-col">
  <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3">
    <div>
      <div class="text-lg font-bold text-green-600">{gameState.playerStats.cheddah}</div>
      <div class="text-gray-600">CHEDDAH</div>
    </div>
    <div>
      <div class="text-lg font-bold text-blue-600">{gameState.currentLevel}</div>
      <div class="text-gray-600">LEVEL</div>
    </div>
    <div>
      <div class="text-lg font-bold text-purple-600">{gameState.playerStats.points}</div>
      <div class="text-gray-600">POINTS</div>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3">
    <div>
      <div class="text-lg font-bold text-red-600">{gameState.playerStats.health}</div>
      <div class="text-gray-600">HEALTH</div>
    </div>
    <div>
      <div class="text-lg font-bold text-orange-600">{gameState.playerStats.levelMultiplier}×</div>
      <div class="text-gray-600">MULT</div>
    </div>
    <div>
      <div class="text-lg font-bold text-gray-600">{getLevelMilestone(gameState.currentLevel)}</div>
      <div class="text-gray-600">MILESTONE</div>
    </div>
  </div>
  
  <!-- Progress Bars Section -->
  <div class="space-y-2">
    <!-- Health Progress Bar -->
    <div>
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="text-gray-600">HEALTH</span>
        <span class="text-gray-600">{gameState.playerStats.health}/5</span>
      </div>
      <div class="bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300 {gameState.playerStats.health <= 2 ? 'bg-red-500' : 'bg-green-500'}"
          style="width: {(gameState.playerStats.health / 5) * 100}%"
        ></div>
      </div>
      {#if gameState.playerStats.health <= 2}
        <p class="text-red-600 font-medium text-xs mt-1">⚠️ LOW HEALTH!</p>
      {/if}
    </div>
    
    <!-- Points Progress Bar -->
    <div>
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="text-gray-600">POINTS</span>
        <span class="text-gray-600">{gameState.playerStats.points}/{getLevelMilestone(gameState.currentLevel)}</span>
      </div>
      <div class="bg-gray-200 rounded-full h-2">
        <div 
          class="bg-purple-500 h-2 rounded-full transition-all duration-300"
          style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
        ></div>
      </div>
    </div>
  </div>
</div>