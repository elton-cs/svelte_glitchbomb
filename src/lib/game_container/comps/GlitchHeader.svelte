<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { saveGlitchbytes, resetGameSession } from "../../game/state";
  import type { GameState } from "../../game/types";

  interface Props {
    gameState: GameState;
    skipToVictory: () => void;
  }

  let { gameState, skipToVictory }: Props = $props();

  // Track previous value to detect increase/decrease
  let previousGlitchBytes = $state(gameState.playerStats.glitchbytes);
  let animationColor = $state<"neutral" | "increase" | "decrease">("neutral");

  // Animated glitch bytes counter
  const animatedGlitchBytes = tweened(gameState.playerStats.glitchbytes, {
    duration: 800,
    easing: cubicOut,
  });

  // Easter egg: click moonrocks 5 times to skip to victory
  let clickCount = $state(0);
  let clickTimeout: ReturnType<typeof setTimeout> | null = null;

  function handleMoonrocksClick() {
    clickCount++;

    // Clear existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    // Reset click count after 2 seconds of inactivity
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 2000);

    // Trigger victory on 5 clicks
    if (clickCount >= 5) {
      console.log("🎉 Easter egg activated! Skipping to victory...");
      skipToVictory();
      clickCount = 0;
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    }
  }

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

  const canReset = $derived(gameState.playerStats.glitchbytes < 900);
</script>

<div class="p-1 rounded-lg border border-white">
  <div class="grid grid-cols-3 items-center gap-1">
    <div class="flex justify-start">
      <button
        disabled
        onclick={() => skipToVictory()}
        class="p-3 text-sm font-medium text-black border border-black rounded aspect-square flex items-center justify-center min-h-[48px] opacity-50 cursor-not-allowed"
        title="Skip to victory (for testing)"
      >
        SKIP
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
        {Math.round($animatedGlitchBytes)}<span class="text-2xl">
          <button
            onclick={handleMoonrocksClick}
            class="text-center cursor-pointer"
          >
            👾
          </button>
        </span>
      </div>
      <div class="text-white text-[10px]">MOONROCKS</div>
    </div>
    <div class="flex justify-end">
      <button
        disabled={!canReset}
        onclick={resetGlitchbytes}
        class="p-3 text-sm font-medium rounded transition-colors aspect-square flex items-center justify-center min-h-[48px] {canReset
          ? 'text-red-400 border border-red-400 hover:bg-red-400 hover:text-black'
          : 'text-black border border-black opacity-50 cursor-not-allowed'}"
      >
        RESET
      </button>
    </div>
  </div>
</div>
