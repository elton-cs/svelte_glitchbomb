<script lang="ts">
  import { audioManager } from "../../utils/audio.js";

  interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    points: number;
    phase: "level" | "marketplace" | "confirmation";
  }

  let { onConfirm, onCancel, points, phase }: Props = $props();

  function handleConfirm() {
    audioManager.playSoundEffect("click", 0.3);
    onConfirm();
  }

  function handleCancel() {
    audioManager.playSoundEffect("click", 0.3);
    onCancel();
  }

  const warningMessage = $derived(
    phase === "level"
      ? "You'll lose progress and moonrocks."
      : "This will end your run."
  );
</script>

<div class="p-2 rounded-lg border-2 border-yellow-500 h-full flex flex-col">
  <!-- Header -->
  <div class="text-center mb-3">
    <div class="text-yellow-500 font-bold tracking-wider">
      💰 CASH OUT CONFIRMATION 💰
    </div>
    <div class="text-yellow-400 text-xs font-mono tracking-wider">
      CONVERT POINTS TO MOONROCKS
    </div>
  </div>

  <!-- Content -->
  <div
    class="flex-1 flex flex-col justify-center items-center gap-4 max-w-md mx-auto w-full"
  >
    <!-- Confirmation message -->
    <div class="bg-yellow-900/20 border border-yellow-500 rounded p-3 w-full">
      <div class="text-yellow-100 font-mono space-y-2">
        <div>
          <span class="text-yellow-400 font-bold">CONFIRM:</span> Cash out
          <span class="text-yellow-300 font-bold">{points} points</span> for
          <span class="text-yellow-300 font-bold">{points} moonrocks</span>?
        </div>
        <div class="text-yellow-300 text-sm">
          {warningMessage}
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2 w-full">
      <button
        onclick={handleCancel}
        class="flex-1 hover:bg-white hover:text-black border-2 border-white text-white font-bold py-3 px-4 rounded transition-all text-center"
      >
        <div>CANCEL</div>
        <div class="text-xs opacity-75">CONTINUE PLAYING</div>
      </button>

      <button
        onclick={handleConfirm}
        class="flex-1 bg-yellow-900 hover:bg-yellow-700 border-2 border-yellow-500 text-yellow-100 font-bold py-3 px-4 rounded transition-all text-center"
      >
        <div>CONFIRM CACHE OUT</div>
        <div class="text-xs opacity-75">(+{points} 👾)</div>
      </button>
    </div>

    <!-- Footer -->
    <div
      class="text-center text-yellow-500 text-xs font-mono opacity-60 tracking-widest"
    >
      [POINTS_CONVERSION_PROTOCOL]
    </div>
  </div>
</div>
