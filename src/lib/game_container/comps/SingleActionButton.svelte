<script lang="ts">
  interface Props {
    label: string;
    onClick: () => void;
    isEnabled: boolean;
    subtitle?: string;
  }

  let { label, onClick, isEnabled, subtitle }: Props = $props();
</script>

<button
  onclick={onClick}
  disabled={!isEnabled}
  class="flex-1 py-3 px-4 rounded text-base font-medium transition-colors border
         {isEnabled
           ? 'bg-black text-white border-white hover:bg-white hover:text-black'
           : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
>
  <div class="text-center">
    <div class="font-medium">{label}</div>
    {#if subtitle}
      <div class="text-sm opacity-75 mt-1">{@html subtitle}</div>
    {/if}
  </div>
</button>

