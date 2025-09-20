<script lang="ts">
    interface Props {
        main_color: string;
        accent_color: string;
        emoji: string;
        text: string;
        show_info: boolean;
        size?: number;
    }

    let { main_color, accent_color, emoji, text, show_info, size = 60 }: Props = $props();

    // Calculate viewBox dimensions based on size
    let view_box_size = $derived(size * 1.2); // Maintain proportions from original SVG
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 72 72"
    xmlns="http://www.w3.org/2000/svg"
>
    <g id="color">
        <circle cx="36" cy="32.8" r="22.2" fill={main_color}/>
        <path fill={accent_color} d="M58.2,33c0,12.3-9.7,22.1-22,22.1c11.6-8,14.8-16.8,14.4-24.5c0-0.3,0-0.5-0.1-0.8c-0.2-1.7-0.5-3.4-1.1-5 c-0.1-0.2-0.1-0.4-0.2-0.6c-0.7-2-1.7-3.8-2.7-5.4c-0.2-0.3-0.3-0.5-0.5-0.7c-0.6-0.9-1.3-1.8-2.1-2.5c-0.2-0.2-0.3-0.4-0.5-0.5 c-0.2-0.2-0.4-0.4-0.6-0.6c-0.2-0.2-0.4-0.3-0.6-0.5c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.2-0.4-0.3-0.5-0.4c-0.8-0.6-1.7-1.2-2.5-1.6 c-0.1-0.1-0.3-0.1-0.4-0.2c-0.3-0.1-0.7-0.3-1-0.4C37.3,11,37.1,11,37,11s-0.2,0-0.3,0s-0.2,0-0.3,0h0.1 C48.6,11.1,58.2,20.9,58.2,33z"/>
        <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M19.4,30.7c0.1-0.5,0.2-1.1,0.3-1.6"/>
        <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M21.4,24.6c1.5-2.7,3.6-4.9,6.2-6.4"/>
    </g>
    <g id="line">
        <circle cx="36" cy="32.8" r="22.2" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    </g>

    <!-- Orb Info Text (shown when show_info is true) -->
    {#if show_info}
        <g id="orb-info">
            <!-- Category Emoji -->
            <text
                x="36"
                y="30"
                text-anchor="middle"
                font-size="8"
                font-family="system-ui, -apple-system, sans-serif"
            >
                {emoji}
            </text>

            <!-- Orb Details (e.g., "B:2") -->
            <text
                x="36"
                y="38"
                text-anchor="middle"
                font-size="6"
                font-weight="bold"
                fill="#FFFFFF"
                font-family="system-ui, -apple-system, sans-serif"
            >
                {text}
            </text>
        </g>
    {/if}
</svg>