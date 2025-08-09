import type { GameState, OrbBag, PlayerStats, MarketplaceState } from './types.js';
import { GAME_CONFIG } from './constants.js';
import { createInitialBag } from './orbs.js';

// LocalStorage utilities for moonrocks persistence
const MOONROCKS_STORAGE_KEY = 'glitchbomb_moonrocks';

export function loadMoonrocks(): number {
  if (typeof localStorage === 'undefined') return GAME_CONFIG.initialMoonrocks;
  
  const stored = localStorage.getItem(MOONROCKS_STORAGE_KEY);
  if (stored === null) return GAME_CONFIG.initialMoonrocks;
  
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? GAME_CONFIG.initialMoonrocks : parsed;
}

export function saveMoonrocks(amount: number): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(MOONROCKS_STORAGE_KEY, amount.toString());
}

export function claimFreeRocks(currentAmount: number): number {
  if (currentAmount >= 100) return currentAmount;
  
  const newAmount = currentAmount + 1000;
  saveMoonrocks(newAmount);
  return newAmount;
}

function createInitialOrbBag(): OrbBag {
  return createInitialBag();
}

function createInitialPlayerStats(moonrocks: number): PlayerStats {
  return {
    moonrocks,
    cheddah: 0,
    health: GAME_CONFIG.maxHealth,
    points: 0,
    bombsPulledThisLevel: 0,
    levelMultiplier: 1.0,
  };
}

function createInitialMarketplaceState(): MarketplaceState {
  return {
    available: false,
    healthOrbCost: GAME_CONFIG.orbCosts.health,
    pointOrbCost: GAME_CONFIG.orbCosts.point,
    purchaseCounts: {
      health: 0,
      point: 0,
      bomb: 0,
      points_per_anyorb: 0,
      points_per_bombpulled: 0,
      multiplier: 0,
    },
  };
}

export function createInitialGameState(moonrocks: number = loadMoonrocks()): GameState {
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
  state.playerStats.bombsPulledThisLevel = 0;
  state.playerStats.levelMultiplier = 1.0;
}

export function resetGameSession(state: GameState, moonrocks: number): void {
  const newState = createInitialGameState(moonrocks);
  Object.assign(state, newState);
}

// Global game state - will be initialized in GameDashboard component
export let gameState: GameState;