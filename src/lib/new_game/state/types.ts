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

export interface Orb {
  modifiers: Modifier[];
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
