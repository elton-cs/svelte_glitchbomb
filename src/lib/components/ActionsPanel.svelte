<script lang="ts">
  import { 
    startNewGame, 
    cashOutMidLevel, 
    cashOutPostLevel, 
    continueToMarketplace,
    proceedToNextLevel, 
    returnToMenu,
    restartGame,
    pullOrb,
    skipLevel 
  } from '../game/game.js';
  import { canAffordLevel, getLevelEntryCost, calculateCashOut } from '../game/economics.js';
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
      if (confirm(`Cash out ${gameState.playerStats.points} points for glitchbytes? You'll lose progress and glitchbytes spent on this level.`)) {
        cashOutMidLevel(gameState);
      }
    } else if (gameState.phase === 'marketplace') {
      if (confirm(`Cash out ${gameState.playerStats.points} points for glitchbytes and end the run?`)) {
        cashOutPostLevel(gameState);
      }
    } else if (gameState.phase === 'confirmation') {
      if (confirm(`Cash out ${gameState.playerStats.points} points for glitchbytes and end the run?`)) {
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

  function handleRestart() {
    restartGame(gameState);
  }

  function handlePullOrb() {
    pullOrb(gameState);
  }

  function handleSkipLevel() {
    skipLevel(gameState);
  }

  const canStartGame = $derived(gameState.phase === 'menu' && canAffordLevel(gameState.playerStats.glitchbytes, 1));
  const canCashOut = $derived((gameState.phase === 'level' && gameState.gameStarted) || 
    (gameState.phase === 'marketplace' && gameState.levelCompleted && !gameState.committedToNextLevel) ||
    gameState.phase === 'confirmation');
  const canContinue = $derived(gameState.phase === 'confirmation');
  const canProceed = $derived(gameState.phase === 'marketplace' && 
    !isLastLevel(gameState.currentLevel) && 
    canAffordLevel(gameState.playerStats.glitchbytes, getNextLevel(gameState.currentLevel)));
  const nextLevelCost = $derived(getLevelEntryCost(getNextLevel(gameState.currentLevel)));
  
  const totalAvailableOrbs = $derived(gameState.orbBag.health.available.length + 
                                      gameState.orbBag.point.available.length + 
                                      gameState.orbBag.bomb.available.length + 
                                      gameState.orbBag.points_per_anyorb.available.length + 
                                      gameState.orbBag.points_per_bombpulled.available.length + 
                                      gameState.orbBag.multiplier.available.length);
  
  const canPullOrb = $derived(gameState.phase === 'level' && totalAvailableOrbs > 0);
  
  const midLevelCashOut = $derived(gameState.phase === 'level' ? 
    gameState.playerStats.points : 0);
  
  const canRestart = $derived(gameState.phase === 'gameover' && canAffordLevel(gameState.playerStats.glitchbytes, 1));
  const canSkipLevel = $derived(gameState.phase === 'level');
</script>

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col">
  <h2 class="text-sm font-bold mb-3 text-white">ACTIONS</h2>
  
  <!-- 2x4 Button Grid (Added Debug Row) -->
  <div class="grid grid-cols-2 gap-2 flex-1">
      <!-- Row 1: Start Game & Pull Orb -->
      <button 
        onclick={handleStartGame}
        disabled={!canStartGame || gameState.phase !== 'menu'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canStartGame && gameState.phase === 'menu'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        START GAME
      </button>
      
      <button 
        onclick={handlePullOrb}
        disabled={!canPullOrb || gameState.phase !== 'level'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
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
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canCashOut
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">CASH OUT</div>
          {#if gameState.phase === 'confirmation'}
            <div class="text-sm opacity-75">
              (+{gameState.playerStats.points} GB)
            </div>
          {:else if gameState.phase === 'level'}
            <div class="text-sm opacity-75">
              (+{midLevelCashOut} GB)
            </div>
          {/if}
        </div>
      </button>
      
      <button 
        onclick={canContinue ? handleContinue : handleProceedToNext}
        disabled={!canContinue && (!canProceed || gameState.phase !== 'marketplace')}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {(canContinue || (canProceed && gameState.phase === 'marketplace'))
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">
            {canContinue ? 'CONTINUE' : 'NEXT LEVEL'}
          </div>
          {#if canContinue}
            <div class="text-sm opacity-75">
              (+{gameState.playerStats.points} B)
            </div>
          {:else}
            <div class="text-sm opacity-75">
              (-{getLevelEntryCost(getNextLevel(gameState.currentLevel))} GB)
            </div>
          {/if}
        </div>
      </button>
      
      <!-- Row 3: Restart & Main Menu -->
      <button 
        onclick={handleRestart}
        disabled={!canRestart || gameState.phase !== 'gameover'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canRestart && gameState.phase === 'gameover'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">RESTART</div>
          {#if canRestart && gameState.phase === 'gameover'}
            <div class="text-sm opacity-75">(-{getLevelEntryCost(1)} GB)</div>
          {/if}
        </div>
      </button>
      
      <button 
        onclick={handleReturnToMenu}
        disabled={gameState.phase !== 'gameover' && gameState.phase !== 'victory'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {gameState.phase === 'gameover' || gameState.phase === 'victory'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-sm sm:text-base lg:text-lg font-medium">MAIN MENU</div>
      </button>
      
      <!-- Row 4: Debug Skip Level -->
      <button 
        onclick={handleSkipLevel}
        disabled={!canSkipLevel}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canSkipLevel
                 ? 'bg-orange-800 text-white border-orange-400 hover:bg-orange-400 hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">DEBUG</div>
          <div class="text-xs opacity-75">SKIP LVL</div>
        </div>
      </button>
      
      <!-- Empty slot for symmetry -->
      <div></div>
    </div>
  
  <!-- Footer -->
  <div class="mt-3 text-sm text-center h-5">
    <p class="text-white uppercase tracking-wide">
      PHASE: <span class="font-medium">{gameState.phase}</span>
    </p>
  </div>
  
  <div class="mt-1 text-sm text-center h-5">
    {#if gameState.phase === 'menu' && !canStartGame}
      <p class="text-red-400">NEED {getLevelEntryCost(1)} GLITCH BYTES TO START</p>
    {:else if gameState.phase === 'level' && totalAvailableOrbs === 0}
      <p class="text-red-400">NO ORBS AVAILABLE</p>
    {:else if gameState.phase === 'marketplace' && gameState.committedToNextLevel}
      <p class="text-white font-bold">COMMITTED TO NEXT LEVEL</p>
    {:else if gameState.phase === 'marketplace' && !canProceed && !isLastLevel(gameState.currentLevel)}
      <p class="text-red-400">NEED {nextLevelCost} GLITCH BYTES FOR NEXT LEVEL</p>
    {:else if gameState.phase === 'confirmation'}
      <p class="text-white font-bold">GLITCH BYTES OR BITS?</p>
    {:else if gameState.phase === 'gameover' && !canRestart}
      <p class="text-red-400">NEED {getLevelEntryCost(1)} GLITCH BYTES TO RESTART</p>
    {:else if gameState.phase === 'gameover'}
      <p class="text-red-400 font-bold">GAME OVER!</p>
    {:else if gameState.phase === 'victory'}
      <p class="text-white font-bold">VICTORY!</p>
    {:else}
      <p>&nbsp;</p>
    {/if}
  </div>
</div>
