<script lang="ts">
  interface Props {
    label: string;
    onClick: () => void;
    isEnabled: boolean;
  }

  let { label, onClick, isEnabled }: Props = $props();
</script>

<button
  onclick={onClick}
  disabled={!isEnabled}
  class="flex-1 py-3 px-4 rounded text-base font-medium transition-colors border
         {isEnabled
           ? 'bg-black text-white border-white hover:bg-white hover:text-black'
           : 'bg-black text-gray-500 border-gray-500 cursor-not-allowed'}"
>
  {label}
</button>

