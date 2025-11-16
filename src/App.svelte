<script lang="ts">
  import GameDashboard from './lib/components/GameDashboard.svelte'
  import Playground from './lib/components/Playground.svelte'
  import PlayerView from './lib/components/PlayerView.svelte'
  
  let activeTab = $state('player')
  let devMode = $state(false)
  
  function toggleDevMode() {
    devMode = !devMode;
  }
</script>

<div class="min-h-screen bg-black">
  <!-- Header with Navigation -->
  <div class="bg-black border-b border-white p-3">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- Left side: Tabs -->
        <div class="flex space-x-2">
          <button 
            class="px-4 py-2 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
            class:bg-white={activeTab === 'data'}
            class:text-black={activeTab === 'data'}
            class:bg-black={activeTab !== 'data'}
            class:text-white={activeTab !== 'data'}
            class:hover:bg-white={activeTab !== 'data'}
            class:hover:text-black={activeTab !== 'data'}
            onclick={() => activeTab = 'data'}
          >
            <span class="hidden sm:inline">Data View</span>
            <span class="sm:hidden">D</span>
          </button>
          <button 
            class="px-4 py-2 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
            class:bg-white={activeTab === 'player'}
            class:text-black={activeTab === 'player'}
            class:bg-black={activeTab !== 'player'}
            class:text-white={activeTab !== 'player'}
            class:hover:bg-white={activeTab !== 'player'}
            class:hover:text-black={activeTab !== 'player'}
            onclick={() => activeTab = 'player'}
          >
            <span class="hidden sm:inline">Player View</span>
            <span class="sm:hidden">P</span>
          </button>
          <button 
            class="px-4 py-2 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
            class:bg-white={activeTab === 'playground'}
            class:text-black={activeTab === 'playground'}
            class:bg-black={activeTab !== 'playground'}
            class:text-white={activeTab !== 'playground'}
            class:hover:bg-white={activeTab !== 'playground'}
            class:hover:text-black={activeTab !== 'playground'}
            onclick={() => activeTab = 'playground'}
          >
            <span class="hidden sm:inline">Playground</span>
            <span class="sm:hidden">PG</span>
          </button>
        </div>

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
