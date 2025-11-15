<script lang="ts">
  let activeTab = $state<"profit" | "probability" | "log">("profit");
</script>

<div class="flex bg-purple-900 rounded-lg border border-white overflow-hidden">
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-l-lg
           {activeTab === 'profit'
      ? 'text-white'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => (activeTab = "profit")}
  >
    PROFIT
  </button>
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors
           {activeTab === 'probability'
      ? 'text-white'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => (activeTab = "probability")}
  >
    PROBABILITY
  </button>
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-r-lg
           {activeTab === 'log'
      ? 'text-white'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => (activeTab = "log")}
  >
    LOG
  </button>
</div>
