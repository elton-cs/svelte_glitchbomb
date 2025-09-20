<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import type { Orb, Game } from '../state/types';
    import { OrbCategory, CATEGORY_INFO } from '../state/types';
    import { pull_orb, game_state } from '../state/game_state.svelte';
    import { peek_next_orb, get_orb_display_text } from '../state/helpers';
    import PixelOrb from './PixelOrb.svelte';

    interface Props {
        disabled: boolean;
        orbs_remaining: number;
    }

    let { disabled, orbs_remaining }: Props = $props();

    let bag_element: HTMLElement;
    let orb_element: HTMLElement;
    let container_element: HTMLElement;

    let is_animating = $state(false);
    let current_orb: Orb | null = $state(null);
    let animation_phase = $state<'idle' | 'pulling' | 'presenting' | 'consuming'>('idle');
    let show_orb_info = $state(false);


    // Reactive orb emoji based on current orb category
    let orb_emoji = $derived(() => {
        if (current_orb) {
            return CATEGORY_INFO[current_orb.category].initial;
        }
        return "❓"; // default
    });

    // Reactive orb text based on current orb modifiers
    let orb_text = $derived(() => {
        if (current_orb) {
            return get_orb_display_text(current_orb);
        }
        return "?";
    });


    function start_pull_animation() {
        if (disabled || is_animating || orbs_remaining === 0) return;

        // Get the next orb without removing it from state
        if (!game_state.current_game) return;
        current_orb = peek_next_orb(game_state.current_game);
        if (!current_orb) return;

        is_animating = true;
        animation_phase = 'pulling';

        // Reset orb position to inside bag and hide info
        show_orb_info = false;
        gsap.set(orb_element, {
            x: 0,
            y: 60, // Start inside bag
            scale: 0.3,
            opacity: 1,
            visibility: 'visible'
        });

        // Animate orb pulling up from bag (move much higher and grow bigger)
        gsap.to(orb_element, {
            y: -200,
            scale: 2.5,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                animation_phase = 'presenting';
                // Scale up even more for presentation
                gsap.to(orb_element, {
                    scale: 3.0,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    onComplete: () => {
                        // Show orb info after bounce animation completes
                        show_orb_info = true;
                    }
                });
            }
        });
    }

    function consume_orb() {
        if (animation_phase !== 'presenting') return;

        animation_phase = 'consuming';
        show_orb_info = false; // Hide info during consumption

        // Animate orb flying up and fading out
        gsap.to(orb_element, {
            y: -200,
            scale: 0.5,
            opacity: 0,
            rotation: 360,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
                // Update game state after animation
                pull_orb();

                // Reset for next animation
                current_orb = null;
                is_animating = false;
                animation_phase = 'idle';

                // Hide orb element
                gsap.set(orb_element, {
                    visibility: 'hidden'
                });
            }
        });
    }

    onMount(() => {
        // Initialize orb as hidden
        gsap.set(orb_element, {
            visibility: 'hidden'
        });
    });
</script>

<div class="flex flex-col items-center space-y-4" bind:this={container_element}>
    <!-- Bag Container -->
    <div class="relative">
        <!-- Animated Orb (drawn first, behind bag) -->
        <div
            bind:this={orb_element}
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            class:pointer-events-none={animation_phase !== 'presenting'}
            onclick={consume_orb}
        >
            <PixelOrb
                category={current_orb?.category || OrbCategory.Point}
                emoji={orb_emoji()}
                text={orb_text()}
                show_info={show_orb_info}
                size={60}
            />
        </div>

        <!-- Pixel Art Bag (drawn second, in front of orb) -->
        <div
            bind:this={bag_element}
            class="cursor-pointer transition-transform hover:scale-105"
            class:pointer-events-none={disabled || is_animating}
            onclick={start_pull_animation}
        >
            <img
                src="src/assets/pixelbag_open.png"
                alt="Orb Bag"
                width="120"
                height="120"
                class="filter drop-shadow-lg"
                style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
            />
        </div>
    </div>

    <!-- Status Text -->
    <div class="text-white text-center">
        {#if is_animating}
            {#if animation_phase === 'pulling'}
                <div class="text-sm font-bold uppercase">Pulling...</div>
            {:else if animation_phase === 'presenting'}
                <div class="text-sm font-bold uppercase">Click the orb!</div>
                <div class="text-xs text-gray-400 mt-1">Click to consume orb</div>
            {:else if animation_phase === 'consuming'}
                <div class="text-sm font-bold uppercase">Consuming...</div>
            {/if}
        {:else}
            <div class="text-sm font-bold uppercase">Pull Orb ({orbs_remaining} left)</div>
        {/if}
    </div>
</div>