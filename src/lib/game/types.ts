export type OrbType = 'health' | 'point' | 'bomb';

export type GamePhase = 'menu' | 'level' | 'marketplace' | 'gameover' | 'victory';

export interface Orb {
  type: OrbType;
  effect: number;
}

export interface OrbBag {
  health: {
    total: number;
    available: number;
  };
  point: {
    total: number;
    available: number;
  };
  bomb: {
    total: number;
    available: number;
  };
}

export interface PlayerStats {
  moonrocks: number;
  cheddah: number;
  health: number;
  points: number;
}

export interface LevelConfig {
  level: number;
  milestone: number;
  cost: number;
}

export interface MarketplaceState {
  available: boolean;
  healthOrbCost: number;
  pointOrbCost: number;
}

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  playerStats: PlayerStats;
  orbBag: OrbBag;
  marketplace: MarketplaceState;
  gameStarted: boolean;
  levelCompleted: boolean;
}

export interface GameConfig {
  initialMoonrocks: number;
  levelMilestones: number[];
  levelCosts: number[];
  orbCosts: {
    health: number;
    point: number;
  };
  orbEffects: {
    health: number;
    point: number;
    bomb: number;
  };
  victoryReward: number;
  maxHealth: number;
  startingOrbs: {
    health: number;
    point: number;
    bomb: number;
  };
}