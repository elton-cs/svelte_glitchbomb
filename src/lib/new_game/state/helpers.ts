import {
  ModifierType,
  OrbCategory,
  RarityType,
  RARITY_INFO,
  type Orb,
  type Modifier,
  type Game,
  type ShopItem,
  type Player,
} from "./types";

// Level milestones for progression
const LEVEL_MILESTONES = [12, 18, 28, 44, 70, 100, 150];

// Level costs in moonrocks for playing each level
const LEVEL_COSTS = [10, 1, 2, 4, 6, 9, 13];

// Get milestone for a given level (1-indexed)
function get_milestone_for_level(level: number): number {
  if (level < 1 || level > LEVEL_MILESTONES.length) {
    return LEVEL_MILESTONES[LEVEL_MILESTONES.length - 1]; // Return last milestone for invalid levels
  }
  return LEVEL_MILESTONES[level - 1]; // Convert to 0-indexed array access
}

// Get moonrock cost for a given level (1-indexed)
export function get_level_cost(level: number): number {
  if (level < 1 || level > LEVEL_COSTS.length) {
    return LEVEL_COSTS[LEVEL_COSTS.length - 1]; // Return last cost for invalid levels
  }
  return LEVEL_COSTS[level - 1]; // Convert to 0-indexed array access
}

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

// Helper to create a shop item with all needed parameters
function build_shop_item(
  modifier_type: ModifierType,
  modifier_value: number,
  orb_category: OrbCategory,
  rarity_type: RarityType,
  price: number,
): ShopItem {
  return {
    orb: create_orb([create_modifier(modifier_type, modifier_value)], orb_category),
    rarity: RARITY_INFO[rarity_type],
    price,
  };
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

// Common shop items pool (8 items, select 3)
const COMMON_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(ModifierType.Point, 5, OrbCategory.Point, RarityType.Common, 5),
  build_shop_item(ModifierType.Point, 7, OrbCategory.Point, RarityType.Common, 8),
  build_shop_item(ModifierType.GlitchChips, 15, OrbCategory.Special, RarityType.Common, 5), 
  build_shop_item(ModifierType.PointsPerBombPulled, 4, OrbCategory.Special, RarityType.Common, 6),
  build_shop_item(ModifierType.Health, 1, OrbCategory.Health, RarityType.Common, 9),
  build_shop_item(ModifierType.Multiplier, 0.5, OrbCategory.Multiplier, RarityType.Common, 9),
];

// Rare shop items pool (4 items, select 2)
const RARE_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(ModifierType.Point, 8, OrbCategory.Point, RarityType.Rare, 11),
  build_shop_item(ModifierType.Point, 9, OrbCategory.Point, RarityType.Rare, 13),
  build_shop_item(ModifierType.Multiplier, 1.0, OrbCategory.Multiplier, RarityType.Rare, 14),
  build_shop_item(ModifierType.Multiplier, 1.5, OrbCategory.Multiplier, RarityType.Rare, 16),
];

// Cosmic shop items pool (3 items, select 1)
const COSMIC_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(ModifierType.Health, 3, OrbCategory.Health, RarityType.Cosmic, 21),
];

// Utility function to shuffle an array (reusable version of Fisher-Yates)
function shuffle_array<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate shop items for purchase with randomized selection
function generate_shop_items(): ShopItem[] {
  const selected_items: ShopItem[] = [];

  // Select 3 random common items
  const shuffled_common = shuffle_array(COMMON_SHOP_ITEMS);
  selected_items.push(...shuffled_common.slice(0, 3));

  // Select 2 random rare items
  const shuffled_rare = shuffle_array(RARE_SHOP_ITEMS);
  selected_items.push(...shuffled_rare.slice(0, 2));

  // Select 1 random cosmic item
  const shuffled_cosmic = shuffle_array(COSMIC_SHOP_ITEMS);
  selected_items.push(...shuffled_cosmic.slice(0, 1));

  return selected_items;
}

// Initialize a new game with all default values
export function init_game(
  level: number = 1,
  existing_purchased_orbs: Orb[] = [],
  existing_chips: number = 0,
): Game {
  const starting_orbs = build_starting_orbs();
  const purchased_orbs = [...existing_purchased_orbs];
  const playground_orbs = flatten_and_shuffle_orbs([
    starting_orbs,
    purchased_orbs,
  ]);

  return {
    level,
    points: 0,
    milestone: get_milestone_for_level(level),
    health: 5,
    max_health: 5,
    multiplier: 1,
    glitchchips: existing_chips,
    starting_orbs,
    purchased_orbs,
    playground_orbs,
    pulled_orbs: [],
    shop_items: generate_shop_items(),
  };
}

// Apply orb effects to game state
export function apply_orb(game: Game, orb: Orb, player: Player): void {
  for (const modifier of orb.modifiers) {
    switch (modifier.type) {
      case ModifierType.Bomb:
        // Bomb deals damage (reduce health, minimum 0)
        game.health = Math.max(0, game.health - modifier.value.value);
        break;

      case ModifierType.Health:
        // Health restores health (maximum is max_health)
        game.health = Math.min(
          game.max_health,
          game.health + modifier.value.value,
        );
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
        const bombs_pulled = game.pulled_orbs.filter((pulled_orb) =>
          pulled_orb.modifiers.some((mod) => mod.type === ModifierType.Bomb),
        ).length;
        const base_bomb_points = modifier.value.value * bombs_pulled;
        const multiplied_bomb_points = base_bomb_points * game.multiplier;
        game.points += multiplied_bomb_points;
        break;

      case ModifierType.GlitchChips:
        // GlitchChips directly add to the player's glitchchips
        game.glitchchips += modifier.value.value;
        break;

      case ModifierType.Moonrocks:
        // Moonrocks directly add to the player's moonrocks
        player.moonrocks += modifier.value.value;
        save_player_to_storage(player);
        break;
    }
  }

  // Award chips if player reaches milestone (wins the game)
  if (game.points >= game.milestone) {
    const chips_earned = game.points;
    game.glitchchips += chips_earned;
  }
}

// Purchase an item from the shop
export function purchase_item(game: Game, item_index: number): boolean {
  const item = game.shop_items[item_index];
  if (!item || game.glitchchips < item.price) {
    return false; // Not enough chips or invalid item
  }

  // Deduct chips
  game.glitchchips -= item.price;

  // Add orb to purchased orbs
  game.purchased_orbs = [...game.purchased_orbs, item.orb];

  // Regenerate playground with new orb
  game.playground_orbs = flatten_and_shuffle_orbs([
    game.starting_orbs,
    game.purchased_orbs,
  ]);

  return true; // Purchase successful
}

// Advance to the next level, preserving chips and purchased orbs
export function advance_to_next_level(game: Game): Game {
  const next_level = game.level + 1;
  return init_game(next_level, game.purchased_orbs, game.glitchchips);
}

// Player management functions
const PLAYER_STORAGE_KEY = "new_game_player_data";

// Initialize a new player with default moonrocks
export function init_player(): Player {
  return {
    moonrocks: 1000,
  };
}

// Load player data from localStorage
export function load_player_from_storage(): Player {
  try {
    const stored_data = localStorage.getItem(PLAYER_STORAGE_KEY);
    if (stored_data) {
      const parsed_player = JSON.parse(stored_data);
      // Validate the data structure
      if (typeof parsed_player.moonrocks === "number") {
        return parsed_player;
      }
    }
  } catch (error) {
    console.warn("Failed to load player data from localStorage:", error);
  }

  // Return default player if loading fails
  return init_player();
}

// Save player data to localStorage
export function save_player_to_storage(player: Player): void {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
  } catch (error) {
    console.warn("Failed to save player data to localStorage:", error);
  }
}

// Check if player can afford to play a level
export function can_afford_level(player: Player, level: number): boolean {
  const cost = get_level_cost(level);
  return player.moonrocks >= cost;
}

// Deduct moonrocks for playing a level, returns success status
export function deduct_moonrocks(player: Player, level: number): boolean {
  const cost = get_level_cost(level);
  if (player.moonrocks >= cost) {
    player.moonrocks -= cost;
    return true;
  }
  return false;
}

// Cash out points to moonrocks (1:1 conversion rate)
export function cash_out_points(player: Player, points: number): void {
  player.moonrocks += points;
  save_player_to_storage(player);
}

// Get modifier initial from type (for displaying modifier text)
export function get_modifier_initial(type: ModifierType): string {
  switch (type) {
    case ModifierType.Point:
      return "P";
    case ModifierType.Health:
      return "H";
    case ModifierType.Bomb:
      return "B";
    case ModifierType.Multiplier:
      return "M";
    case ModifierType.PointsPerAnyOrb:
      return "P/O";
    case ModifierType.PointsPerBombPulled:
      return "P/B";
    case ModifierType.GlitchChips:
      return "GC";
    case ModifierType.Moonrocks:
      return "MR";
    default:
      return "?";
  }
}

// Generate display text for an orb (e.g., "B:3", "P:5H:1", "GC:15")
export function get_orb_display_text(orb: Orb): string {
  return orb.modifiers
    .map(
      (modifier: Modifier) =>
        `${get_modifier_initial(modifier.type)}:${modifier.value.value}`,
    )
    .join("");
}

// Get modifier display text for shop item (without colons for shop display)
export function get_modifier_text(item: ShopItem): string {
  return item.orb.modifiers
    .map((mod) => {
      const initial = get_modifier_initial(mod.type);
      return `${initial}${mod.value.value}`;
    })
    .join("");
}

// Get rarity name for shop display
export function get_rarity_name(item: ShopItem): string {
  switch (item.rarity.rarity) {
    case 0:
      return "Common";
    case 1:
      return "Rare";
    case 2:
      return "Cosmic";
    default:
      return "Unknown";
  }
}
