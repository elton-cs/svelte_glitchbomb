<script lang="ts">
  import { getLevelMilestone } from '../game/levels.js';
  import { getPhaseDisplayName } from '../game/gameStates.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<div class="bg-gray-100 p-4 rounded border">
  <h2 class="text-lg font-bold mb-3">Game Stats</h2>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div class="text-center">
      <div class="text-2xl font-bold text-blue-600">{gameState.playerStats.moonrocks}</div>
      <div class="text-sm text-gray-600">Moonrocks</div>
    </div>
    
    <div class="text-center">
      <div class="text-2xl font-bold text-green-600">{gameState.playerStats.cheddah}</div>
      <div class="text-sm text-gray-600">Cheddah</div>
    </div>
    
    <div class="text-center">
      <div class="text-2xl font-bold text-red-600">{gameState.playerStats.health}</div>
      <div class="text-sm text-gray-600">Health</div>
    </div>
    
    <div class="text-center">
      <div class="text-2xl font-bold text-purple-600">{gameState.playerStats.points}</div>
      <div class="text-sm text-gray-600">Points</div>
    </div>
  </div>
  
  <div class="border-t pt-3">
    <div class="flex justify-between items-center mb-2">
      <span class="font-medium">Status:</span>
      <span class="text-gray-700">{getPhaseDisplayName(gameState.phase)}</span>
    </div>
    
    {#if gameState.gameStarted}
      <div class="flex justify-between items-center mb-2">
        <span class="font-medium">Level:</span>
        <span class="text-gray-700">{gameState.currentLevel} / 5</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="font-medium">Milestone:</span>
        <span class="text-gray-700">
          {gameState.playerStats.points} / {getLevelMilestone(gameState.currentLevel)}
        </span>
      </div>
      
      <div class="mt-2">
        <div class="bg-gray-200 rounded-full h-2">
          <div 
            class="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style="width: {Math.min(100, (gameState.playerStats.points / getLevelMilestone(gameState.currentLevel)) * 100)}%"
          ></div>
        </div>
      </div>
    {/if}
  </div>
</div>