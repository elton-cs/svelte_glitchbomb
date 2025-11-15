<script lang="ts">
  import GameDashboard from './lib/components/GameDashboard.svelte'
  
  let devMode = $state(false)
</script>

<div class="min-h-screen bg-black">
  <GameDashboard {devMode} />
</div>
