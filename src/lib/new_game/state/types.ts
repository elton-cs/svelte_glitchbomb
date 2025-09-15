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
}
