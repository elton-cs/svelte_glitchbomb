<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";
  import GameDashboard from "./lib/components/GameDashboard.svelte";

  let devMode = $state(false);
</script>

<!-- Desktop: show GameDashboard, hide GameContainer -->
<div class="hidden md:block">
  <GameDashboard {devMode} />
</div>

<!-- Mobile: show GameContainer, hide GameDashboard -->
<div
  class="md:hidden flex flex-col p-2 gap-2 h-full w-full justify-between min-h-0 overflow-hidden"
>
  <GameContainer />
</div>
