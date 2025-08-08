<script lang="ts">
  import { gameState } from '../game/state.js';
  import { 
    startNewGame, 
    cashOutMidLevel, 
    cashOutPostLevel, 
    proceedToNextLevel, 
    returnToMenu 
  } from '../game/game.js';
  import { canAffordGame, canAffordLevel, getLevelEntryCost } from '../game/economics.js';
  import { GAME_CONFIG } from '../game/constants.js';
  import { isLastLevel, getNextLevel } from '../game/levels.js';

  function handleStartGame() {
    startNewGame();
  }

  function handleCashOutMidLevel() {
    const amount = cashOutMidLevel();
    alert(`Cashed out ${amount} moonrocks!`);
  }

  function handleCashOutPostLevel() {
    const amount = cashOutPostLevel();
    alert(`Cashed out ${amount} moonrocks!`);
  }

  function handleProceedToNext() {
    proceedToNextLevel();
  }

  function handleReturnToMenu() {
    returnToMenu();
  }

  $: canStartGame = gameState.phase === 'menu' && canAffordGame(gameState.playerStats.moonrocks);
  $: canCashOutMid = gameState.phase === 'level' && gameState.gameStarted;
  $: canCashOutPost = gameState.phase === 'marketplace' && gameState.levelCompleted;
  $: canProceed = gameState.phase === 'marketplace' && 
    !isLastLevel(gameState.currentLevel) && 
    canAffordLevel(gameState.playerStats.moonrocks, getNextLevel(gameState.currentLevel));
  $: nextLevelCost = getLevelEntryCost(getNextLevel(gameState.currentLevel));
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
        Start Game (-{GAME_CONFIG.gameEntryCost} moonrocks)
      </button>
      
      {#if !canStartGame}
        <p class="text-sm text-red-500 text-center">
          Need {GAME_CONFIG.gameEntryCost} moonrocks to start
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