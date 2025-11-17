<script lang="ts">
  import {
    startNewGame,
    pullOrb,
    cashOutMidLevel,
    cashOutPostLevel,
    continueToMarketplace,
    proceedToNextLevel,
  } from "../../game/game.js";
  import { canAffordLevel, getLevelEntryCost } from "../../game/economics.js";
  import { isLastLevel, getNextLevel } from "../../game/levels.js";
  import type { GameState } from "../../game/types.js";
  import { audioManager } from "../../utils/audio.js";
  import SingleActionButton from "./SingleActionButton.svelte";

  interface Props {
    gameState: GameState;
    activeTab: "profit" | "probability" | "log" | "shop";
    onEnterShop?: () => void;
  }

  let { gameState, activeTab = $bindable(), onEnterShop }: Props = $props();

  let buttonsCooldown = $state(false);
  let cooldownTimeout: ReturnType<typeof setTimeout> | null = null;
  let glowingButtonId = $state<string | null>(null);
  let displayPhase = $state<GameState["phase"] | null>(null);

  // Track phase for display purposes - update immediately when not in cooldown
  $effect(() => {
    if (!buttonsCooldown) {
      displayPhase = gameState.phase;
    }
  });

  function withCooldown(action: () => void, buttonId: string) {
    if (buttonsCooldown) return;

    // Capture current phase before action changes it
    displayPhase = gameState.phase;
    buttonsCooldown = true;
    glowingButtonId = buttonId;
    action();

    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout);
    }

    cooldownTimeout = setTimeout(() => {
      buttonsCooldown = false;
      glowingButtonId = null;
      // Update display phase to match actual phase after cooldown
      displayPhase = gameState.phase;
      cooldownTimeout = null;
    }, 300);
  }

  function handleStartGame() {
    withCooldown(() => {
      audioManager.playSoundEffect("nextlevel", 0.5);
      startNewGame(gameState);
    }, "startGame");
  }

  function handleExecute() {
    withCooldown(() => {
      audioManager.playSoundEffect("click", 0.3);
      pullOrb(gameState);
    }, "pullOrb");
  }

  function handleCashOut() {
    withCooldown(() => {
      audioManager.playSoundEffect("click", 0.3);
      if (gameState.phase === "level") {
        if (
          confirm(
            `Cache out ${gameState.playerStats.points} points for glitchbytes? You'll lose progress and glitchbytes spent on this level.`
          )
        ) {
          cashOutMidLevel(gameState);
        }
      } else if (gameState.phase === "marketplace") {
        if (
          confirm(
            `Cache out ${gameState.playerStats.points} points for glitchbytes and end the run?`
          )
        ) {
          cashOutPostLevel(gameState);
        }
      } else if (gameState.phase === "confirmation") {
        if (
          confirm(
            `Cache out ${gameState.playerStats.points} points for glitchbytes and end the run?`
          )
        ) {
          cashOutPostLevel(gameState);
        }
      }
    }, "cashOut");
  }

  function handleEnterShop() {
    withCooldown(() => {
      audioManager.playSoundEffect("click", 0.3);
      if (onEnterShop) {
        onEnterShop();
      } else {
        // Fallback to direct behavior if callback not provided
        continueToMarketplace(gameState);
        activeTab = "shop";
      }
    }, "enterShop");
  }

  function handleNextLevel() {
    withCooldown(() => {
      audioManager.playSoundEffect("nextlevel", 0.5);
      proceedToNextLevel(gameState);
      // Switch to profit tab when proceeding to next level
      activeTab = "profit";
    }, "nextLevel");
  }

  // Use displayPhase for button visibility, fallback to actual phase
  const currentPhase = $derived(displayPhase ?? gameState.phase);

  const canStartGame = $derived(
    (currentPhase === "menu" ||
      currentPhase === "gameover" ||
      currentPhase === "victory") &&
      canAffordLevel(gameState.playerStats.glitchbytes, 1)
  );

  const totalAvailableOrbs = $derived(
    gameState.orbBag.health.available.length +
      gameState.orbBag.point.available.length +
      gameState.orbBag.bomb.available.length +
      gameState.orbBag.points_per_anyorb.available.length +
      gameState.orbBag.points_per_bombpulled.available.length +
      gameState.orbBag.multiplier.available.length
  );

  const canPullOrb = $derived(
    currentPhase === "level" && totalAvailableOrbs > 0
  );

  const canCashOut = $derived(
    (currentPhase === "level" && gameState.gameStarted) ||
      (currentPhase === "marketplace" &&
        gameState.levelCompleted &&
        !gameState.committedToNextLevel) ||
      currentPhase === "confirmation"
  );

  const canEnterShop = $derived(currentPhase === "confirmation");

  const canProceed = $derived(
    currentPhase === "marketplace" &&
      !isLastLevel(gameState.currentLevel) &&
      canAffordLevel(
        gameState.playerStats.glitchbytes,
        getNextLevel(gameState.currentLevel)
      )
  );

  const nextLevelCost = $derived(
    getLevelEntryCost(getNextLevel(gameState.currentLevel))
  );
</script>

<div class="flex gap-4 p-2 rounded-lg items-stretch action-button-container">
  {#if currentPhase === "victory" && canStartGame}
    <!-- Victory button - full width with bigger text -->
    <button
      onclick={() => handleStartGame()}
      disabled={buttonsCooldown}
      class="button-3d w-full min-h-[128px] p-6 rounded text-md font-bold transition-all border-2
             {!buttonsCooldown
        ? 'bg-black text-white border-white hover:bg-white hover:text-black active:bg-gray-300 active:text-black'
        : 'text-gray-500 border-gray-500 cursor-not-allowed opacity-60'}
             {glowingButtonId === 'startGame' ? 'shadow-glow' : ''}"
    >
      <div class="text-center flex flex-col justify-center h-full">
        <div class="font-bold text-md flex flex-col">
          <div>CONGRATS YOU WIN!</div>
          <div>PLAY AGAIN?</div>
        </div>
        <div class="text-sm opacity-75 mt-2">(-{getLevelEntryCost(1)} 👾)</div>
      </div>
    </button>
  {:else if canStartGame && (currentPhase === "menu" || currentPhase === "gameover")}
    <SingleActionButton
      label="START GAME"
      onClick={handleStartGame}
      isEnabled={!buttonsCooldown}
      isGlowing={glowingButtonId === "startGame"}
      subtitle={currentPhase === "gameover" && canStartGame
        ? `(-${getLevelEntryCost(1)} 👾)`
        : undefined}
    />
  {/if}

  {#if canCashOut}
    <SingleActionButton
      label="CASH OUT"
      onClick={handleCashOut}
      isEnabled={!buttonsCooldown}
      isGlowing={glowingButtonId === "cashOut"}
    />
  {/if}

  {#if canPullOrb && currentPhase === "level"}
    <SingleActionButton
      label="PULL ORB"
      onClick={handleExecute}
      isEnabled={!buttonsCooldown}
      isGlowing={glowingButtonId === "pullOrb"}
    />
  {/if}

  {#if canEnterShop}
    <SingleActionButton
      label="ENTER SHOP"
      onClick={handleEnterShop}
      isEnabled={!buttonsCooldown}
      isGlowing={glowingButtonId === "enterShop"}
      subtitle={canEnterShop
        ? `(+${gameState.playerStats.points} 👾)`
        : undefined}
    />
  {/if}

  {#if canProceed && currentPhase === "marketplace"}
    <SingleActionButton
      label="NEXT LEVEL"
      onClick={handleNextLevel}
      isEnabled={!buttonsCooldown}
      isGlowing={glowingButtonId === "nextLevel"}
      subtitle={canProceed && currentPhase === "marketplace"
        ? `(-${nextLevelCost} 👾)`
        : undefined}
    />
  {/if}
</div>

<style>
  :global(.action-button-container button) {
    min-height: 128px !important;
  }

  .button-3d {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.2) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 6px 0 0 rgba(80, 80, 80, 0.9),
      0 8px 16px -2px rgba(0, 0, 0, 0.7);
    transform: translateY(0);
    transition: all 0.15s ease;
  }

  .button-3d:not(:disabled):hover {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.3) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 8px 0 0 rgba(80, 80, 80, 1),
      0 10px 20px -2px rgba(0, 0, 0, 0.8);
    transform: translateY(-3px);
  }

  .button-3d:not(:disabled):active {
    box-shadow:
      0 2px 4px 0 rgba(0, 0, 0, 0.5) inset,
      0 1px 0 0 rgba(60, 60, 60, 0.6);
    transform: translateY(4px);
  }

  .button-3d:disabled {
    box-shadow:
      0 2px 0 0 rgba(100, 100, 100, 0.1),
      0 3px 6px -2px rgba(0, 0, 0, 0.2);
  }

  .shadow-glow {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.3) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 6px 0 0 rgba(80, 80, 80, 0.9),
      0 8px 24px 0 rgba(74, 222, 128, 0.6),
      0 0 40px rgba(74, 222, 128, 0.4);
  }
</style>
