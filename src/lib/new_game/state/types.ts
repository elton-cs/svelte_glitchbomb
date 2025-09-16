export enum GameView {
  Menu,
  Shop,
  Game,
  Win,
  Lose,
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

export interface CategoryInfo {
  initial: string;
  color: string;
}

export const CATEGORY_INFO: Record<OrbCategory, CategoryInfo> = {
  [OrbCategory.Bomb]: { initial: "💣", color: "bg-orange-500" },
  [OrbCategory.Health]: { initial: "❤️", color: "bg-red-500" },
  [OrbCategory.Point]: { initial: "⭐️", color: "bg-green-500" },
  [OrbCategory.Multiplier]: { initial: "⚡️", color: "bg-blue-500" },
  [OrbCategory.Special]: { initial: "👑", color: "bg-yellow-500" },
};

export interface Orb {
  modifiers: Modifier[];
  category: OrbCategory;
}

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
}
