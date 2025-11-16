<script lang="ts">
  interface Props {
    activeTab: "profit" | "probability" | "log" | "shop";
    disabled?: boolean;
  }

  let { activeTab = $bindable(), disabled = false }: Props = $props();
</script>

<div class="flex bg-white rounded-lg border border-white overflow-hidden">
  <button
    disabled={disabled}
    class="flex-1 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors rounded-l-lg border
           {disabled
      ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'profit'
      ? 'text-black border-transparent'
      : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "profit";
      }
    }}
  >
    PROFIT
  </button>
  <button
    disabled={disabled}
    class="flex-1 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors border
           {disabled
      ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'probability'
      ? 'text-black border-transparent'
      : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "probability";
      }
    }}
  >
    PROBABILITY
  </button>
  <button
    disabled={disabled}
    class="flex-1 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors border
           {disabled
      ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'log'
      ? 'text-black border-transparent'
      : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "log";
      }
    }}
  >
    LOG
  </button>
  <button
    disabled={disabled}
    class="flex-1 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors rounded-r-lg border
           {disabled
      ? 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'shop'
      ? 'text-black border-transparent'
      : 'bg-black text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "shop";
      }
    }}
  >
    SHOP
  </button>
</div>
