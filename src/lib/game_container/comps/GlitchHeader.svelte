<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { saveGlitchbytes, resetGameSession } from "../../game/state";
  import type { GameState } from "../../game/types";
  import Controller from "@cartridge/controller";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  // Track previous value to detect increase/decrease
  let previousGlitchBytes = $state(gameState.playerStats.glitchbytes);
  let animationColor = $state<"neutral" | "increase" | "decrease">("neutral");

  // Animated glitch bytes counter
  const animatedGlitchBytes = tweened(gameState.playerStats.glitchbytes, {
    duration: 800,
    easing: cubicOut,
  });

  let controller = new Controller({});
  let connectedUsername = $state<string | undefined>(undefined);

  async function connect() {
    try {
      const account = await controller.connect();
      if (account) {
        connectedUsername = await controller.username();
        console.log("Connected to Controller:", connectedUsername);
      }
    } catch (error) {
      console.error("Failed to connect to Controller:", error);
    }
  }

  function openSettings() {
    controller.openSettings();
  }

  // Auto-connect on mount if already connected
  $effect(() => {
    (async () => {
      if (await controller.probe()) {
        await connect();
      }
    })();
  });

  function resetGlitchbytes() {
    if (
      confirm(
        "Reset moonrocks to 1000 and restart the game? This will clear all progress."
      )
    ) {
      saveGlitchbytes(1000);
      resetGameSession(gameState, 1000);
    }
  }

  // Save glitchbytes whenever they change
  $effect(() => {
    saveGlitchbytes(gameState.playerStats.glitchbytes);
  });

  // Update animated glitch bytes when value changes
  $effect(() => {
    const currentValue = gameState.playerStats.glitchbytes;

    // Skip comparison on initial load (when both values are the same initially)
    if (previousGlitchBytes !== currentValue) {
      // Determine color based on change direction
      if (currentValue > previousGlitchBytes) {
        animationColor = "increase";
      } else if (currentValue < previousGlitchBytes) {
        animationColor = "decrease";
      }

      // Reset color after animation completes
      setTimeout(() => {
        animationColor = "neutral";
      }, 800); // Match animation duration
    }

    // Update previous value and start animation
    previousGlitchBytes = currentValue;
    animatedGlitchBytes.set(currentValue);
  });
</script>

<div class="p-1 rounded-lg border border-white">
  <div class="grid grid-cols-3 items-center gap-1">
    <div class="flex justify-start">
      <button
        onclick={connectedUsername ? openSettings : connect}
        class="p-3 text-sm font-medium text-blue-400 border border-blue-400 hover:bg-blue-400 hover:text-black rounded transition-colors flex items-center justify-center min-w-[90px] h-[48px]"
      >
        {connectedUsername || "CONNECT"}
      </button>
    </div>
    <div class="text-center">
      <div
        class="text-2xl font-bold m-0.5 flex items-center justify-center gap-1 {animationColor ===
        'increase'
          ? 'text-green-400'
          : animationColor === 'decrease'
            ? 'text-red-400'
            : 'text-white'}"
      >
        {Math.round($animatedGlitchBytes)}<span class="text-2xl">👾</span>
      </div>
      <div class="text-white text-[10px]">MOONROCKS</div>
    </div>
    <div class="flex justify-end">
      <button
        onclick={resetGlitchbytes}
        class="p-3 text-sm font-medium text-red-400 border border-red-400 hover:bg-red-400 hover:text-black rounded transition-colors flex items-center justify-center w-[90px] h-[48px]"
      >
        RESET
      </button>
    </div>
  </div>
</div>
