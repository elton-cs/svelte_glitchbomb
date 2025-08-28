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
  import ChipIcon from './ChipIcon.svelte';
  import { audioManager } from '../utils/audio.js';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handleStartGame() {
    startNewGame(gameState);
  }

  function handleCashOut() {
    if (gameState.phase === 'level') {
      if (confirm(`Cache out ${gameState.playerStats.points} points for glitchbytes? You'll lose progress and glitchbytes spent on this level.`)) {
        cashOutMidLevel(gameState);
      }
    } else if (gameState.phase === 'marketplace') {
      if (confirm(`Cache out ${gameState.playerStats.points} points for glitchbytes and end the run?`)) {
        cashOutPostLevel(gameState);
      }
    } else if (gameState.phase === 'confirmation') {
      if (confirm(`Cache out ${gameState.playerStats.points} points for glitchbytes and end the run?`)) {
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
  
  // Helper function to play click sound with any action
  function playClickAndExecute(action: () => void) {
    audioManager.playSoundEffect('click', 0.3);
    action();
  }
  
  // Helper function to play nextlevel sound for game progression actions
  function playNextLevelAndExecute(action: () => void) {
    audioManager.playSoundEffect('nextlevel', 0.5);
    action();
  }
  
  // Helper function to play appropriate sound for continue/next level button
  function playContinueOrNextLevel() {
    if (canContinue) {
      // Continue button - play regular click sound
      audioManager.playSoundEffect('click', 0.3);
      handleContinue();
    } else {
      // Next Level button - play special nextlevel sound
      audioManager.playSoundEffect('nextlevel', 0.5);
      handleProceedToNext();
    }
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

<div class="bg-black p-3 rounded-lg shadow-sm border border-white h-full flex flex-col overflow-hidden">
  <h2 class="text-sm font-bold mb-3 text-white">ACTIONS</h2>
  
  <!-- 2x3 Button Grid -->
  <div class="grid grid-cols-2 gap-2 flex-1 min-h-0">
      <!-- Row 1: Start Game & Execute -->
      <button 
        onclick={() => playNextLevelAndExecute(handleStartGame)}
        disabled={!canStartGame || gameState.phase !== 'menu'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canStartGame && gameState.phase === 'menu'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        START GAME
      </button>
      
      <button 
        onclick={() => playClickAndExecute(handlePullOrb)}
        disabled={!canPullOrb || gameState.phase !== 'level'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canPullOrb && gameState.phase === 'level'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black' 
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        EXECUTE
      </button>
      
      <!-- Row 2: Cash Out & Continue/Next Level -->
      <button 
        onclick={() => playClickAndExecute(handleCashOut)}
        disabled={!canCashOut}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canCashOut
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">CACHE OUT</div>
          {#if gameState.phase === 'confirmation'}
            <div class="text-sm opacity-75">
              (+{gameState.playerStats.points} 👾)
            </div>
          {:else if gameState.phase === 'level'}
            <div class="text-sm opacity-75">
              (+{midLevelCashOut} 👾)
            </div>
          {/if}
        </div>
      </button>
      
      <button 
        onclick={playContinueOrNextLevel}
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
            <div class="text-sm opacity-75 flex items-center justify-center gap-1">
              (+{gameState.playerStats.points} <ChipIcon size="sm" class="opacity-75" />)
            </div>
          {:else}
            <div class="text-sm opacity-75">
              (-{getLevelEntryCost(getNextLevel(gameState.currentLevel))} 👾)
            </div>
          {/if}
        </div>
      </button>
      
      <!-- Row 3: Restart & Main Menu -->
      <button 
        onclick={() => playNextLevelAndExecute(handleRestart)}
        disabled={!canRestart || gameState.phase !== 'gameover'}
        class="py-3 px-2 sm:px-4 rounded text-sm sm:text-base lg:text-lg font-medium transition-colors border
               {canRestart && gameState.phase === 'gameover'
                 ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                 : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
      >
        <div class="text-center">
          <div class="font-medium text-sm sm:text-base lg:text-lg">RESTART</div>
          {#if canRestart && gameState.phase === 'gameover'}
            <div class="text-sm opacity-75">(-{getLevelEntryCost(1)} 👾)</div>
          {/if}
        </div>
      </button>
      
      <button 
        onclick={() => playClickAndExecute(handleReturnToMenu)}
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
        onclick={() => playClickAndExecute(handleSkipLevel)}
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
  
  <div class="mt-2 text-xs text-center px-2 pb-1">
    {#if gameState.phase === 'menu' && !canStartGame}
      <p class="text-red-400 mb-1">NEED {getLevelEntryCost(1)} GLITCH BYTES TO START</p>
      <p class="text-red-400">CLICK DEV BUTTON TO CLAIM</p>
    {:else if gameState.phase === 'level' && totalAvailableOrbs === 0}
      <p class="text-red-400">NO COMMANDS AVAILABLE</p>
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
