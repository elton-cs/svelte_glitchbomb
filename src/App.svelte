<script lang="ts">
  import GameContainer from "./lib/game_container/GameContainer.svelte";

  let devMode = $state(false);
</script>

<div class="min-h-screen bg-black">
  <GameContainer />
</div>
