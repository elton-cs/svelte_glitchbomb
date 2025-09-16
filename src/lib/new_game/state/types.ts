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

export interface ShopItem {
  orb: Orb;
  rarity: OrbRarity;
  price: number;
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
  chips: number;
  starting_orbs: Orb[];
  purchased_orbs: Orb[];
  playground_orbs: Orb[];
  pulled_orbs: Orb[];
  shop_items: ShopItem[];
}

export interface Player {
  moonrocks: number;
}
