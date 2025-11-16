<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";
  // import GameDashboard from "./lib/components/GameDashboard.svelte";

  let devMode = $state(false);
</script>

<!-- Mobile: show GameContainer -->
<div
  class="md:hidden flex flex-col p-2 gap-2 h-full w-full justify-between min-h-0 overflow-hidden"
>
  <GameContainer />
</div>

<!-- Desktop: show GameContainer with empty side divs -->
<div class="hidden md:flex md:flex-row md:h-full md:w-full">
  <div class="flex-1"></div>
  <div class="flex flex-col p-2 gap-2 justify-between min-h-0 overflow-hidden">
    <GameContainer />
  </div>
  <div class="flex-1"></div>
</div>
