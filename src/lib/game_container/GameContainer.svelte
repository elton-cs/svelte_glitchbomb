<script lang="ts">
  import {
    createInitialGameState,
    addStructuredLogEntry,
  } from "../game/state.js";
  import {
    continueToMarketplace,
    cashOutPostLevel,
    cashOutMidLevel,
  } from "../game/game.js";
  import { addOrbsToBag } from "../game/orbs.js";
  import { audioManager } from "../utils/audio.js";
  import { setupConvex, useConvexClient } from "convex-svelte";
  import { api } from "../../convex/_generated/api";
  import Controller from "@cartridge/controller";
  import confetti from "canvas-confetti";
  import GlitchHeader from "./comps/GlitchHeader.svelte";
  import PlayerStatsSection from "./comps/PlayerStatsSection.svelte";
  import ActionButtons from "./comps/ActionButtons.svelte";
  import ProfitLossPanel from "./comps/ProfitLossPanel.svelte";
  import OrbBagSection from "./comps/OrbBagSection.svelte";
  import GameLogSection from "./comps/GameLogSection.svelte";
  import MarketplaceView from "./comps/MarketplaceView.svelte";
  import TabViewSelector from "./comps/TabViewSelector.svelte";
  import MatrixDisarrayWarning from "./comps/MatrixDisarrayWarning.svelte";
  import CashOutConfirmation from "./comps/CashOutConfirmation.svelte";
  import ConnectControllerPrompt from "./comps/ConnectControllerPrompt.svelte";

  // Setup Convex client
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
  if (!CONVEX_URL) {
    throw new Error("VITE_CONVEX_URL environment variable is not set");
  }
  setupConvex(CONVEX_URL);
  const client = useConvexClient();

  // Setup Controller instance to be shared across components
  const controller = new Controller({});
  let controllerAccount = $state<any>(null);

  let gameState = $state(createInitialGameState());

  // Track previous phase to detect victory state transition
  let previousPhase = $state(gameState.phase);

  function skipToVictory() {
    gameState.phase = "victory";
  }

  // Active tab state for middle panel
  let activeTab = $state<"profit" | "probability" | "log" | "shop">("profit");

  // Matrix disarray warning state
  let showMatrixWarning = $state(false);

  // Cash out confirmation state
  let showCashOutConfirmation = $state(false);
  let cashOutPhase = $state<"level" | "marketplace" | "confirmation">("level");

  // Screen shake state for bomb pulls
  let isShaking = $state(false);
  // Red flash overlay state for bomb pulls
  let showRedFlash = $state(false);

  function handleAcceptDisarray() {
    showMatrixWarning = false;
    gameState.matrixDisarrayActive = true;

    // Add the 2-damage bomb orb to the glitch rift
    addOrbsToBag(gameState.orbBag, "bomb", 1, 2);

    // Log the matrix disarray activation
    addStructuredLogEntry(gameState, {
      type: "system",
      data: {
        message:
          "Matrix disarray accepted - 2-damage bomb added to glitch rift",
        level: "warning",
      },
    });

    // Continue to marketplace and switch to shop tab
    continueToMarketplace(gameState);
    activeTab = "shop";
  }

  function handleCacheOutFromWarning() {
    showMatrixWarning = false;
    cashOutPostLevel(gameState);
  }

  function handleCashOutRequest(
    phase: "level" | "marketplace" | "confirmation"
  ) {
    cashOutPhase = phase;
    showCashOutConfirmation = true;
  }

  // Sync game state to Convex whenever it changes
  $effect(() => {
    // Watch the entire gameState object for changes
    const stateSnapshot = gameState;
    
    // Only sync if controller account is connected
    if (!controllerAccount) {
      return;
    }
    
    // Sync immediately on every state change
    (async () => {
      try {
        const walletAddress = controllerAccount.address;
        await client.mutation(api.games.updateGame, {
          walletAddress,
          gameState: stateSnapshot,
        });
        console.log("Game state synced to Convex");
      } catch (error) {
        console.error("Failed to sync game state:", error);
      }
    })();
  });

  function handleCashOutConfirm() {
    showCashOutConfirmation = false;
    if (cashOutPhase === "level") {
      cashOutMidLevel(gameState);
    } else {
      cashOutPostLevel(gameState);
    }
  }

  function handleCashOutCancel() {
    showCashOutConfirmation = false;
  }

  function handleEnterShopClick() {
    // Only show the matrix disarray warning once after level 3 completion
    // Check if we just completed level 3 and haven't shown the warning yet
    if (gameState.currentLevel === 3 && !gameState.matrixDisarrayActive) {
      showMatrixWarning = true;
    } else {
      // Otherwise, proceed directly to shop
      continueToMarketplace(gameState);
      activeTab = "shop";
    }
  }

  // Watch for bomb pulls and trigger screen shake
  let previousLogLength = $state(0);
  $effect(() => {
    const logEntries = gameState.gameLog;
    const currentLength = logEntries.length;

    // Only check if a new entry was added
    if (currentLength > previousLogLength && currentLength > 0) {
      const lastEntry = logEntries[currentLength - 1];
      if (
        lastEntry.type === "orb_pulled" &&
        lastEntry.data.orbType === "bomb"
      ) {
        // Trigger screen shake
        isShaking = true;
        setTimeout(() => {
          isShaking = false;
        }, 500); // Shake duration matches animation

        // Trigger red flash overlay
        showRedFlash = true;
        setTimeout(() => {
          showRedFlash = false;
        }, 300); // Flash duration
      }
      previousLogLength = currentLength;
    } else if (currentLength < previousLogLength) {
      // Log was cleared, reset tracking
      previousLogLength = currentLength;
    }
  });

  // Watch for victory state and trigger confetti animation
  $effect(() => {
    const currentPhase = gameState.phase;

    // Only trigger confetti when transitioning TO victory state
    if (currentPhase === "victory" && previousPhase !== "victory") {
      // Play victory sound effect
      audioManager.playSoundEffect("victory1", 0.7);

      // Trigger confetti burst
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#8B5CF6", "#A855F7", "#C084FC", "#9333EA", "#7C3AED"]; // Purple/violet theme

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Also trigger a center burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        });
      }, 250);
    }

    previousPhase = currentPhase;
  });

  // Initialize audio system when component mounts
  $effect(() => {
    // Initialize background music (using AAC for better compression)
    audioManager.initializeBackgroundMusic("/sounds/thepilot.aac").then(() => {
      audioManager.playBackgroundMusic();
    });

    // Preload all sound effects with Web Audio API
    // UI sounds
    audioManager.preloadSoundEffect("click", "/sounds/click.wav", 0.3);
    audioManager.preloadSoundEffect("click2", "/sounds/click2.wav", 0.3);
    audioManager.preloadSoundEffect("click3", "/sounds/click3.wav", 0.3);

    // Game action sounds
    audioManager.preloadSoundEffect("buy", "/sounds/buy.wav", 0.4);
    audioManager.preloadSoundEffect("pointsbar", "/sounds/pointsbar.wav", 0.3);

    // Bomb sounds
    audioManager.preloadSoundEffect("bomb1", "/sounds/bomb1.wav", 0.5);
    audioManager.preloadSoundEffect("bomb2", "/sounds/bomb2.wav", 0.5);
    audioManager.preloadSoundEffect("alarmloop", "/sounds/alarmloop.wav", 0.4);

    // Special event sounds
    audioManager.preloadSoundEffect("endgame", "/sounds/endgame.wav", 0.6);
    audioManager.preloadSoundEffect("victory1", "/sounds/victory1.mp3", 0.7);
    audioManager.preloadSoundEffect("levelup", "/sounds/levelup.wav", 0.7);
    audioManager.preloadSoundEffect("nextlevel", "/sounds/nextlevel.wav", 0.5);
    audioManager.preloadSoundEffect(
      "multiplier",
      "/sounds/multiplier.wav",
      0.6
    );
    audioManager.preloadSoundEffect(
      "specialpull",
      "/sounds/specialpull.wav",
      0.4
    );

    // Graph/stats sounds
    audioManager.preloadSoundEffect("graphup1", "/sounds/graphup1.wav", 0.4);
    audioManager.preloadSoundEffect("graphup2", "/sounds/graphup2.wav", 0.4);

    // Add global listeners to enable audio on first user interaction
    // This is required by browser autoplay policies
    function handleFirstInteraction() {
      audioManager.enableAudioOnUserInteraction();
      audioManager.playBackgroundMusic();

      // Remove listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);

      console.log("Audio enabled - Web Audio API ready");
    }

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    // Cleanup function
    return () => {
      audioManager.cleanup();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  });
</script>

<div
  class="flex flex-col p-1 gap-1 h-full w-full justify-between overflow-hidden"
  class:shake={isShaking}
>
  <GlitchHeader
    {gameState}
    {controller}
    {skipToVictory}
    bind:controllerAccount
  />
  <PlayerStatsSection {gameState} />
  <div class="flex-1 min-h-0 flex flex-col">
    {#if showMatrixWarning}
      <MatrixDisarrayWarning
        onAccept={handleAcceptDisarray}
        onCacheOut={handleCacheOutFromWarning}
        playerPoints={gameState.playerStats.points}
      />
    {:else if showCashOutConfirmation}
      <CashOutConfirmation
        onConfirm={handleCashOutConfirm}
        onCancel={handleCashOutCancel}
        points={gameState.playerStats.points}
        phase={cashOutPhase}
      />
    {:else if activeTab === "profit"}
      <ProfitLossPanel {gameState} />
    {:else if activeTab === "probability"}
      <OrbBagSection {gameState} />
    {:else if activeTab === "log"}
      <GameLogSection {gameState} />
    {:else if activeTab === "shop"}
      <MarketplaceView {gameState} />
    {/if}
  </div>
  <TabViewSelector bind:activeTab />
  {#if controllerAccount}
    <ActionButtons
      {gameState}
      {controller}
      {controllerAccount}
      bind:activeTab
      onEnterShop={handleEnterShopClick}
      onCashOutRequest={handleCashOutRequest}
      showingConfirmation={showCashOutConfirmation || showMatrixWarning}
    />
  {:else}
    <ConnectControllerPrompt />
  {/if}

  {#if showRedFlash}
    <div class="red-flash-overlay"></div>
  {/if}
</div>
