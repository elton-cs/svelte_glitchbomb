<script lang="ts">
    import type { OrbCategory } from '../state/types';
    import { get_orb_asset_path } from '../state/helpers';

    interface Props {
        category: OrbCategory;
        emoji: string;
        text: string;
        show_info: boolean;
        size?: number;
    }

    let { category, emoji, text, show_info, size = 60 }: Props = $props();

    let orb_src = $derived(get_orb_asset_path(category));
</script>

<div class="relative flex items-center justify-center" style="width: {size}px; height: {size}px;">
    <!-- Pixel Art Orb Image -->
    <img
        src={orb_src}
        alt="Orb"
        class="w-full h-full object-contain"
        style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
    />

    <!-- Orb Info Overlay (shown when show_info is true) -->
    {#if show_info}
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <!-- Category Emoji -->
            <div class="text-xs mb-0.5 drop-shadow-lg">
                {emoji}
            </div>

            <!-- Orb Details (e.g., "B:2") -->
            <div class="text-xs font-bold text-white drop-shadow-lg">
                {text}
            </div>
        </div>
    {/if}
</div>