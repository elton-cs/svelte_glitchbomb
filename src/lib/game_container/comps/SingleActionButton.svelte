<script lang="ts">
  interface Props {
    label: string;
    onClick: () => void;
    isEnabled: boolean;
    subtitle?: string;
  }

  let { label, onClick, isEnabled, subtitle }: Props = $props();

  const labelParts = $derived(label.split(' '));
</script>

<button
  onclick={onClick}
  disabled={!isEnabled}
  class="flex-1 min-h-[64px] sm:min-h-[64px] py-4 sm:py-3 px-3 sm:px-4 rounded text-xs sm:text-base font-medium transition-colors border
         {isEnabled
           ? 'bg-black text-white border-white hover:bg-white hover:text-black'
           : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
>
  <div class="text-center flex flex-col justify-center h-full">
    <div class="font-medium flex flex-col">
      {#each labelParts as part}
        <div>{part}</div>
      {/each}
    </div>
    {#if subtitle}
      <div class="text-[10px] sm:text-sm opacity-75 mt-0.5 sm:mt-1">{@html subtitle}</div>
    {/if}
  </div>
</button>

