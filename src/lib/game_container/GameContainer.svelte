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

  // import ActionsPanel from "../components/ActionsPanel.svelte";
  // import OrbBagSection from "../components/OrbBagSection.svelte";
  // import MarketplaceView from "../components/MarketplaceView.svelte";
  // import GameLogSection from "../components/GameLogSection.svelte";
  // import MatrixDisarrayWarning from "../components/MatrixDisarrayWarning.svelte";

  let gameState = $state(createInitialGameState());

  // Active tab state for middle panel
  let activeTab = $state<"profit" | "probability" | "log" | "shop">("profit");

  // Matrix disarray warning state
  let showMatrixWarning = $state(false);

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

    // Continue to marketplace normally
    continueToMarketplace(gameState);
  }

  function handleCacheOutFromWarning() {
    showMatrixWarning = false;
    cashOutPostLevel(gameState);
  }

  // Initialize background music when component mounts
  $effect(() => {
    audioManager.initializeBackgroundMusic("/sounds/thepilot.mp3").then(() => {
      audioManager.playBackgroundMusic();
    });

    // Preload sound effects
    audioManager.preloadSoundEffect("click", "/sounds/click.wav");
    audioManager.preloadSoundEffect("buy", "/sounds/buy.wav");
    audioManager.preloadSoundEffect("pointsbar", "/sounds/pointsbar.wav");
    audioManager.preloadSoundEffect("bomb1", "/sounds/bomb1.wav");
    audioManager.preloadSoundEffect("endgame", "/sounds/endgame.wav");
    audioManager.preloadSoundEffect("levelup", "/sounds/levelup.wav");
    audioManager.preloadSoundEffect("nextlevel", "/sounds/nextlevel.wav");
    audioManager.preloadSoundEffect("multiplier", "/sounds/multiplier.wav");
    audioManager.preloadSoundEffect("specialpull", "/sounds/specialpull.wav");

    // Add global click listener to enable audio on first user interaction
    function handleFirstInteraction() {
      audioManager.enableAudioOnUserInteraction();
      audioManager.playBackgroundMusic();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    }

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      audioManager.cleanup();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  });
</script>

<div
  class="flex flex-col p-2 gap-2 h-full w-full justify-between min-h-0 overflow-hidden"
>
  <GlitchHeader {gameState} />
  <PlayerStatsSection {gameState} />
  <div class="flex-1 min-h-0 flex flex-col">
    {#if activeTab === "profit"}
      <ProfitLossPanel {gameState} />
    {:else if activeTab === "probability"}
      <OrbBagSection {gameState} />
    {:else if activeTab === "log"}
      <GameLogSection {gameState} />
    {:else if activeTab === "shop"}
      <MarketplaceView {gameState} />
    {/if}
  </div>
  <ActionButtons {gameState} bind:activeTab />
  <TabViewSelector bind:activeTab />
</div>
