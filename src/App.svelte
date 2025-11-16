<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";

  let devMode = $state(false);
</script>

<div class="flex h-full w-full">
  <GameContainer />
</div>

<style>
  :global(body) {
    touch-action: manipulation;
  }
</style>
