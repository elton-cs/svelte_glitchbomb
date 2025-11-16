<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { saveGlitchbytes } from "../../game/state";
  import type { GameState } from "../../game/types";

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
</div>
