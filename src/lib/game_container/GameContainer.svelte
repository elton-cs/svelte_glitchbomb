<script lang="ts">
  import {
    createInitialGameState,
    addStructuredLogEntry,
  } from "../game/state.js";
  import { continueToMarketplace, cashOutPostLevel } from "../game/game.js";
  import { addOrbsToBag } from "../game/orbs.js";
  import { audioManager } from "../utils/audio.js";
  import GlitchHeader from "./comps/GlitchHeader.svelte";
  import PlayerStatsSection from "./comps/PlayerStatsSection.svelte";
  import ActionButtons from "./comps/ActionButtons.svelte";
  import ProfitLossPanel from "./comps/ProfitLossPanel.svelte";
  import OrbBagSection from "./comps/OrbBagSection.svelte";
  import GameLogSection from "./comps/GameLogSection.svelte";
  import MarketplaceView from "./comps/MarketplaceView.svelte";
  import TabViewSelector from "./comps/TabViewSelector.svelte";
  import MatrixDisarrayWarning from "./comps/MatrixDisarrayWarning.svelte";

  let gameState = $state(createInitialGameState());

  // Active tab state for middle panel
  let activeTab = $state<"profit" | "probability" | "log" | "shop">("profit");

  // Matrix disarray warning state
  let showMatrixWarning = $state(false);

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
  <GlitchHeader {gameState} />
  <PlayerStatsSection {gameState} />
  <div class="flex-1 min-h-0 flex flex-col">
    {#if showMatrixWarning}
      <MatrixDisarrayWarning
        onAccept={handleAcceptDisarray}
        onCacheOut={handleCacheOutFromWarning}
        playerPoints={gameState.playerStats.points}
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
  <ActionButtons
    {gameState}
    bind:activeTab
    onEnterShop={handleEnterShopClick}
  />

  {#if showRedFlash}
    <div class="red-flash-overlay"></div>
  {/if}
</div>
