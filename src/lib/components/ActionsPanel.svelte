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

<div class="bg-black p-4 rounded border border-white">
  <h2 class="text-sm font-bold mb-3 text-white">ACTIONS</h2>
  
  <div class="space-y-3">
    <!-- Current Phase Indicator -->
    <div class="text-center text-xs text-gray-400 uppercase tracking-wide">
      Current Phase: <span class="text-white font-medium">{gameState.phase}</span>
    </div>
    
    <!-- Menu Actions -->
    <div class="space-y-1 {gameState.phase === 'menu' ? '' : 'opacity-50'}">
      <div class="text-xs text-gray-400 mb-1">MENU ACTIONS</div>
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame || gameState.phase !== 'menu'}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canStartGame && gameState.phase === 'menu'
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        START GAME (-{getLevelEntryCost(1)} MOONROCKS)
      </button>
      
      {#if gameState.phase === 'menu' && !canStartGame}
        <p class="text-sm text-red-400 text-center">
          NEED {getLevelEntryCost(1)} MOONROCKS TO START
        </p>
      {/if}
    </div>
    
    <!-- Level Actions -->
    <div class="space-y-1 {gameState.phase === 'level' ? '' : 'opacity-50'}">
      <div class="text-xs text-gray-400 mb-1">LEVEL ACTIONS</div>
      <button 
        onclick={handlePullOrb}
        disabled={!canPullOrb || gameState.phase !== 'level'}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canPullOrb && gameState.phase === 'level'
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        PULL ORB {gameState.phase === 'level' && totalAvailableOrbs === 0 ? '(NO ORBS)' : ''}
      </button>
      
      <button 
        onclick={handleCashOutMidLevel}
        disabled={!canCashOutMid || gameState.phase !== 'level'}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canCashOutMid && gameState.phase === 'level'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        CASH OUT MID-LEVEL ({gameState.playerStats.points} PTS)
      </button>
    </div>
    
    <!-- Marketplace Actions -->
    <div class="space-y-1 {gameState.phase === 'marketplace' ? '' : 'opacity-50'}">
      <div class="text-xs text-gray-400 mb-1">MARKETPLACE ACTIONS</div>
      <button 
        onclick={handleCashOutPostLevel}
        disabled={!canCashOutPost || gameState.phase !== 'marketplace'}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canCashOutPost && gameState.phase === 'marketplace'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        CASH OUT POST-LEVEL ({gameState.playerStats.points} PTS)
      </button>
      
      {#if !isLastLevel(gameState.currentLevel)}
        <button 
          onclick={handleProceedToNext}
          disabled={!canProceed || gameState.phase !== 'marketplace'}
          class="w-full py-2 px-4 rounded font-medium transition-colors border
                 {canProceed && gameState.phase === 'marketplace'
                   ? 'bg-white text-black hover:bg-gray-200 border-white' 
                   : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
        >
          CONTINUE TO LEVEL {getNextLevel(gameState.currentLevel)} (-{nextLevelCost} MOONROCKS)
        </button>
        
        {#if gameState.phase === 'marketplace' && !canProceed}
          <p class="text-sm text-red-400 text-center">
            NEED {nextLevelCost} MOONROCKS FOR NEXT LEVEL
          </p>
        {/if}
      {/if}
    </div>
    
    <!-- End Game Actions -->
    <div class="space-y-1 {gameState.phase === 'gameover' || gameState.phase === 'victory' ? '' : 'opacity-50'}">
      <div class="text-xs text-gray-400 mb-1">END GAME ACTIONS</div>
      
      {#if gameState.phase === 'gameover'}
        <div class="text-center mb-3">
          <h3 class="text-xl font-bold text-red-400">GAME OVER!</h3>
          <p class="text-gray-400">BETTER LUCK NEXT TIME</p>
        </div>
      {/if}
      
      {#if gameState.phase === 'victory'}
        <div class="text-center mb-3">
          <h3 class="text-xl font-bold text-white">VICTORY!</h3>
          <p class="text-gray-400">YOU COMPLETED ALL LEVELS!</p>
        </div>
      {/if}
      
      <button 
        onclick={handleReturnToMenu}
        disabled={gameState.phase !== 'gameover' && gameState.phase !== 'victory'}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {gameState.phase === 'gameover' || gameState.phase === 'victory'
                 ? 'bg-white text-black hover:bg-gray-200 border-white'
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        RETURN TO MENU
      </button>
    </div>
  </div>
</div>