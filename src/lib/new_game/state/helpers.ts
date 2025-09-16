import {
  ModifierType,
  OrbCategory,
  RarityType,
  RARITY_INFO,
  type Orb,
  type Modifier,
  type Game,
  type ShopItem,
} from "./types";

// Helper to create a modifier
function create_modifier(type: ModifierType, value: number): Modifier {
  return {
    type,
    value: { value },
  };
}

// Helper to create an orb with modifiers and category
function create_orb(modifiers: Modifier[], category: OrbCategory): Orb {
  return { modifiers, category };
}

// Get the starting orbs for a new game
function build_starting_orbs(): Orb[] {
  const starting_orbs: Orb[] = [
    // 4 Bomb orbs with different values (based on old implementation)
    create_orb([create_modifier(ModifierType.Bomb, 1)], OrbCategory.Bomb), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 1)], OrbCategory.Bomb), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 2)], OrbCategory.Bomb), // Double Bomb
    create_orb([create_modifier(ModifierType.Bomb, 3)], OrbCategory.Bomb), // Triple Bomb

    // 3 Point orbs with value 5 each
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5

    // 1 Health orb
    create_orb([create_modifier(ModifierType.Health, 1)], OrbCategory.Health), // Health 1

    // 1 Multiplier orb
    create_orb(
      [create_modifier(ModifierType.Multiplier, 1)],
      OrbCategory.Multiplier,
    ), // Multiplier Boost

    // 1 PointsPerAnyOrb orb
    create_orb(
      [create_modifier(ModifierType.PointsPerAnyOrb, 1)],
      OrbCategory.Special,
    ), // Points per any orb (1 point per remaining orb)

    // 1 PointsPerBombPulled orb
    create_orb(
      [create_modifier(ModifierType.PointsPerBombPulled, 4)],
      OrbCategory.Special,
    ), // Points per bomb pulled (4 points per bomb previously pulled)
  ];

  return starting_orbs;
}

// Flatten multiple orb arrays into one and shuffle the result
export function flatten_and_shuffle_orbs(orb_lists: Orb[][]): Orb[] {
  // Flatten all arrays into one
  const flattened_orbs = orb_lists.flat();

  // Shuffle using Fisher-Yates algorithm
  const shuffled_orbs = [...flattened_orbs];
  for (let i = shuffled_orbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled_orbs[i], shuffled_orbs[j]] = [shuffled_orbs[j], shuffled_orbs[i]];
  }

  return shuffled_orbs;
}

// Generate shop items for purchase
function generate_shop_items(): ShopItem[] {
  const shop_items: ShopItem[] = [
    // Common items (cheaper, basic effects)
    {
      orb: create_orb([create_modifier(ModifierType.Point, 8)], OrbCategory.Point),
      rarity: RARITY_INFO[RarityType.Common],
      price: 5,
    },
    {
      orb: create_orb([create_modifier(ModifierType.Health, 2)], OrbCategory.Health),
      rarity: RARITY_INFO[RarityType.Common],
      price: 4,
    },

    // Rare items (moderate price, better effects)
    {
      orb: create_orb([create_modifier(ModifierType.Point, 12)], OrbCategory.Point),
      rarity: RARITY_INFO[RarityType.Rare],
      price: 12,
    },
    {
      orb: create_orb([create_modifier(ModifierType.Multiplier, 2)], OrbCategory.Multiplier),
      rarity: RARITY_INFO[RarityType.Rare],
      price: 15,
    },

    // Cosmic items (expensive, powerful effects)
    {
      orb: create_orb([create_modifier(ModifierType.PointsPerAnyOrb, 3)], OrbCategory.Special),
      rarity: RARITY_INFO[RarityType.Cosmic],
      price: 25,
    },
    {
      orb: create_orb([create_modifier(ModifierType.PointsPerBombPulled, 6)], OrbCategory.Special),
      rarity: RARITY_INFO[RarityType.Cosmic],
      price: 30,
    },
  ];

  return shop_items;
}

// Initialize a new game with all default values
export function init_game(): Game {
  const starting_orbs = build_starting_orbs();
  const purchased_orbs: Orb[] = [];
  const playground_orbs = flatten_and_shuffle_orbs([
    starting_orbs,
    purchased_orbs,
  ]);

  return {
    level: 1,
    points: 0,
    milestone: 12,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
    starting_orbs,
    purchased_orbs,
    playground_orbs,
    pulled_orbs: [],
    shop_items: generate_shop_items(),
  };
}

// Apply orb effects to game state
export function apply_orb(game: Game, orb: Orb): void {
  for (const modifier of orb.modifiers) {
    switch (modifier.type) {
      case ModifierType.Bomb:
        // Bomb deals damage (reduce health, minimum 0)
        game.health = Math.max(0, game.health - modifier.value.value);
        break;

      case ModifierType.Health:
        // Health restores health (maximum is max_health)
        game.health = Math.min(game.max_health, game.health + modifier.value.value);
        break;

      case ModifierType.Point:
        // Points add to score (multiplied by current multiplier)
        const base_points = modifier.value.value;
        const multiplied_points = base_points * game.multiplier;
        game.points += multiplied_points;
        break;

      case ModifierType.Multiplier:
        // Multiplier increases the multiplier value
        game.multiplier += modifier.value.value;
        break;

      case ModifierType.PointsPerAnyOrb:
        // Points per any orb - multiply modifier value by remaining orbs count, then by multiplier
        // Note: We subtract 1 from playground_orbs length because this orb will be removed
        const remaining_orbs = game.playground_orbs.length - 1;
        const base_points_awarded = modifier.value.value * remaining_orbs;
        const multiplied_points_awarded = base_points_awarded * game.multiplier;
        game.points += multiplied_points_awarded;
        break;

      case ModifierType.PointsPerBombPulled:
        // Points per bomb pulled - multiply modifier value by number of previously pulled bomb orbs
        const bombs_pulled = game.pulled_orbs.filter(pulled_orb =>
          pulled_orb.modifiers.some(mod => mod.type === ModifierType.Bomb)
        ).length;
        const base_bomb_points = modifier.value.value * bombs_pulled;
        const multiplied_bomb_points = base_bomb_points * game.multiplier;
        game.points += multiplied_bomb_points;
        break;
    }
  }

  // Award chips if player reaches milestone (wins the game)
  if (game.points >= game.milestone) {
    const chips_earned = game.points;
    game.chips += chips_earned;
  }
}

// Purchase an item from the shop
export function purchase_item(game: Game, item_index: number): boolean {
  const item = game.shop_items[item_index];
  if (!item || game.chips < item.price) {
    return false; // Not enough chips or invalid item
  }

  // Deduct chips
  game.chips -= item.price;

  // Add orb to purchased orbs
  game.purchased_orbs = [...game.purchased_orbs, item.orb];

  // Regenerate playground with new orb
  game.playground_orbs = flatten_and_shuffle_orbs([
    game.starting_orbs,
    game.purchased_orbs,
  ]);

  return true; // Purchase successful
}
