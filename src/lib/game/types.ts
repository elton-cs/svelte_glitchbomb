export type OrbType = 'health' | 'point' | 'bomb' | 'points_per_anyorb' | 'points_per_bombpulled' | 'multiplier' | 'bits' | 'glitchbytes';

export type GamePhase = 'menu' | 'level' | 'confirmation' | 'marketplace' | 'gameover' | 'victory';

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
  bits: {
    available: Orb[];
    total: Orb[];
  };
  glitchbytes: {
    available: Orb[];
    total: Orb[];
  };
}

export interface PlayerStats {
  glitchbytes: number;
  chips: number;
  health: number;
  points: number;
  bombsPulledThisLevel: number;
  levelMultiplier: number;
}

export interface PointHistoryEntry {
  timestamp: number;
  points: number;
  action: string;
  cumulativeCost: number;
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
  pointHistory: PointHistoryEntry[];
  gameStarted: boolean;
  levelCompleted: boolean;
  committedToNextLevel: boolean;
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

// Structured log entry types for robust logging
export type LogActionType = 
  | 'orb_pulled'
  | 'shop_purchase' 
  | 'level_change'
  | 'points_conversion'
  | 'game_event'
  | 'system';

export interface BaseLogEntry {
  timestamp: string;
  type: LogActionType;
}

export interface OrbPullLogEntry extends BaseLogEntry {
  type: 'orb_pulled';
  data: {
    orbType: OrbType;
    amount: number;
    effect: {
      health?: number;
      points?: number;
      basePoints?: number;
      appliedMultiplier?: number;
      multiplier?: number;
      chips?: number;
      glitchbytes?: number;
      bombDamage?: number;
      bombsPulled?: number;
      orbsConsumed?: number;
    };
    resultingStats: {
      health: number;
      points: number;
      multiplier: number;
      chips: number;
      glitchbytes: number;
    };
  };
}

export interface ShopPurchaseLogEntry extends BaseLogEntry {
  type: 'shop_purchase';
  data: {
    itemName: string;
    itemId: string;
    cost: number;
    remainingChips: number;
  };
}

export interface LevelChangeLogEntry extends BaseLogEntry {
  type: 'level_change';
  data: {
    fromLevel: number;
    toLevel: number;
    cost?: number;
    reward?: number;
    reason: 'advance' | 'complete' | 'victory' | 'skip';
  };
}

export interface PointsConversionLogEntry extends BaseLogEntry {
  type: 'points_conversion';
  data: {
    pointsConverted: number;
    chipsGained: number;
    totalChips: number;
    conversionType: 'manual' | 'level_end' | 'cash_out';
  };
}

export interface GameEventLogEntry extends BaseLogEntry {
  type: 'game_event';
  data: {
    event: 'game_start' | 'game_over' | 'return_to_menu' | 'cash_out';
    details?: {
      glitchbytesEarned?: number;
      finalPoints?: number;
      reason?: string;
    };
  };
}

export interface SystemLogEntry extends BaseLogEntry {
  type: 'system';
  data: {
    message: string;
    level?: 'debug' | 'info' | 'warning' | 'error';
  };
}

export type GameLogEntry = 
  | OrbPullLogEntry 
  | ShopPurchaseLogEntry 
  | LevelChangeLogEntry 
  | PointsConversionLogEntry 
  | GameEventLogEntry
  | SystemLogEntry;

export type GameLog = GameLogEntry[];

export interface GameConfig {
  initialGlitchbytes: number;
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
    bits: number;
    glitchbytes: number;
  };
  maxHealth: number;
  startingOrbs: {
    health: number;
    point: number;
    bomb: number;
    points_per_anyorb: number;
    points_per_bombpulled: number;
    multiplier: number;
    bits: number;
    glitchbytes: number;
  };
}