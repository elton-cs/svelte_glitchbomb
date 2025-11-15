<script lang="ts">
  interface Props {
    activeTab: "profit" | "probability" | "log";
  }

  let { activeTab = $bindable() }: Props = $props();
</script>

<div class="flex bg-white rounded-lg border border-white overflow-hidden">
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-l-lg
           {activeTab === 'profit'
      ? 'text-black'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => {
      activeTab = "profit";
    }}
  >
    PROFIT
  </button>
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors
           {activeTab === 'probability'
      ? 'text-black'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => {
      activeTab = "probability";
    }}
  >
    PROBABILITY
  </button>
  <button
    class="flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-r-lg
           {activeTab === 'log'
      ? 'text-black'
      : 'bg-black text-white hover:bg-white hover:text-black'}"
    onclick={() => {
      activeTab = "log";
    }}
  >
    LOG
  </button>
</div>
