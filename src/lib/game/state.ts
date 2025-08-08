import type { GameState, OrbBag, PlayerStats, MarketplaceState } from './types.js';
import { GAME_CONFIG } from './constants.js';

function createInitialOrbBag(): OrbBag {
  const { startingOrbs } = GAME_CONFIG;
  return {
    health: {
      total: startingOrbs.health,
      available: startingOrbs.health,
    },
    point: {
      total: startingOrbs.point,
      available: startingOrbs.point,
    },
    bomb: {
      total: startingOrbs.bomb,
      available: startingOrbs.bomb,
    },
  };
}

function createInitialPlayerStats(moonrocks: number): PlayerStats {
  return {
    moonrocks,
    cheddah: 0,
    health: GAME_CONFIG.maxHealth,
    points: 0,
  };
}

function createInitialMarketplaceState(): MarketplaceState {
  return {
    available: false,
    healthOrbCost: GAME_CONFIG.orbCosts.health,
    pointOrbCost: GAME_CONFIG.orbCosts.point,
  };
}

export function createInitialGameState(moonrocks: number = GAME_CONFIG.initialMoonrocks): GameState {
  return {
    phase: 'menu',
    currentLevel: 1,
    playerStats: createInitialPlayerStats(moonrocks),
    orbBag: createInitialOrbBag(),
    marketplace: createInitialMarketplaceState(),
    gameStarted: false,
    levelCompleted: false,
  };
}

export function resetLevelStats(state: GameState): void {
  state.playerStats.health = GAME_CONFIG.maxHealth;
  state.playerStats.points = 0;
  
  state.orbBag.health.available = state.orbBag.health.total;
  state.orbBag.point.available = state.orbBag.point.total;
  state.orbBag.bomb.available = state.orbBag.bomb.total;
}

export function resetGameSession(state: GameState, moonrocks: number): void {
  const newState = createInitialGameState(moonrocks);
  Object.assign(state, newState);
}

// Global game state - will be initialized in GameDashboard component
export let gameState: GameState;