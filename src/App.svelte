<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";

  let devMode = $state(false);
</script>

<div class="flex h-full w-full">
  <div class="hidden md:flex flex-col h-full md:w-1/2 lg:w-full"></div>
  <GameContainer />
  <div class="hidden md:flex flex-col h-full md:w-1/2 lg:w-full"></div>
</div>

<style>
  :global(body) {
    touch-action: manipulation;
  }
</style>
