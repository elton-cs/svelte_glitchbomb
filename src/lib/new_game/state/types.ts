export enum GameView {
  Menu,
  Shop,
  Game,
  Win,
  Lose,
}

export interface Game {
  level: number;
  points: number;
  milestone: number;
  health: number;
  multiplier: number;
  chips: number;
}
