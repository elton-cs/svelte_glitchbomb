<script lang="ts">
  import { 
    startNewGame, 
    cashOutMidLevel, 
    cashOutPostLevel, 
    proceedToNextLevel, 
    returnToMenu,
    pullOrb 
  } from '../game/game.js';
  import { canAffordLevel, getLevelEntryCost } from '../game/economics.js';
  import { GAME_CONFIG } from '../game/constants.js';
  import { isLastLevel, getNextLevel } from '../game/levels.js';
  import type { GameState } from '../game/types.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handleStartGame() {
    startNewGame(gameState);
  }

  function handleCashOutMidLevel() {
    if (confirm(`Cash out ${gameState.playerStats.points} points for moonrocks? You'll lose progress and moonrocks spent on this level.`)) {
      const amount = cashOutMidLevel(gameState);
    }
  }

  function handleCashOutPostLevel() {
    if (confirm(`Cash out ${gameState.playerStats.points} points for moonrocks and end the game?`)) {
      const amount = cashOutPostLevel(gameState);
    }
  }

  function handleProceedToNext() {
    proceedToNextLevel(gameState);
  }

  function handleReturnToMenu() {
    returnToMenu(gameState);
  }

  function handlePullOrb() {
    pullOrb(gameState);
  }

  const canStartGame = $derived(gameState.phase === 'menu' && canAffordLevel(gameState.playerStats.moonrocks, 1));
  const canCashOutMid = $derived(gameState.phase === 'level' && gameState.gameStarted);
  const canCashOutPost = $derived(gameState.phase === 'marketplace' && gameState.levelCompleted);
  const canProceed = $derived(gameState.phase === 'marketplace' && 
    !isLastLevel(gameState.currentLevel) && 
    canAffordLevel(gameState.playerStats.moonrocks, getNextLevel(gameState.currentLevel)));
  const nextLevelCost = $derived(getLevelEntryCost(getNextLevel(gameState.currentLevel)));
  
  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
  
  const canPullOrb = $derived(gameState.phase === 'level' && totalAvailableOrbs > 0);
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">ACTIONS</h2>
  
  <div class="flex-1 flex flex-col space-y-3">
    <!-- Current Phase Indicator -->
    <div class="text-center text-xs text-gray-400 uppercase tracking-wide">
      Current Phase: <span class="text-white font-medium">{gameState.phase}</span>
    </div>
    
    <!-- 2x3 Button Grid -->
    <div class="grid grid-cols-2 gap-2 flex-1">
      <!-- Row 1: Start Game & Pull Orb -->
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame || gameState.phase !== 'menu'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canStartGame && gameState.phase === 'menu'
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        START GAME
      </button>
      
      <button 
        onclick={handlePullOrb}
        disabled={!canPullOrb || gameState.phase !== 'level'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canPullOrb && gameState.phase === 'level'
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        PULL ORB
      </button>
      
      <!-- Row 2: Cash Out Actions -->
      <button 
        onclick={handleCashOutMidLevel}
        disabled={!canCashOutMid || gameState.phase !== 'level'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canCashOutMid && gameState.phase === 'level'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        QUIT LEVEL
      </button>
      
      <button 
        onclick={handleCashOutPostLevel}
        disabled={!canCashOutPost || gameState.phase !== 'marketplace'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canCashOutPost && gameState.phase === 'marketplace'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        COLLECT
      </button>
      
      <!-- Row 3: Navigation Actions -->
      <button 
        onclick={handleProceedToNext}
        disabled={!canProceed || gameState.phase !== 'marketplace'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canProceed && gameState.phase === 'marketplace'
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        NEXT LEVEL
      </button>
      
      <button 
        onclick={handleReturnToMenu}
        disabled={gameState.phase !== 'gameover' && gameState.phase !== 'victory'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {gameState.phase === 'gameover' || gameState.phase === 'victory'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        MAIN MENU
      </button>
    </div>
    
    <!-- Status Messages -->
    <div class="text-xs text-center space-y-1">
      {#if gameState.phase === 'menu' && !canStartGame}
        <p class="text-red-400">NEED {getLevelEntryCost(1)} MOONROCKS TO START</p>
      {/if}
      
      {#if gameState.phase === 'level' && totalAvailableOrbs === 0}
        <p class="text-red-400">NO ORBS AVAILABLE</p>
      {/if}
      
      {#if gameState.phase === 'marketplace' && !canProceed && !isLastLevel(gameState.currentLevel)}
        <p class="text-red-400">NEED {nextLevelCost} MOONROCKS FOR NEXT LEVEL</p>
      {/if}
      
      {#if gameState.phase === 'gameover'}
        <div class="text-center">
          <p class="text-red-400 font-bold">GAME OVER!</p>
          <p class="text-gray-400">BETTER LUCK NEXT TIME</p>
        </div>
      {/if}
      
      {#if gameState.phase === 'victory'}
        <div class="text-center">
          <p class="text-white font-bold">VICTORY!</p>
          <p class="text-gray-400">YOU COMPLETED ALL LEVELS!</p>
        </div>
      {/if}
    </div>
  </div>
</div>