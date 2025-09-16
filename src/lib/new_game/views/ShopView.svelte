<script lang="ts">
  import { game_state, back_to_menu, buy_item } from '../state/game_state.svelte';
  import { ModifierType, CATEGORY_INFO, type ShopItem } from '../state/types';
  import CurrentView from '../components/CurrentView.svelte';

  let game = $derived(game_state.game!);

  // Get modifier display text for shop item
  function get_modifier_text(item: ShopItem): string {
    return item.orb.modifiers
      .map(mod => {
        const initial = get_modifier_initial(mod.type);
        return `${initial}${mod.value.value}`;
      })
      .join('');
  }

  // Get modifier initial
  function get_modifier_initial(type: ModifierType): string {
    switch (type) {
      case ModifierType.Point: return 'P';
      case ModifierType.Health: return 'H';
      case ModifierType.Bomb: return 'B';
      case ModifierType.Multiplier: return 'M';
      case ModifierType.PointsPerAnyOrb: return 'A';
      case ModifierType.PointsPerBombPulled: return 'X';
      default: return '?';
    }
  }

  // Get rarity name
  function get_rarity_name(item: ShopItem): string {
    switch (item.rarity.rarity) {
      case 0: return 'Common';
      case 1: return 'Rare';
      case 2: return 'Cosmic';
      default: return 'Unknown';
    }
  }

  // Purchase item
  function purchase(index: number) {
    const success = buy_item(index);
    if (!success) {
      // Could add feedback for failed purchase
      console.log('Purchase failed - not enough chips');
    }
  }
</script>

<div class="bg-black p-4 rounded-lg border border-white">
  <CurrentView />

  <div class="text-center mb-6">
    <h2 class="text-4xl font-bold text-white mb-2">SHOP</h2>
    <div class="text-yellow-400 text-lg font-bold">Chips: {game.chips}</div>
  </div>

  <!-- Shop Items Grid -->
  <div class="grid grid-cols-2 gap-3 mb-6">
    {#each game.shop_items as item, index}
      {@const category_info = CATEGORY_INFO[item.orb.category]}
      {@const can_afford = game.chips >= item.price}
      <div class="border border-white rounded p-3 bg-gray-900">
        <!-- Item Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="{category_info.color} px-2 py-1 rounded text-black text-xs font-bold">
            {get_modifier_text(item)}
          </div>
          <div class="{item.rarity.color} px-2 py-1 rounded text-white text-xs font-bold">
            {get_rarity_name(item)}
          </div>
        </div>

        <!-- Price and Buy Button -->
        <div class="text-center">
          <div class="text-yellow-400 font-bold mb-2">{item.price} chips</div>
          <button
            onclick={() => purchase(index)}
            disabled={!can_afford}
            class="w-full px-3 py-2 text-xs font-bold uppercase tracking-wide border transition-colors {can_afford
              ? 'bg-white text-black border-white hover:bg-black hover:text-white'
              : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'}"
          >
            {can_afford ? 'Buy' : 'Too Expensive'}
          </button>
        </div>
      </div>
    {/each}
  </div>

  <button
    onclick={back_to_menu}
    class="w-full px-4 py-2 bg-black text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black transition-colors"
  >
    Back to Menu
  </button>
</div>