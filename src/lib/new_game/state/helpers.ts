import {
  ModifierType,
  OrbCategory,
  RarityType,
  RARITY_INFO,
  ShopItemName,
  type Orb,
  type Modifier,
  type Game,
  type ShopItem,
  type Player,
  type BombImmunityEffect,
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

// Calculate current price with 20% increase per purchase (rounded up)
export function calculate_current_price(base_price: number, purchase_count: number): number {
  return Math.ceil(base_price * Math.pow(1.2, purchase_count));
}

// Helper to create a shop item with all needed parameters
function build_shop_item(
  name: ShopItemName,
  modifier_type: ModifierType,
  modifier_value: number,
  orb_category: OrbCategory,
  rarity_type: RarityType,
  base_price: number,
  purchase_count: number = 0,
): ShopItem {
  return {
    name,
    orb: create_orb(
      [create_modifier(modifier_type, modifier_value)],
      orb_category,
    ),
    rarity: RARITY_INFO[rarity_type],
    base_price,
    purchase_count,
    price: calculate_current_price(base_price, purchase_count),
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

// Common shop items pool (9 items, select 3)
const COMMON_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(
    ShopItemName.POINT_5_COMMON,
    ModifierType.Point,
    5,
    OrbCategory.Point,
    RarityType.Common,
    5,
  ),
  build_shop_item(
    ShopItemName.POINT_7_COMMON,
    ModifierType.Point,
    7,
    OrbCategory.Point,
    RarityType.Common,
    8,
  ),
  build_shop_item(
    ShopItemName.GLITCHCHIPS_15_COMMON,
    ModifierType.GlitchChips,
    15,
    OrbCategory.Special,
    RarityType.Common,
    5,
  ),
  build_shop_item(
    ShopItemName.MOONROCKS_15_COMMON,
    ModifierType.Moonrocks,
    15,
    OrbCategory.Special,
    RarityType.Common,
    8,
  ),
  build_shop_item(
    ShopItemName.POINTSPERBOMBPULLED_4_COMMON,
    ModifierType.PointsPerBombPulled,
    4,
    OrbCategory.Special,
    RarityType.Common,
    6,
  ),
  build_shop_item(
    ShopItemName.POINTSPERPOINTORB_2_COMMON,
    ModifierType.PointsPerPointOrb,
    2,
    OrbCategory.Point,
    RarityType.Common,
    9,
  ),
  build_shop_item(
    ShopItemName.HEALTH_1_COMMON,
    ModifierType.Health,
    1,
    OrbCategory.Health,
    RarityType.Common,
    9,
  ),
  build_shop_item(
    ShopItemName.MULTIPLIER_0_5_COMMON,
    ModifierType.Multiplier,
    0.5,
    OrbCategory.Multiplier,
    RarityType.Common,
    9,
  ),
  build_shop_item(
    ShopItemName.REWINDPOINT_1_COMMON,
    ModifierType.RewindPoint,
    1,
    OrbCategory.Special,
    RarityType.Common,
    8,
  ),
];

// Rare shop items pool (4 items, select 2)
const RARE_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(
    ShopItemName.POINT_8_RARE,
    ModifierType.Point,
    8,
    OrbCategory.Point,
    RarityType.Rare,
    11,
  ),
  build_shop_item(
    ShopItemName.POINT_9_RARE,
    ModifierType.Point,
    9,
    OrbCategory.Point,
    RarityType.Rare,
    13,
  ),
  build_shop_item(
    ShopItemName.MULTIPLIER_1_0_RARE,
    ModifierType.Multiplier,
    1.0,
    OrbCategory.Multiplier,
    RarityType.Rare,
    14,
  ),
  build_shop_item(
    ShopItemName.MULTIPLIER_1_5_RARE,
    ModifierType.Multiplier,
    1.5,
    OrbCategory.Multiplier,
    RarityType.Rare,
    16,
  ),
];

// Cosmic shop items pool (3 items, select 1)
const COSMIC_SHOP_ITEMS: ShopItem[] = [
  build_shop_item(
    ShopItemName.HEALTH_3_COSMIC,
    ModifierType.Health,
    3,
    OrbCategory.Health,
    RarityType.Cosmic,
    21,
  ),
  build_shop_item(
    ShopItemName.MOONROCKS_40_COSMIC,
    ModifierType.Moonrocks,
    40,
    OrbCategory.Special,
    RarityType.Cosmic,
    23,
  ),
  build_shop_item(
    ShopItemName.BOMBIMMUNITY_3_COSMIC,
    ModifierType.BombImmunity,
    3,
    OrbCategory.Special,
    RarityType.Cosmic,
    24,
  ),
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
function generate_shop_items(existing_shop_items: ShopItem[] = []): ShopItem[] {
  // Create a map of existing purchase counts by item name
  const purchase_counts_map = new Map<ShopItemName, number>();
  for (const item of existing_shop_items) {
    purchase_counts_map.set(item.name, item.purchase_count);
  }

  const selected_items: ShopItem[] = [];

  // Helper function to apply existing purchase count to a shop item
  const apply_purchase_count = (item: ShopItem): ShopItem => {
    const existing_count = purchase_counts_map.get(item.name) || 0;
    return build_shop_item(
      item.name,
      item.orb.modifiers[0].type,
      item.orb.modifiers[0].value.value,
      item.orb.category,
      item.rarity.rarity,
      item.base_price,
      existing_count
    );
  };

  // Select 3 random common items
  const shuffled_common = shuffle_array(COMMON_SHOP_ITEMS);
  selected_items.push(...shuffled_common.slice(0, 3).map(apply_purchase_count));

  // Select 2 random rare items
  const shuffled_rare = shuffle_array(RARE_SHOP_ITEMS);
  selected_items.push(...shuffled_rare.slice(0, 2).map(apply_purchase_count));

  // Select 1 random cosmic item
  const shuffled_cosmic = shuffle_array(COSMIC_SHOP_ITEMS);
  selected_items.push(...shuffled_cosmic.slice(0, 1).map(apply_purchase_count));

  return selected_items;
}

// Initialize a new game with all default values
export function init_game(
  level: number = 1,
  existing_purchased_orbs: Orb[] = [],
  existing_chips: number = 0,
  existing_shop_items: ShopItem[] = [],
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
    bomb_immunity_effect: { is_active: false, turns_remaining: 0 },
    starting_orbs,
    purchased_orbs,
    playground_orbs,
    pulled_orbs: [],
    shop_items: generate_shop_items(existing_shop_items),
  };
}

// Apply orb effects to game state
export function apply_orb(game: Game, orb: Orb, player: Player): void {
  for (const modifier of orb.modifiers) {
    switch (modifier.type) {
      case ModifierType.Bomb:
        // Check for bomb immunity
        if (
          game.bomb_immunity_effect.is_active &&
          game.bomb_immunity_effect.turns_remaining > 0
        ) {
          // Bomb is blocked by immunity - return it to the bag
          game.playground_orbs.push(orb);
        } else {
          // No immunity - bomb deals damage (reduce health, minimum 0)
          game.health = Math.max(0, game.health - modifier.value.value);
        }
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
        game.points += Math.floor(multiplied_points);
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
        game.points += Math.floor(multiplied_points_awarded);
        break;

      case ModifierType.PointsPerBombPulled:
        // Points per bomb pulled - multiply modifier value by number of previously pulled bomb orbs
        const bombs_pulled = game.pulled_orbs.filter((pulled_orb) =>
          pulled_orb.modifiers.some((mod) => mod.type === ModifierType.Bomb),
        ).length;
        const base_bomb_points = modifier.value.value * bombs_pulled;
        const multiplied_bomb_points = base_bomb_points * game.multiplier;
        game.points += Math.floor(multiplied_bomb_points);
        break;

      case ModifierType.PointsPerPointOrb:
        // Points per point orb - multiply modifier value by number of point orbs in bag
        const all_orbs_in_bag = [...game.starting_orbs, ...game.purchased_orbs];
        const point_orbs_count = all_orbs_in_bag.filter((orb) =>
          orb.modifiers.some((mod) => mod.type === ModifierType.Point),
        ).length;
        const base_point_orb_points = modifier.value.value * point_orbs_count;
        const multiplied_point_orb_points =
          base_point_orb_points * game.multiplier;
        game.points += Math.floor(multiplied_point_orb_points);
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

      case ModifierType.RewindPoint:
        // RewindPoint returns the lowest-value point orb back to the bag
        // Find all pulled orbs that have a Point modifier
        const point_orbs_with_values = game.pulled_orbs
          .map((orb, index) => {
            const point_modifier = orb.modifiers.find(
              (mod) => mod.type === ModifierType.Point,
            );
            if (point_modifier) {
              return { orb, value: point_modifier.value.value, index };
            }
            return null;
          })
          .filter((item) => item !== null);

        // If there are any point orbs, find the one with the lowest value
        if (point_orbs_with_values.length > 0) {
          const lowest_point_orb = point_orbs_with_values.reduce((min, curr) =>
            curr.value < min.value ? curr : min,
          );

          // Add the lowest point orb back to the playground
          game.playground_orbs.push(lowest_point_orb.orb);
        }
        break;

      case ModifierType.BombImmunity:
        // Activate bomb immunity with stacking
        activate_bomb_immunity(game.bomb_immunity_effect, modifier.value.value);
        break;
    }
  }

  // Award chips if player reaches milestone (wins the game)
  if (game.points >= game.milestone) {
    const chips_earned = Math.floor(game.points);
    game.glitchchips += chips_earned;
  }

  // Decrement bomb immunity at the end of every turn (if active)
  if (game.bomb_immunity_effect.is_active) {
    game.bomb_immunity_effect.turns_remaining--;
    if (game.bomb_immunity_effect.turns_remaining === 0) {
      game.bomb_immunity_effect.is_active = false;
    }
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

  // Increment purchase count and recalculate price
  item.purchase_count += 1;
  item.price = calculate_current_price(item.base_price, item.purchase_count);

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
  return init_game(next_level, game.purchased_orbs, game.glitchchips, game.shop_items);
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

// Helper function for bomb immunity activation
function activate_bomb_immunity(
  effect: BombImmunityEffect,
  mod_value: number,
): void {
  effect.is_active = true;
  effect.turns_remaining = effect.turns_remaining + mod_value + 1; // Stack with existing + 1 for current turn
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
    case ModifierType.PointsPerPointOrb:
      return "P/P";
    case ModifierType.GlitchChips:
      return "GC";
    case ModifierType.Moonrocks:
      return "MR";
    case ModifierType.RewindPoint:
      return "RP";
    case ModifierType.BombImmunity:
      return "BI";
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

// Orb display interface for shop UI
export interface OrbDisplay {
  text: string;
  icon: string;
  color: string;
  border_color: string;
  is_chip_orb?: boolean;
}

// Get tier border color based on rarity
export function get_tier_border_color(rarity_type: RarityType): string {
  switch (rarity_type) {
    case RarityType.Common:
      return 'border-gray-400';
    case RarityType.Rare:
      return 'border-blue-500';
    case RarityType.Cosmic:
      return 'border-purple-500';
    default:
      return 'border-white';
  }
}

// Get orb display information for shop items
export function get_orb_display(item: ShopItem): OrbDisplay {
  const modifier = item.orb.modifiers[0]; // Shop items have single modifiers
  const modifier_type = modifier.type;
  const amount = modifier.value.value;

  switch (modifier_type) {
    case ModifierType.Point:
    case ModifierType.PointsPerAnyOrb:
    case ModifierType.PointsPerBombPulled:
    case ModifierType.PointsPerPointOrb:
      // All points-related orbs use the POINTS category emoji and color
      let text = amount.toString();
      if (modifier_type === ModifierType.PointsPerAnyOrb) text = `${amount}/RC`;
      if (modifier_type === ModifierType.PointsPerBombPulled) text = `${amount}/B`;
      if (modifier_type === ModifierType.PointsPerPointOrb) text = `${amount}/P`;
      return {
        text,
        icon: '⭐️',
        color: 'text-green-400',
        border_color: 'border-green-400'
      };

    case ModifierType.Multiplier:
      return {
        text: amount.toString(),
        icon: '⚡️',
        color: 'text-blue-400',
        border_color: 'border-blue-400'
      };

    case ModifierType.Health:
      return {
        text: amount.toString(),
        icon: '❤️',
        color: 'text-red-500',
        border_color: 'border-red-500'
      };

    case ModifierType.Bomb:
      return {
        text: amount.toString(),
        icon: '💣',
        color: 'text-orange-500',
        border_color: 'border-orange-500'
      };

    case ModifierType.GlitchChips:
      return {
        text: amount.toString(),
        icon: '👑',
        color: 'text-yellow-400',
        border_color: 'border-yellow-400',
        is_chip_orb: true
      };

    case ModifierType.Moonrocks:
      return {
        text: `${amount}🌙`,
        icon: '👑',
        color: 'text-yellow-400',
        border_color: 'border-yellow-400'
      };

    case ModifierType.RewindPoint:
      return {
        text: amount.toString(),
        icon: '👑',
        color: 'text-yellow-400',
        border_color: 'border-yellow-400'
      };

    case ModifierType.BombImmunity:
      return {
        text: amount.toString(),
        icon: '👑',
        color: 'text-yellow-400',
        border_color: 'border-yellow-400'
      };

    default:
      return {
        text: amount.toString(),
        icon: '?',
        color: 'text-white',
        border_color: 'border-white'
      };
  }
}
