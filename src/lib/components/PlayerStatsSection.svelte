<script lang="ts">
  import { getLevelMilestone } from '../game/levels.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<!-- Stats - Compact horizontal layout -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">PLAYER STATS</h2>
  
  <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3">
    <div>
      <div class="text-lg font-bold text-white">{gameState.playerStats.cheddah}</div>
      <div class="text-white">CHEDDAH</div>
    </div>
    <div>
      <div class="text-lg font-bold text-white">{gameState.currentLevel}</div>
      <div class="text-white">LEVEL</div>
    </div>
    <div>
      <div class="text-lg font-bold text-white">{gameState.playerStats.points}</div>
      <div class="text-white">POINTS</div>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3">
    <div>
      <div class="text-lg font-bold text-white">{gameState.playerStats.health}</div>
      <div class="text-white">HEALTH</div>
    </div>
    <div>
      <div class="text-lg font-bold text-white">{gameState.playerStats.levelMultiplier}×</div>
      <div class="text-white">MULT</div>
    </div>
    <div>
      <div class="text-lg font-bold text-white">{getLevelMilestone(gameState.currentLevel)}</div>
      <div class="text-white">MILESTONE</div>
    </div>
  </div>
  
  <!-- Progress Bars Section -->
  <div class="space-y-2">
    <!-- Health Progress Bar -->
    <div>
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="text-white">HEALTH</span>
        <span class="text-white">{gameState.playerStats.health}/5</span>
      </div>
      <div class="bg-gray-800 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300 {gameState.playerStats.health <= 2 ? 'bg-white' : 'bg-white'}"
          style="width: {(gameState.playerStats.health / 5) * 100}%"
        ></div>
      </div>
      {#if gameState.playerStats.health <= 2}
        <p class="text-white font-medium text-xs mt-1">⚠️ LOW HEALTH!</p>
      {/if}
    </div>
    
    <!-- Points Progress Bar -->
    <div>
      <div class="flex justify-between items-center text-xs mb-1">
        <span class="text-white">POINTS</span>
        <span class="text-white">{gameState.playerStats.points}/{getLevelMilestone(gameState.currentLevel)}</span>
      </div>
      <div class="bg-gray-800 rounded-full h-2">
        <div 
          class="bg-white h-2 rounded-full transition-all duration-300"
          style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
        ></div>
      </div>
    </div>
  </div>
</div>