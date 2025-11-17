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
  import ChipIcon from "./ChipIcon.svelte";
  import { useConvexClient } from "convex-svelte";
  import { api } from "../../../convex/_generated/api";

  const client = useConvexClient();

  interface Props {
    gameState: GameState;
    activeTab: "profit" | "probability" | "log" | "shop";
    controller: any; // Controller type from @cartridge/controller
    controllerAccount?: any;
    onEnterShop?: () => void;
    onCashOutRequest?: (
      phase: "level" | "marketplace" | "confirmation"
    ) => void;
    showingConfirmation?: boolean;
  }

  let {
    gameState,
    activeTab = $bindable(),
    controller,
    controllerAccount,
    onEnterShop,
    onCashOutRequest,
    showingConfirmation = false,
  }: Props = $props();

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

  // Update moonrocks in Convex if controller is connected
  async function updateMoonrocksInConvex() {
    if (!controllerAccount) {
      console.log("No controller account connected, skipping moonrocks update");
      return;
    }

    try {
      const walletAddress = controllerAccount.address;
      await client.mutation(api.players.updateMoonrocks, {
        walletAddress,
        moonrocks: gameState.playerStats.glitchbytes,
      });
      console.log("Moonrocks updated in Convex:", gameState.playerStats.glitchbytes);
    } catch (error) {
      console.error("Failed to update moonrocks:", error);
    }
  }

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

  async function handleStartGame() {
    withCooldown(async () => {
      audioManager.playSoundEffect("nextlevel", 0.5);
      startNewGame(gameState);
      
      // Create new game and update moonrocks in Convex if controller is connected
      if (controllerAccount) {
        try {
          const walletAddress = controllerAccount.address;
          
          // Create new game entry
          await client.mutation(api.games.newGame, {
            walletAddress,
          });
          console.log("New game created in Convex");
        } catch (error) {
          console.error("Failed to create game:", error);
        }
      }
      
      // Update moonrocks
      await updateMoonrocksInConvex();
    }, "startGame");
  }

  async function handleExecute() {
    withCooldown(async () => {
      audioManager.playSoundEffect("click", 0.3);
      pullOrb(gameState);
      
      // Update moonrocks
      await updateMoonrocksInConvex();
    }, "pullOrb");
  }

  function handleCashOut() {
    audioManager.playSoundEffect("click", 0.3);
    onCashOutRequest?.(
      gameState.phase as "level" | "marketplace" | "confirmation"
    );
    // Note: moonrocks update happens after confirmation in GameContainer
  }

  async function handleEnterShop() {
    withCooldown(async () => {
      audioManager.playSoundEffect("click", 0.3);
      if (onEnterShop) {
        onEnterShop();
      } else {
        // Fallback to direct behavior if callback not provided
        continueToMarketplace(gameState);
        activeTab = "shop";
      }
      
      // Update moonrocks
      await updateMoonrocksInConvex();
    }, "enterShop");
  }

  async function handleNextLevel() {
    withCooldown(async () => {
      audioManager.playSoundEffect("nextlevel", 0.5);
      proceedToNextLevel(gameState);
      // Switch to profit tab when proceeding to next level
      activeTab = "profit";
      
      // Update moonrocks
      await updateMoonrocksInConvex();
    }, "nextLevel");
  }

  // Use displayPhase for button visibility, fallback to actual phase
  const currentPhase = $derived(displayPhase ?? gameState.phase);

  const canStartGame = $derived(
    (currentPhase === "menu" || currentPhase === "gameover") &&
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

<div class="flex gap-4 p-2 rounded-lg items-stretch">
  {#if currentPhase === "victory" && canStartGame}
    <SingleActionButton
      label="CONGRATS YOU WIN! PLAY AGAIN?"
      onClick={handleStartGame}
      isEnabled={!buttonsCooldown && !showingConfirmation}
      isGlowing={glowingButtonId === "startGame"}
      subtitle={`(-${getLevelEntryCost(1)} 👾)`}
    />
  {:else if canStartGame && (currentPhase === "menu" || currentPhase === "gameover")}
    <SingleActionButton
      label="START GAME"
      onClick={handleStartGame}
      isEnabled={!buttonsCooldown && !showingConfirmation}
      isGlowing={glowingButtonId === "startGame"}
      subtitle={currentPhase === "gameover" && canStartGame
        ? `(-${getLevelEntryCost(1)} 👾)`
        : undefined}
    />
  {/if}

  {#if canCashOut}
    <SingleActionButton
      label="CACHE OUT"
      onClick={handleCashOut}
      isEnabled={!showingConfirmation}
      isGlowing={false}
      subtitle={canCashOut
        ? `(+${gameState.playerStats.points} 👾)`
        : undefined}
    />
  {/if}

  {#if canPullOrb && currentPhase === "level"}
    <SingleActionButton
      label="PULL ORB"
      onClick={handleExecute}
      isEnabled={!buttonsCooldown && !showingConfirmation}
      isGlowing={glowingButtonId === "pullOrb"}
    />
  {/if}

  {#if canEnterShop}
    <SingleActionButton
      label="ENTER SHOP"
      onClick={handleEnterShop}
      isEnabled={!buttonsCooldown && !showingConfirmation}
      isGlowing={glowingButtonId === "enterShop"}
    >
      {#snippet subtitle()}
        <div
          class="text-md opacity-75 mt-0.5 flex items-center justify-center gap-1"
        >
          <span>(+{gameState.playerStats.points}</span>
          <ChipIcon size="lg" class="inline text-yellow-400" />
          <span>)</span>
        </div>
      {/snippet}
    </SingleActionButton>
  {/if}

  {#if canProceed && currentPhase === "marketplace"}
    <SingleActionButton
      label="NEXT LEVEL"
      onClick={handleNextLevel}
      isEnabled={!buttonsCooldown && !showingConfirmation}
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
</style>
