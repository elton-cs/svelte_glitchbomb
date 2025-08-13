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
            class="px-4 py-2 rounded font-medium text-sm transition-colors border uppercase tracking-wide bg-black"
            class:text-white={activeTab === 'game'}
            class:border-white={activeTab === 'game'}
            class:text-gray-500={activeTab !== 'game'}
            class:border-gray-500={activeTab !== 'game'}
            class:hover:bg-white={activeTab !== 'game'}
            class:hover:text-black={activeTab !== 'game'}
            class:hover:border-white={activeTab !== 'game'}
            onclick={() => activeTab = 'game'}
          >
            <span class="hidden sm:inline">Game</span>
            <span class="sm:hidden">G</span>
          </button>
          <button 
            class="px-4 py-2 rounded font-medium text-sm transition-colors border uppercase tracking-wide bg-black"
            class:text-white={activeTab === 'playground'}
            class:border-white={activeTab === 'playground'}
            class:text-gray-500={activeTab !== 'playground'}
            class:border-gray-500={activeTab !== 'playground'}
            class:hover:bg-white={activeTab !== 'playground'}
            class:hover:text-black={activeTab !== 'playground'}
            class:hover:border-white={activeTab !== 'playground'}
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
            class="px-4 py-2 rounded font-medium text-sm transition-colors border uppercase tracking-wide bg-black"
            class:text-white={devMode}
            class:border-white={devMode}
            class:text-gray-500={!devMode}
            class:border-gray-500={!devMode}
            class:hover:bg-white={!devMode}
            class:hover:text-black={!devMode}
            class:hover:border-white={!devMode}
          >
            <span class="hidden sm:inline">{devMode ? 'DEV ON' : 'DEV'}</span>
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
