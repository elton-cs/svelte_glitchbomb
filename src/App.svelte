<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";
  // import GameDashboard from "./lib/components/GameDashboard.svelte";

  let devMode = $state(false);
</script>

<GameContainer />

<style>
  :global(body) {
    touch-action: manipulation;
  }
</style>
