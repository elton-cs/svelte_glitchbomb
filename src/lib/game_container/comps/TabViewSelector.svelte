<script lang="ts">
  interface Props {
    activeTab: "profit" | "probability" | "log" | "shop";
    disabled?: boolean;
  }

  let { activeTab = $bindable(), disabled = false }: Props = $props();
</script>

<div class="flex justify-between rounded-lg border p-1 gap-1">
  <button
    {disabled}
    class="flex-1 p-2 text-xs font-medium transition-colors rounded
           {disabled
      ? 'text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'profit'
        ? 'text-black bg-white'
        : 'text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "profit";
      }
    }}
  >
    PROFIT
  </button>
  <button
    {disabled}
    class="flex-1 p-2 text-xs font-medium transition-colors rounded
           {disabled
      ? 'text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'probability'
        ? 'text-black bg-white'
        : 'text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "probability";
      }
    }}
  >
    ODDS
  </button>
  <button
    {disabled}
    class="flex-1 p-2 text-xs font-medium transition-colors rounded
           {disabled
      ? 'text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'log'
        ? 'text-black bg-white'
        : 'text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "log";
      }
    }}
  >
    LOG
  </button>
  <button
    {disabled}
    class="flex-1 p-2 text-xs font-medium transition-colors rounded
           {disabled
      ? 'text-gray-500 border-gray-500 cursor-not-allowed'
      : activeTab === 'shop'
        ? 'text-black bg-white'
        : 'text-white border-white hover:bg-white hover:text-black'}"
    onclick={() => {
      if (!disabled) {
        activeTab = "shop";
      }
    }}
  >
    SHOP
  </button>
</div>
