import type { GameState, OrbBag, PlayerStats, MarketplaceState } from './types.js';
import { GAME_CONFIG } from './constants.js';
import { createInitialBag } from './orbs.js';

function createInitialOrbBag(): OrbBag {
  return createInitialBag();
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
}

export function resetGameSession(state: GameState, moonrocks: number): void {
  const newState = createInitialGameState(moonrocks);
  Object.assign(state, newState);
}

// Global game state - will be initialized in GameDashboard component
export let gameState: GameState;