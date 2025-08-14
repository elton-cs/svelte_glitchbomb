<script lang="ts">
  import GameDashboard from './lib/components/GameDashboard.svelte'
  import Playground from './lib/components/Playground.svelte'
  import PlayerView from './lib/components/PlayerView.svelte'
  
  let activeTab = $state('data')
  let devMode = $state(false)
  
  function toggleDevMode() {
    devMode = !devMode;
  }
</script>

<div class="min-h-screen bg-black">
  <!-- Header with Navigation -->
  <div class="bg-black border-b border-white p-3">
    <div class="max-w-7xl mx-auto">
      <div class="relative flex items-center">
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

        <!-- Center: Game Title - Absolutely positioned to stay centered -->
        <div class="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 class="text-lg sm:text-2xl font-bold text-white">GLITCH BOMB</h1>
        </div>

        <!-- Right side: Dev Button - Same size as tabs -->
        <div class="ml-auto">
          <button 
            onclick={toggleDevMode}
            class="px-4 py-2 rounded font-medium text-sm transition-colors border border-white uppercase tracking-wide"
            class:bg-white={devMode}
            class:text-black={devMode}
            class:bg-black={!devMode}
            class:text-white={!devMode}
            class:hover:bg-white={!devMode}
            class:hover:text-black={!devMode}
          >
            <span class="hidden sm:inline">DEV</span>
            <span class="sm:hidden">D</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tab Content -->
  <div class="flex-1">
    {#if activeTab === 'player'}
      <PlayerView />
    {:else if activeTab === 'data'}
      <GameDashboard {devMode} />
    {:else if activeTab === 'playground'}
      <Playground />
    {/if}
  </div>
</div>
