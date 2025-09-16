<script lang="ts">
  import { game_state } from '../state/game_state.svelte';
  import { ModifierType, CATEGORY_INFO, type Orb, type Modifier } from '../state/types';

  let game = $derived(game_state.game!);

  // Get modifier initial from type (for displaying modifier text)
  function get_modifier_initial(type: ModifierType): string {
    switch (type) {
      case ModifierType.Point:
        return 'P';
      case ModifierType.Health:
        return 'H';
      case ModifierType.Bomb:
        return 'B';
      case ModifierType.Multiplier:
        return 'M';
      case ModifierType.PointsPerAnyOrb:
        return 'A';
      case ModifierType.PointsPerBombPulled:
        return 'X';
      default:
        return '?';
    }
  }

  // Generate display text for an orb (e.g., "B3", "P5H1", "B3M5")
  function get_orb_display_text(orb: Orb): string {
    return orb.modifiers
      .map((modifier: Modifier) => `${get_modifier_initial(modifier.type)}${modifier.value.value}`)
      .join('');
  }
</script>

<div class="mb-6">
  <div class="text-white text-sm font-bold mb-3 text-center uppercase">
    Pulled Orbs
  </div>

  {#if game.pulled_orbs.length === 0}
    <div class="text-center text-gray-400 text-sm">No orbs pulled yet</div>
  {:else}
    <div class="flex flex-wrap gap-2 justify-start">
      {#each game.pulled_orbs as orb, index}
        {@const categoryInfo = CATEGORY_INFO[orb.category]}
        <div class="{categoryInfo.color} border border-white px-3 py-2 rounded text-black text-sm font-mono font-bold">
          {get_orb_display_text(orb)}
        </div>
      {/each}
    </div>
  {/if}
</div>