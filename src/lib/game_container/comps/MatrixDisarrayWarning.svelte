<script lang="ts">
  import { audioManager } from "../../utils/audio.js";

  interface Props {
    onAccept: () => void;
    onCacheOut: () => void;
    playerPoints: number;
  }

  let { onAccept, onCacheOut, playerPoints }: Props = $props();

  // Alarm sound for the warning
  let alarmAudio: HTMLAudioElement;

  function handleAccept() {
    audioManager.playSoundEffect("click", 0.3);
    onAccept();
  }

  function handleCacheOut() {
    audioManager.playSoundEffect("click", 0.3);
    onCacheOut();
  }

  // Start alarm when component mounts, stop when unmounts
  $effect(() => {
    // Create and start alarm audio
    alarmAudio = new Audio("/sounds/alarmloop.wav");
    alarmAudio.loop = true;
    alarmAudio.volume = 0.2;

    // Start playing the alarm
    alarmAudio.play().catch((error) => {
      console.warn("Failed to play alarm sound:", error);
    });

    // Cleanup function - stops alarm when component unmounts
    return () => {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }
    };
  });
</script>

<!-- Backdrop overlay -->
<div class="absolute inset-0 flex items-center justify-center z-50 p-4">
  <!-- Warning modal -->
  <div
    class="bg-black border-2 border-red-500 rounded-lg p-5 w-[28rem] shadow-lg shadow-red-500/50"
  >
    <!-- Header -->
    <div class="text-center mb-3">
      <div class="text-red-500 text-xl font-bold mb-1 tracking-wider">
        ⚠️ MATRIX DISARRAY ⚠️
      </div>
      <div class="text-red-400 text-sm font-mono tracking-wider">
        SYSTEM OVERLOAD DETECTED
      </div>
    </div>

    <!-- Warning message -->
    <div
      class="bg-red-900 bg-opacity-20 border border-red-500 rounded p-3 mb-4"
    >
      <div class="text-red-100 text-sm leading-relaxed font-mono">
        <div class="mb-2">
          <span class="text-red-400 font-bold">WARNING:</span> Proceeding beyond
          Level 3 will destabilize the quantum matrix.
        </div>

        <div class="mb-2 text-red-300">
          Consequence: An additional <span class="text-red-500 font-bold"
            >2-DAMAGE BOMB ORB</span
          > will be injected into your glitch rift.
        </div>

        <div class="text-red-400 text-sm">
          This bomb will persist through Levels 4 through 7. Continue at your
          own risk.
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <button
        onclick={handleCacheOut}
        class="flex-1 bg-black hover:bg-white hover:text-black border-2 border-white text-white text-sm font-bold py-3 px-4 rounded transition-all"
      >
        <div class="text-center">
          <div>CACHE OUT</div>
          <div class="text-xs opacity-75">(+{playerPoints} 👾)</div>
        </div>
      </button>

      <button
        onclick={handleAccept}
        class="flex-1 bg-red-900 hover:bg-red-700 border-2 border-red-500 text-red-100 text-sm font-bold py-3 px-4 rounded transition-all shadow-lg shadow-red-500/30"
      >
        <div class="text-center">
          <div>ACCEPT DISARRAY</div>
          <div class="text-xs opacity-75">CONTINUE PLAY</div>
        </div>
      </button>
    </div>

    <!-- Footer glitch text -->
    <div
      class="mt-3 text-center text-red-500 text-sm font-mono opacity-60 tracking-widest"
    >
      [LEVEL_3_MATRIX_BREACH_PROTOCOL]
    </div>
  </div>
</div>
