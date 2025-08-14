<script lang="ts">
  import GameDashboard from './lib/components/GameDashboard.svelte'
  import Playground from './lib/components/Playground.svelte'
  
  let activeTab = $state('game')
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
            class:bg-white={activeTab === 'game'}
            class:text-black={activeTab === 'game'}
            class:bg-black={activeTab !== 'game'}
            class:text-white={activeTab !== 'game'}
            class:hover:bg-white={activeTab !== 'game'}
            class:hover:text-black={activeTab !== 'game'}
            onclick={() => activeTab = 'game'}
          >
            <span class="hidden sm:inline">Game</span>
            <span class="sm:hidden">G</span>
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
            <span class="sm:hidden">P</span>
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
    {#if activeTab === 'game'}
      <GameDashboard {devMode} />
    {:else if activeTab === 'playground'}
      <Playground />
    {/if}
  </div>
</div>
