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
</script>

<button
  onclick={onClick}
  disabled={!isEnabled}
  class="button-3d w-full min-h-[80px] p-1 rounded text-xl font-medium transition-all border-2
         {isEnabled
    ? 'bg-black text-white border-white hover:bg-white hover:text-black active:bg-gray-300 active:text-black'
    : 'text-gray-500 border-gray-500 cursor-not-allowed opacity-60'}
         {isGlowing ? 'shadow-glow' : ''}"
>
  <div class="text-center flex flex-col justify-center h-full">
    <div class="font-medium">{label}</div>
    {#if subtitle}
      <div class="text-md opacity-75 mt-0.5">{@html subtitle}</div>
    {/if}
  </div>
</button>

<style>
  .button-3d {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.2) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 6px 0 0 rgba(80, 80, 80, 0.9),
      0 8px 16px -2px rgba(0, 0, 0, 0.7);
    transform: translateY(0);
    transition: all 0.15s ease;
  }

  .button-3d:not(:disabled):hover {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.3) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 8px 0 0 rgba(80, 80, 80, 1),
      0 10px 20px -2px rgba(0, 0, 0, 0.8);
    transform: translateY(-3px);
  }

  .button-3d:not(:disabled):active {
    box-shadow:
      0 2px 4px 0 rgba(0, 0, 0, 0.5) inset,
      0 1px 0 0 rgba(60, 60, 60, 0.6);
    transform: translateY(4px);
  }

  .button-3d:disabled {
    box-shadow:
      0 2px 0 0 rgba(100, 100, 100, 0.1),
      0 3px 6px -2px rgba(0, 0, 0, 0.2);
  }

  .shadow-glow {
    box-shadow:
      0 -2px 0 0 rgba(255, 255, 255, 0.3) inset,
      0 2px 0 0 rgba(0, 0, 0, 0.3) inset,
      0 6px 0 0 rgba(80, 80, 80, 0.9),
      0 8px 24px 0 rgba(74, 222, 128, 0.6),
      0 0 40px rgba(74, 222, 128, 0.4);
  }
</style>
