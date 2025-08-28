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
      
      <!-- Status Bar spanning both columns -->
      <div class="col-span-2 bg-black border border-white rounded p-2 flex items-center justify-between">
        <!-- Left side: Phase and status -->
        <div class="flex items-center gap-2">
          <div class="text-white text-xs font-medium uppercase tracking-wide">
            PHASE: {gameState.phase}
          </div>
          <div class="text-xs">
            {#if gameState.phase === 'menu' && !canStartGame}
              <span class="text-white">NEED {getLevelEntryCost(1)} 👾 TO START</span>
            {:else if gameState.phase === 'level' && totalAvailableOrbs === 0}
              <span class="text-white">NO COMMANDS AVAILABLE</span>
            {:else if gameState.phase === 'marketplace' && gameState.committedToNextLevel}
              <span class="text-white">COMMITTED TO NEXT LEVEL</span>
            {:else if gameState.phase === 'marketplace' && !canProceed && !isLastLevel(gameState.currentLevel)}
              <span class="text-white">NEED {nextLevelCost} 👾 FOR NEXT LEVEL</span>
            {:else if gameState.phase === 'confirmation'}
              <span class="text-white">GLITCH BYTES OR CHIPS?</span>
            {:else if gameState.phase === 'gameover' && !canRestart}
              <span class="text-white">NEED {getLevelEntryCost(1)} 👾 TO RESTART</span>
            {:else if gameState.phase === 'gameover'}
              <span class="text-white">GAME OVER!</span>
            {:else if gameState.phase === 'victory'}
              <span class="text-white">VICTORY!</span>
            {:else}
              <span class="text-white">READY</span>
            {/if}
          </div>
        </div>
        
        <!-- Right side: Debug button -->
        <button 
          onclick={() => playClickAndExecute(handleSkipLevel)}
          disabled={!canSkipLevel}
          class="px-2 py-1 rounded text-xs font-medium transition-colors border
                 {canSkipLevel
                   ? 'bg-black text-white border-white hover:bg-white hover:text-black'
                   : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
        >
          DEBUG SKIP
        </button>
      </div>
    </div>
</div>
