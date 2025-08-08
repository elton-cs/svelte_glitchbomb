<script lang="ts">
  import { 
    startNewGame, 
    cashOutMidLevel, 
    cashOutPostLevel, 
    proceedToNextLevel, 
    returnToMenu 
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

  const canStartGame = $derived(gameState.phase === 'menu' && canAffordLevel(gameState.playerStats.moonrocks, 1));
  const canCashOutMid = $derived(gameState.phase === 'level' && gameState.gameStarted);
  const canCashOutPost = $derived(gameState.phase === 'marketplace' && gameState.levelCompleted);
  const canProceed = $derived(gameState.phase === 'marketplace' && 
    !isLastLevel(gameState.currentLevel) && 
    canAffordLevel(gameState.playerStats.moonrocks, getNextLevel(gameState.currentLevel)));
  const nextLevelCost = $derived(getLevelEntryCost(getNextLevel(gameState.currentLevel)));
</script>

<div class="bg-gray-100 p-4 rounded border">
  <h2 class="text-lg font-bold mb-3">Actions</h2>
  
  <div class="space-y-2">
    {#if gameState.phase === 'menu'}
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame}
        class="w-full py-2 px-4 rounded font-medium transition-colors
               {canStartGame 
                 ? 'bg-green-600 text-white hover:bg-green-700' 
                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
      >
        Start Game (-{getLevelEntryCost(1)} moonrocks)
      </button>
      
      {#if !canStartGame}
        <p class="text-sm text-red-500 text-center">
          Need {getLevelEntryCost(1)} moonrocks to start
        </p>
      {/if}
    {/if}
    
    {#if gameState.phase === 'level'}
      <button 
        onclick={handleCashOutMidLevel}
        disabled={!canCashOutMid}
        class="w-full py-2 px-4 rounded font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
      >
        Cash Out ({gameState.playerStats.points} points → moonrocks)
      </button>
    {/if}
    
    {#if gameState.phase === 'marketplace'}
      <button 
        onclick={handleCashOutPostLevel}
        disabled={!canCashOutPost}
        class="w-full py-2 px-4 rounded font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
      >
        Cash Out ({gameState.playerStats.points} points → moonrocks)
      </button>
      
      {#if !isLastLevel(gameState.currentLevel)}
        <button 
          onclick={handleProceedToNext}
          disabled={!canProceed}
          class="w-full py-2 px-4 rounded font-medium transition-colors
                 {canProceed 
                   ? 'bg-blue-600 text-white hover:bg-blue-700' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
        >
          Continue to Level {getNextLevel(gameState.currentLevel)} (-{nextLevelCost} moonrocks)
        </button>
        
        {#if !canProceed}
          <p class="text-sm text-red-500 text-center">
            Need {nextLevelCost} moonrocks for next level
          </p>
        {/if}
      {/if}
    {/if}
    
    {#if gameState.phase === 'gameover'}
      <div class="text-center mb-3">
        <h3 class="text-xl font-bold text-red-600">Game Over!</h3>
        <p class="text-gray-600">Better luck next time</p>
      </div>
      
      <button 
        onclick={handleReturnToMenu}
        class="w-full py-2 px-4 rounded font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
      >
        Return to Menu
      </button>
    {/if}
    
    {#if gameState.phase === 'victory'}
      <div class="text-center mb-3">
        <h3 class="text-xl font-bold text-green-600">Victory!</h3>
        <p class="text-gray-600">You completed all levels!</p>
      </div>
      
      <button 
        onclick={handleReturnToMenu}
        class="w-full py-2 px-4 rounded font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
      >
        Return to Menu
      </button>
    {/if}
  </div>
</div>