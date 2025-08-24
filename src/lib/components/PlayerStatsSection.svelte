<script lang="ts">
  import { getLevelMilestone } from '../game/levels.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<!-- Player Stats Panel - Match provided design -->
<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col overflow-hidden">
  <h2 class="text-sm font-bold mb-3 text-white">PLAYER STATS</h2>
  
  <!-- Main Glitch Bytes Display -->
  <div class="text-center mb-4">
    <div class="text-4xl font-bold text-white mb-1">{gameState.playerStats.glitchbytes}</div>
    <div class="text-white text-xs tracking-wide">GLITCH BYTES</div>
  </div>
  
  <!-- Three stats in a row -->
  <div class="grid grid-cols-3 gap-4 text-center mb-4">
    <div>
      <div class="text-2xl font-bold text-purple-400 mb-1">{gameState.currentLevel}</div>
      <div class="text-white text-xs">LEVEL</div>
    </div>
    <div>
      <div class="text-2xl font-bold text-blue-400 mb-1">{gameState.playerStats.levelMultiplier}x</div>
      <div class="text-white text-xs">MULT</div>
    </div>
    <div>
      <div class="text-2xl font-bold text-yellow-400 mb-1">{gameState.playerStats.bits}</div>
      <div class="text-white text-xs">BITS</div>
    </div>
  </div>
  
  <!-- Progress Bars Section -->
  <div class="flex-1 flex flex-col justify-center space-y-3">
    <!-- Points Progress Bar -->
    <div class="flex-1 flex flex-col justify-center">
      <div class="text-green-400 text-lg font-bold mb-3 text-center">POINTS {gameState.playerStats.points}/{getLevelMilestone(gameState.currentLevel)}</div>
      <div class="bg-gray-800 rounded-full h-8 border border-gray-600">
        <div 
          class="bg-white h-full rounded-full transition-all duration-300"
          style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
        ></div>
      </div>
    </div>
    
    <!-- Health Progress Bar -->
    <div class="flex-1 flex flex-col justify-center">
      <div class="text-red-400 text-lg font-bold mb-3 text-center">HEALTH {gameState.playerStats.health}/5</div>
      <div class="bg-gray-800 rounded-full h-8 border border-gray-600">
        <div 
          class="bg-white h-full rounded-full transition-all duration-300"
          style="width: {(gameState.playerStats.health / 5) * 100}%"
        ></div>
      </div>
    </div>
  </div>
</div>