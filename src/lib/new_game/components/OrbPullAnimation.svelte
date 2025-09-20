<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import type { Orb, Game } from '../state/types';
    import { pull_orb, game_state } from '../state/game_state.svelte';
    import { peek_next_orb } from '../state/helpers';

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

    // Reactive state for button text
    let button_text = $derived(() => {
        if (is_animating) {
            switch (animation_phase) {
                case 'pulling': return 'Pulling...';
                case 'presenting': return 'Click the orb!';
                case 'consuming': return 'Consuming...';
                default: return 'Pull Orb';
            }
        }
        return `Pull Orb (${orbs_remaining} left)`;
    });

    function start_pull_animation() {
        if (disabled || is_animating || orbs_remaining === 0) return;

        // Get the next orb without removing it from state
        if (!game_state.current_game) return;
        current_orb = peek_next_orb(game_state.current_game);
        if (!current_orb) return;

        is_animating = true;
        animation_phase = 'pulling';

        // Reset orb position to inside bag
        gsap.set(orb_element, {
            x: 0,
            y: 60, // Start inside bag
            scale: 0.3,
            opacity: 1,
            visibility: 'visible'
        });

        // Animate orb pulling up from bag
        gsap.to(orb_element, {
            y: -40,
            scale: 0.8,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                animation_phase = 'presenting';
                // Scale up for presentation
                gsap.to(orb_element, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
    }

    function consume_orb() {
        if (animation_phase !== 'presenting') return;

        animation_phase = 'consuming';

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
        <!-- Bag SVG -->
        <div
            bind:this={bag_element}
            class="cursor-pointer transition-transform hover:scale-105"
            class:pointer-events-none={disabled || is_animating}
            onclick={start_pull_animation}
        >
            <svg
                width="120"
                height="120"
                viewBox="0 0 503.466 503.466"
                xmlns="http://www.w3.org/2000/svg"
                class="filter drop-shadow-lg"
            >
                <g transform="translate(3 1)">
                    <path style="fill:#FFD0A1;" d="M19.08,404.333c4.267-132.267,39.253-204.8,63.147-238.933c0,0,13.653-17.067,22.187-25.6h42.667
                        h93.867h34.133h85.333c0,0,85.333,68.267,85.333,290.133c0,34.133-67.413,68.267-213.333,68.267S19.08,464.066,19.08,429.933
                        C19.08,421.4,19.08,412.866,19.08,404.333z M386.013,28.866c29.013,29.013-25.6,76.8-25.6,76.8h-256c0,0-68.267-51.2-34.133-85.333
                        S130.013,37.4,164.146,37.4c51.2,0,42.667-34.133,85.333-34.133S292.146,37.4,317.746,37.4S362.973,5.826,386.013,28.866z"/>
                    <path style="fill:#AE938D;" d="M360.413,105.666c9.387,0,17.067,7.68,17.067,17.067S369.8,139.8,360.413,139.8H275.08h-34.133
                        H147.08h-42.667c-9.387,0-17.067-7.68-17.067-17.067s7.68-17.067,17.067-17.067H360.413z"/>
                    <path style="fill:#E4F2DE;" d="M471.346,250.733c5.12,0,8.533,4.267,8.533,8.533s-3.413,8.533-8.533,8.533
                        s-8.533-4.267-8.533-8.533S466.226,250.733,471.346,250.733z M351.88,242.2c5.12,0,8.533,4.267,8.533,8.533
                        c0,4.267-3.413,8.533-8.533,8.533c-5.12,0-8.533-4.267-8.533-8.533c0-2.56,0.853-4.267,2.56-5.973
                        C347.613,243.053,349.32,242.2,351.88,242.2z"/>
                </g>
                <path style="fill:#51565F;" d="M235.413,503.466c-160.427,0-217.6-39.253-217.6-72.533c0-8.533,0-16.213,0-23.893
                    c-0.853-0.853-0.853-2.56,0-3.413c4.267-133.973,40.96-207.36,64-239.787c1.707-1.707,4.267-2.56,5.973-0.853
                    c1.707,1.707,2.56,4.267,0.853,5.973c-22.187,31.573-58.027,103.253-62.293,234.667c5.12,4.267,19.627,16.213,39.253,23.04
                    c2.56,0.853,3.413,3.413,2.56,5.12c-0.853,1.707-3.413,3.413-5.12,2.56c-16.213-5.12-29.013-14.507-36.693-20.48
                    c0,5.12,0,11.093,0,16.213c0,30.72,65.707,64,209.067,64s209.067-33.28,209.067-64c0-5.973,0-11.093,0-17.067
                    c-6.827,5.973-19.627,15.36-36.693,20.48c-2.56,0.853-4.267-0.853-5.12-2.56c-0.853-2.56,0.853-4.267,2.56-5.12
                    c22.187-7.68,36.693-21.333,39.253-23.893c-5.973-170.667-64.853-240.64-80.213-255.147c-7.68,12.8-29.867,52.907-12.8,92.16
                    c0.853,0,2.56-0.853,4.267-0.853c6.827,0,12.8,5.973,12.8,12.8s-5.973,12.8-12.8,12.8s-12.8-5.973-12.8-12.8
                    c0-2.56,0.853-5.12,1.707-6.827c-19.627-41.813,1.707-83.627,11.093-99.84h-71.68l6.827,29.013c0.853,2.56-0.853,4.267-3.413,5.12
                    c-2.56,0.853-4.267-0.853-5.12-3.413l-7.68-30.72h-26.453v12.8c0,2.56-1.707,4.267-4.267,4.267s-4.267-1.707-4.267-4.267v-12.8
                    h-87.04c-2.56,5.973-6.827,21.333-6.827,46.933c0,2.56-1.707,4.267-4.267,4.267s-4.267-1.707-4.267-4.267
                    c0-23.04,4.267-39.253,6.827-46.933h-36.693c-11.947,0-21.333-9.387-21.333-21.333c0-8.533,5.12-15.36,11.947-18.773
                    c-11.947-10.24-36.693-34.133-38.4-58.88C58.774,34.986,62.187,25.6,70.72,17.92c23.04-23.04,44.373-10.24,62.293,1.707
                    c11.093,6.827,22.187,14.507,34.133,14.507c24.747,0,34.133-8.533,44.373-17.067C220.907,8.533,230.293,0,252.48,0
                    c25.6,0,37.547,11.947,46.933,21.333c6.827,6.827,11.947,12.8,21.333,12.8c8.533,0,17.067-4.267,24.747-8.533
                    c13.653-6.827,29.867-15.36,46.08,0.853c6.827,6.827,10.24,15.36,9.387,24.747c-0.853,20.48-17.92,40.96-28.16,51.2
                    c94.72,7.68,104.107,123.733,104.96,145.067c5.12,1.707,8.533,6.827,8.533,11.947c0,6.827-5.973,12.8-12.8,12.8
                    s-12.8-5.973-12.8-12.8c0-5.12,3.413-10.24,8.533-11.947C468.373,225.28,459.84,110.08,362.56,110.08h-256
                    c-6.827,0-12.8,5.973-12.8,12.8s5.973,12.8,12.8,12.8h170.667l0,0h85.333c0,0,0,0,0.853,0s1.707,0,1.707,0.853
                    c3.413,2.56,87.04,71.68,87.04,293.547C453.013,464.213,395.84,503.466,235.413,503.466z M474.346,256
                    c-2.56,0-4.267,1.707-4.267,4.267s1.707,4.267,4.267,4.267s4.267-1.707,4.267-4.267S476.906,256,474.346,256z M351.467,248.32
                    c-0.853,0.853-0.853,1.707-0.853,3.413c0,2.56,1.707,4.267,4.267,4.267s4.267-1.707,4.267-4.267
                    C359.146,248.32,354.026,246.613,351.467,248.32C352.32,248.32,352.32,248.32,351.467,248.32z M109.12,102.4h252.587
                    c5.973-5.12,30.72-29.867,31.573-51.2c0-6.827-2.56-12.8-6.827-17.92c-11.947-11.947-20.48-7.68-35.84,0
                    c-9.387,4.267-17.92,9.387-29.013,9.387c-12.8,0-20.48-7.68-27.307-15.36c-9.387-9.387-18.773-18.773-40.96-18.773
                    c-18.773,0-26.453,6.827-34.987,14.507c-10.24,9.387-21.333,19.627-50.347,19.627c-14.507,0-26.453-7.68-39.253-15.36
                    c-18.773-11.947-33.28-21.333-52.053-2.56c-5.973,5.973-8.533,12.8-8.533,21.333C69.867,69.973,102.293,97.28,109.12,102.4z
                     M235.413,452.266c-67.413,0-119.467-8.533-120.32-8.533c-2.56,0-4.267-2.56-3.413-5.12c0-2.56,2.56-4.267,5.12-3.413
                    c0.853,0,52.053,8.533,118.613,8.533c2.56,0,4.267,1.707,4.267,4.267C239.68,450.56,237.973,452.266,235.413,452.266z"/>
            </svg>
        </div>

        <!-- Animated Orb -->
        <div
            bind:this={orb_element}
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            class:pointer-events-none={animation_phase !== 'presenting'}
            onclick={consume_orb}
        >
            <svg
                width="60"
                height="60"
                viewBox="0 0 72 72"
                xmlns="http://www.w3.org/2000/svg"
                class="filter drop-shadow-md"
            >
                <g id="color">
                    <circle cx="36" cy="32.8" r="22.2" fill="#B399C8"/>
                    <path fill="#8967AA" d="M58.2,33c0,12.3-9.7,22.1-22,22.1c11.6-8,14.8-16.8,14.4-24.5c0-0.3,0-0.5-0.1-0.8c-0.2-1.7-0.5-3.4-1.1-5 c-0.1-0.2-0.1-0.4-0.2-0.6c-0.7-2-1.7-3.8-2.7-5.4c-0.2-0.3-0.3-0.5-0.5-0.7c-0.6-0.9-1.3-1.8-2.1-2.5c-0.2-0.2-0.3-0.4-0.5-0.5 c-0.2-0.2-0.4-0.4-0.6-0.6c-0.2-0.2-0.4-0.3-0.6-0.5c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.2-0.4-0.3-0.5-0.4c-0.8-0.6-1.7-1.2-2.5-1.6 c-0.1-0.1-0.3-0.1-0.4-0.2c-0.3-0.1-0.7-0.3-1-0.4C37.3,11,37.1,11,37,11s-0.2,0-0.3,0s-0.2,0-0.3,0h0.1 C48.6,11.1,58.2,20.9,58.2,33z"/>
                    <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M19.4,30.7c0.1-0.5,0.2-1.1,0.3-1.6"/>
                    <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M21.4,24.6c1.5-2.7,3.6-4.9,6.2-6.4"/>
                </g>
                <g id="line">
                    <circle cx="36" cy="32.8" r="22.2" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
                </g>
            </svg>
        </div>
    </div>

    <!-- Status Text -->
    <div class="text-white text-center">
        <div class="text-sm font-bold uppercase">
            {button_text}
        </div>
        {#if animation_phase === 'presenting' && current_orb}
            <div class="text-xs text-gray-400 mt-1">
                Click to consume orb
            </div>
        {/if}
    </div>
</div>