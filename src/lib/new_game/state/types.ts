export enum GameView {
  Menu,
  Shop,
  Game,
  Win,
  Lose,
  Victory,
}

export enum ModifierType {
  Point,
  Health,
  Bomb,
  Multiplier,
  PointsPerAnyOrb,
  PointsPerBombPulled,
  PointsPerPointOrb,
  GlitchChips,
  Moonrocks,
  RewindPoint,
  BombImmunity,
}

export interface BombImmunityEffect {
  is_active: boolean;
  turns_remaining: number;
}

export interface ModifierValue {
  value: number;
}

export interface Modifier {
  type: ModifierType;
  value: ModifierValue;
}

export enum OrbCategory {
  Bomb,
  Health,
  Point,
  Multiplier,
  Special,
}

export enum TailwindColor {
  Orange500 = "bg-orange-500",
  Red500 = "bg-red-500",
  Green500 = "bg-green-500",
  Blue500 = "bg-blue-500",
  Yellow500 = "bg-yellow-500",
  Gray500 = "bg-gray-500",
  Purple500 = "bg-purple-500",
}

export interface CategoryInfo {
  initial: string;
  color: TailwindColor;
}

export const CATEGORY_INFO: Record<OrbCategory, CategoryInfo> = {
  [OrbCategory.Bomb]: { initial: "💣", color: TailwindColor.Orange500 },
  [OrbCategory.Health]: { initial: "❤️", color: TailwindColor.Red500 },
  [OrbCategory.Point]: { initial: "⭐️", color: TailwindColor.Green500 },
  [OrbCategory.Multiplier]: { initial: "⚡️", color: TailwindColor.Blue500 },
  [OrbCategory.Special]: { initial: "👑", color: TailwindColor.Yellow500 },
};

export interface Orb {
  modifiers: Modifier[];
  category: OrbCategory;
}

export enum ShopItemName {
  // Common items (9 total)
  POINT_5_COMMON,
  POINT_7_COMMON,
  GLITCHCHIPS_15_COMMON,
  MOONROCKS_15_COMMON,
  POINTSPERBOMBPULLED_4_COMMON,
  POINTSPERPOINTORB_2_COMMON,
  HEALTH_1_COMMON,
  MULTIPLIER_0_5_COMMON,
  REWINDPOINT_1_COMMON,

  // Rare items (4 total)
  POINT_8_RARE,
  POINT_9_RARE,
  MULTIPLIER_1_0_RARE,
  MULTIPLIER_1_5_RARE,

  // Cosmic items (3 total)
  HEALTH_3_COSMIC,
  MOONROCKS_40_COSMIC,
  BOMBIMMUNITY_3_COSMIC,
}

export interface ShopItem {
  name: ShopItemName;
  orb: Orb;
  rarity: OrbRarity;
  base_price: number;
  purchase_count: number;
  price: number; // Current calculated price
}

export enum RarityType {
  Common,
  Rare,
  Cosmic,
}

export interface OrbRarity {
  rarity: RarityType;
  color: TailwindColor;
}

export const RARITY_INFO: Record<RarityType, OrbRarity> = {
  [RarityType.Common]: {
    rarity: RarityType.Common,
    color: TailwindColor.Gray500,
  },
  [RarityType.Rare]: { rarity: RarityType.Rare, color: TailwindColor.Blue500 },
  [RarityType.Cosmic]: {
    rarity: RarityType.Cosmic,
    color: TailwindColor.Purple500,
  },
};

export interface Game {
  level: number;
  points: number;
  milestone: number;
  health: number;
  max_health: number;
  multiplier: number;
  glitchchips: number;
  starting_orbs: Orb[];
  purchased_orbs: Orb[];
  playground_orbs: Orb[];
  pulled_orbs: Orb[];
  shop_items: ShopItem[];
  bomb_immunity_effect: BombImmunityEffect;
}

export interface Player {
  moonrocks: number;
}
