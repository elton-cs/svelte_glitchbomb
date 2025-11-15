<script lang="ts">
  import {
    startNewGame,
    pullOrb,
    cashOutMidLevel,
    cashOutPostLevel,
  } from "../../game/game.js";
  import { canAffordLevel, getLevelEntryCost } from "../../game/economics.js";
  import type { GameState } from "../../game/types.js";
  import { audioManager } from "../../utils/audio.js";
  import SingleActionButton from "./SingleActionButton.svelte";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

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

  const canStartGame = $derived(
    gameState.phase === "menu" &&
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
</script>

<div class="flex gap-2 p-2 border rounded-lg">
  <SingleActionButton
    label="START GAME"
    onClick={handleStartGame}
    isEnabled={canStartGame && gameState.phase === "menu"}
  />

  <SingleActionButton
    label="EXECUTE"
    onClick={handleExecute}
    isEnabled={canPullOrb && gameState.phase === "level"}
  />

  <SingleActionButton
    label="CASH OUT"
    onClick={handleCashOut}
    isEnabled={canCashOut}
  />
</div>
