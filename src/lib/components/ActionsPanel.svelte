<script lang="ts">
  import { 
    startNewGame, 
    cashOutMidLevel, 
    cashOutPostLevel, 
    continueToMarketplace,
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

  function handleCashOut() {
    if (gameState.phase === 'level') {
      if (confirm(`Cash out ${gameState.playerStats.points} points for moonrocks? You'll lose progress and moonrocks spent on this level.`)) {
        cashOutMidLevel(gameState);
      }
    } else if (gameState.phase === 'marketplace') {
      if (confirm(`Cash out ${gameState.playerStats.points} points for moonrocks and end the run?`)) {
        cashOutPostLevel(gameState);
      }
    } else if (gameState.phase === 'confirmation') {
      if (confirm(`Cash out ${gameState.playerStats.points} points for moonrocks and end the run?`)) {
        cashOutPostLevel(gameState);
      }
    }
  }

  function handleContinue() {
    continueToMarketplace(gameState);
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
  const canCashOut = $derived((gameState.phase === 'level' && gameState.gameStarted) || 
    (gameState.phase === 'marketplace' && gameState.levelCompleted && !gameState.committedToNextLevel) ||
    gameState.phase === 'confirmation');
  const canContinue = $derived(gameState.phase === 'confirmation');
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
  
  <!-- 2x3 Button Grid -->
  <div class="grid grid-cols-2 gap-2 flex-1">
      <!-- Row 1: Start Game & Pull Orb -->
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame || gameState.phase !== 'menu'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canStartGame && gameState.phase === 'menu'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        START GAME
      </button>
      
      <button 
        onclick={handlePullOrb}
        disabled={!canPullOrb || gameState.phase !== 'level'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canPullOrb && gameState.phase === 'level'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        PULL ORB
      </button>
      
      <!-- Row 2: Cash Out & Continue/Next Level -->
      <button 
        onclick={handleCashOut}
        disabled={!canCashOut}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {canCashOut
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        CASH OUT
      </button>
      
      <button 
        onclick={canContinue ? handleContinue : handleProceedToNext}
        disabled={!canContinue && (!canProceed || gameState.phase !== 'marketplace')}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border
               {(canContinue || (canProceed && gameState.phase === 'marketplace'))
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        {canContinue ? 'CONTINUE' : 'NEXT LEVEL'}
      </button>
      
      <!-- Row 3: Main Menu (spans both columns) -->
      <button 
        onclick={handleReturnToMenu}
        disabled={gameState.phase !== 'gameover' && gameState.phase !== 'victory'}
        class="py-2 px-3 rounded text-sm font-medium transition-colors border col-span-2
               {gameState.phase === 'gameover' || gameState.phase === 'victory'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        MAIN MENU
      </button>
    </div>
  
  <!-- Footer -->
  <div class="mt-3 text-xs text-center h-4">
    <p class="text-white uppercase tracking-wide">
      PHASE: <span class="font-medium">{gameState.phase}</span>
    </p>
  </div>
  
  <div class="mt-1 text-xs text-center h-4">
    {#if gameState.phase === 'menu' && !canStartGame}
      <p class="text-red-400">NEED {getLevelEntryCost(1)} MOONROCKS TO START</p>
    {:else if gameState.phase === 'level' && totalAvailableOrbs === 0}
      <p class="text-red-400">NO ORBS AVAILABLE</p>
    {:else if gameState.phase === 'marketplace' && gameState.committedToNextLevel}
      <p class="text-white font-bold">COMMITTED TO NEXT LEVEL</p>
    {:else if gameState.phase === 'marketplace' && !canProceed && !isLastLevel(gameState.currentLevel)}
      <p class="text-red-400">NEED {nextLevelCost} MOONROCKS FOR NEXT LEVEL</p>
    {:else if gameState.phase === 'confirmation'}
      <p class="text-white font-bold">CHOOSE YOUR PATH</p>
    {:else if gameState.phase === 'gameover'}
      <p class="text-red-400 font-bold">GAME OVER!</p>
    {:else if gameState.phase === 'victory'}
      <p class="text-white font-bold">VICTORY!</p>
    {:else}
      <p>&nbsp;</p>
    {/if}
  </div>
</div>