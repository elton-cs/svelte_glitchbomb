<script lang="ts">
  import { getLevelMilestone } from "../../game/levels";
  import type { GameState } from "../../game/types";
  import ChipIcon from "./ChipIcon.svelte";

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<div class="bg-black p-4 rounded-lg border border-white flex flex-col gap-2">
  <div class="text-3xl font-bold text-white text-center">GLITCHBOMB</div>

  <div class="grid grid-cols-3 gap-2 text-center">
    <div>
      <div
        class="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1"
      >
        {gameState.playerStats.chips}
        <ChipIcon size="md" class="text-yellow-400" />
      </div>
      <div class="text-white text-xs">GLITCH CHIPS</div>
    </div>

    <div>
      <div class="text-2xl font-bold text-blue-400">
        {gameState.playerStats.levelMultiplier}x
      </div>
      <div class="text-white text-xs">MULT</div>
    </div>

    <div>
      <div class="text-2xl font-bold text-purple-400">
        {gameState.currentLevel}
      </div>
      <div class="text-white text-xs">LEVEL</div>
    </div>
  </div>

  <div class="gap-2 flex flex-col">
    <div class="text-green-400 font-bold text-center">
      POINTS {gameState.playerStats.points}/{getLevelMilestone(
        gameState.currentLevel
      )}
    </div>
    <div class="rounded h-8 border">
      <div
        class="bg-white h-full rounded transition-all duration-300"
        style="width: {Math.min(
          100,
          (gameState.playerStats.points /
            getLevelMilestone(gameState.currentLevel)) *
            100
        )}%"
      ></div>
    </div>
  </div>

  <div class="gap-2 flex flex-col">
    <div class="text-red-400 font-bold text-center">
      HEALTH {gameState.playerStats.health}/5
    </div>
    <div class="rounded h-8 border">
      <div
        class="bg-white h-full rounded transition-all duration-300"
        style="width: {(gameState.playerStats.health / 5) * 100}%"
      ></div>
    </div>
  </div>
</div>
