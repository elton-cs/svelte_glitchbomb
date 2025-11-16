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
  }

  let { gameState, activeTab = $bindable() }: Props = $props();

  function handleStartGame() {
    audioManager.playSoundEffect("nextlevel", 0.5);
    startNewGame(gameState);
  }

  function handleExecute() {
    audioManager.playSoundEffect("click", 0.3);
    pullOrb(gameState);
  }

  function handleCashOut() {
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
  }

  function handleEnterShop() {
    audioManager.playSoundEffect("click", 0.3);
    continueToMarketplace(gameState);
    // Switch to shop tab when entering shop
    activeTab = "shop";
  }

  function handleNextLevel() {
    audioManager.playSoundEffect("nextlevel", 0.5);
    proceedToNextLevel(gameState);
    // Switch to profit tab when proceeding to next level
    activeTab = "profit";
  }

  const canStartGame = $derived(
    (gameState.phase === "menu" || gameState.phase === "gameover") &&
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
    gameState.phase === "level" && totalAvailableOrbs > 0
  );

  const canCashOut = $derived(
    (gameState.phase === "level" && gameState.gameStarted) ||
      (gameState.phase === "marketplace" &&
        gameState.levelCompleted &&
        !gameState.committedToNextLevel) ||
      gameState.phase === "confirmation"
  );

  const canEnterShop = $derived(gameState.phase === "confirmation");

  const canProceed = $derived(
    gameState.phase === "marketplace" &&
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

<div class="flex gap-2 p-2 border rounded-lg">
  <SingleActionButton
    label="START GAME"
    onClick={handleStartGame}
    isEnabled={canStartGame && (gameState.phase === "menu" || gameState.phase === "gameover")}
    subtitle={
      gameState.phase === "gameover" && canStartGame
        ? `(-${getLevelEntryCost(1)} 👾)`
        : undefined
    }
  />

  <SingleActionButton
    label="PULL ORB"
    onClick={handleExecute}
    isEnabled={canPullOrb && gameState.phase === "level"}
  />

  <SingleActionButton
    label="CASH OUT"
    onClick={handleCashOut}
    isEnabled={canCashOut}
  />

  <SingleActionButton
    label="ENTER SHOP"
    onClick={handleEnterShop}
    isEnabled={canEnterShop}
    subtitle={canEnterShop ? `(+${gameState.playerStats.points} 👾)` : undefined}
  />

  <SingleActionButton
    label="NEXT LEVEL"
    onClick={handleNextLevel}
    isEnabled={canProceed && gameState.phase === "marketplace"}
    subtitle={
      canProceed && gameState.phase === "marketplace"
        ? `(-${nextLevelCost} 👾)`
        : undefined
    }
  />
</div>
