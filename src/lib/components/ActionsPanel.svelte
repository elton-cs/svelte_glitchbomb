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
  
  <div class="space-y-2">
    {#if gameState.phase === 'menu'}
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canStartGame 
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        START GAME (-{getLevelEntryCost(1)} MOONROCKS)
      </button>
      
      {#if !canStartGame}
        <p class="text-sm text-red-400 text-center">
          NEED {getLevelEntryCost(1)} MOONROCKS TO START
        </p>
      {/if}
    {/if}
    
    {#if gameState.phase === 'level'}
      <button 
        onclick={handlePullOrb}
        disabled={!canPullOrb}
        class="w-full py-2 px-4 rounded font-medium transition-colors border
               {canPullOrb 
                 ? 'bg-white text-black hover:bg-gray-200 border-white' 
                 : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
      >
        {canPullOrb ? 'PULL ORB' : 'CANNOT PULL ORB'}
      </button>
      
      <button 
        onclick={handleCashOutMidLevel}
        disabled={!canCashOutMid}
        class="w-full py-2 px-4 rounded font-medium bg-white text-black hover:bg-gray-200 transition-colors border border-white"
      >
        CASH OUT ({gameState.playerStats.points} POINTS → MOONROCKS)
      </button>
    {/if}
    
    {#if gameState.phase === 'marketplace'}
      <button 
        onclick={handleCashOutPostLevel}
        disabled={!canCashOutPost}
        class="w-full py-2 px-4 rounded font-medium bg-white text-black hover:bg-gray-200 transition-colors border border-white"
      >
        CASH OUT ({gameState.playerStats.points} POINTS → MOONROCKS)
      </button>
      
      {#if !isLastLevel(gameState.currentLevel)}
        <button 
          onclick={handleProceedToNext}
          disabled={!canProceed}
          class="w-full py-2 px-4 rounded font-medium transition-colors border
                 {canProceed 
                   ? 'bg-white text-black hover:bg-gray-200 border-white' 
                   : 'bg-transparent text-gray-600 border-gray-600 cursor-not-allowed'}"
        >
          CONTINUE TO LEVEL {getNextLevel(gameState.currentLevel)} (-{nextLevelCost} MOONROCKS)
        </button>
        
        {#if !canProceed}
          <p class="text-sm text-red-400 text-center">
            NEED {nextLevelCost} MOONROCKS FOR NEXT LEVEL
          </p>
        {/if}
      {/if}
    {/if}
    
    {#if gameState.phase === 'gameover'}
      <div class="text-center mb-3">
        <h3 class="text-xl font-bold text-red-400">GAME OVER!</h3>
        <p class="text-gray-400">BETTER LUCK NEXT TIME</p>
      </div>
      
      <button 
        onclick={handleReturnToMenu}
        class="w-full py-2 px-4 rounded font-medium bg-white text-black hover:bg-gray-200 transition-colors border border-white"
      >
        RETURN TO MENU
      </button>
    {/if}
    
    {#if gameState.phase === 'victory'}
      <div class="text-center mb-3">
        <h3 class="text-xl font-bold text-white">VICTORY!</h3>
        <p class="text-gray-400">YOU COMPLETED ALL LEVELS!</p>
      </div>
      
      <button 
        onclick={handleReturnToMenu}
        class="w-full py-2 px-4 rounded font-medium bg-white text-black hover:bg-gray-200 transition-colors border border-white"
      >
        RETURN TO MENU
      </button>
    {/if}
  </div>
</div>