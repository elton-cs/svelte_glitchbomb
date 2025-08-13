export type OrbType = 'health' | 'point' | 'bomb' | 'points_per_anyorb' | 'points_per_bombpulled' | 'multiplier';

export type GamePhase = 'menu' | 'level' | 'marketplace' | 'gameover' | 'victory';

export interface Orb {
  type: OrbType;
  amount: number;
}

export interface OrbBag {
  health: {
    available: Orb[];
    total: Orb[];
  };
  point: {
    available: Orb[];
    total: Orb[];
  };
  bomb: {
    available: Orb[];
    total: Orb[];
  };
  points_per_anyorb: {
    available: Orb[];
    total: Orb[];
  };
  points_per_bombpulled: {
    available: Orb[];
    total: Orb[];
  };
  multiplier: {
    available: Orb[];
    total: Orb[];
  };
}

export interface PlayerStats {
  moonrocks: number;
  cheddah: number;
  health: number;
  points: number;
  bombsPulledThisLevel: number;
  levelMultiplier: number;
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
  currentShopItems: ShopDeckItem[];
}

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  playerStats: PlayerStats;
  orbBag: OrbBag;
  marketplace: MarketplaceState;
  shopDeck: ShopDeck;
  gameLog: GameLog;
  gameStarted: boolean;
  levelCompleted: boolean;
}

export interface ShopItem extends Orb {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export interface ShopDeckItem extends ShopItem {
  baseCost: number;      // Original cost (never changes)
  currentCost: number;   // Current price after increases
  purchaseCount: number; // Total times purchased this game
}

export interface ShopDeck {
  common: ShopDeckItem[];
  rare: ShopDeckItem[];
  cosmic: ShopDeckItem[];
}

export interface GameLogEntry {
  timestamp: string;
  action: string;
  details?: string;
}

export type GameLog = GameLogEntry[];

export interface GameConfig {
  initialMoonrocks: number;
  levelMilestones: number[];
  levelCosts: number[];
  orbCosts: {
    health: number;
    point: number;
  };
  defaultOrbAmounts: {
    health: number;
    point: number;
    bomb: number;
    points_per_anyorb: number;
    points_per_bombpulled: number;
    multiplier: number;
  };
  maxHealth: number;
  startingOrbs: {
    health: number;
    point: number;
    bomb: number;
    points_per_anyorb: number;
    points_per_bombpulled: number;
    multiplier: number;
  };
}