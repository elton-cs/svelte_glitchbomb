<script lang="ts">
  interface Props {
    label: string;
    onClick: () => void;
    isEnabled: boolean;
    isGlowing?: boolean;
    subtitle?: string;
  }

  let {
    label,
    onClick,
    isEnabled,
    isGlowing = false,
    subtitle,
  }: Props = $props();

  const labelParts = $derived(label.split(" "));
</script>

<button
  onclick={onClick}
  disabled={!isEnabled}
  class="flex-1 min-h-[64px] p-4 rounded text-xs font-medium transition-all border
         {isEnabled
    ? 'text-white border-white hover:bg-white hover:text-black'
    : 'text-gray-500 border-gray-500 cursor-not-allowed'}
         {isGlowing ? 'bg-white border-green-400 text-black' : ''}"
>
  <div class="text-center flex flex-col justify-center h-full">
    <div class="font-medium flex flex-col">
      {#each labelParts as part}
        <div>{part}</div>
      {/each}
    </div>
    {#if subtitle}
      <div class="text-[10px] opacity-75 mt-0.5">{@html subtitle}</div>
    {/if}
  </div>
</button>
