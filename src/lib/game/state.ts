import type { GameState, OrbBag, PlayerStats, MarketplaceState, GameLogEntry, PointHistoryEntry } from './types.js';
import { GAME_CONFIG } from './constants.js';
import { createInitialBag } from './orbs.js';
import { initializeShopDeck } from './shopItems.js';

// LocalStorage utilities for glitchbytes persistence
const GLITCHBYTES_STORAGE_KEY = 'glitchbomb_glitchbytes';

export function loadGlitchbytes(): number {
  if (typeof localStorage === 'undefined') return GAME_CONFIG.initialGlitchbytes;
  
  const stored = localStorage.getItem(GLITCHBYTES_STORAGE_KEY);
  if (stored === null) return GAME_CONFIG.initialGlitchbytes;
  
  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? GAME_CONFIG.initialGlitchbytes : parsed;
}

export function saveGlitchbytes(amount: number): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(GLITCHBYTES_STORAGE_KEY, amount.toString());
}

export function claimFreeBytes(currentAmount: number): number {
  if (currentAmount >= 100) return currentAmount;
  
  const newAmount = currentAmount + 1000;
  saveGlitchbytes(newAmount);
  return newAmount;
}

function createInitialOrbBag(): OrbBag {
  return createInitialBag();
}

function createInitialPlayerStats(glitchbytes: number): PlayerStats {
  return {
    glitchbytes,
    bits: 0,
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
    currentShopItems: [],
  };
}

export function createInitialGameState(glitchbytes: number = loadGlitchbytes()): GameState {
  return {
    phase: 'menu',
    currentLevel: 1,
    playerStats: createInitialPlayerStats(glitchbytes),
    orbBag: createInitialOrbBag(),
    marketplace: createInitialMarketplaceState(),
    shopDeck: initializeShopDeck(),
    gameLog: [],
    pointHistory: [],
    gameStarted: false,
    levelCompleted: false,
    committedToNextLevel: false,
  };
}

export function resetLevelStats(state: GameState): void {
  state.playerStats.health = GAME_CONFIG.maxHealth;
  state.playerStats.points = 0;
  state.playerStats.bombsPulledThisLevel = 0;
  state.playerStats.levelMultiplier = 1.0;
}

export function resetGameSession(state: GameState, glitchbytes: number): void {
  const newState = createInitialGameState(glitchbytes);
  Object.assign(state, newState);
}

// Game Log Utility Functions
export function addLogEntry(gameState: GameState, action: string, details?: string): void {
  const timestamp = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const logEntry: GameLogEntry = {
    timestamp,
    action,
    details
  };
  
  gameState.gameLog.push(logEntry);
  
  // Keep only the last 30 log entries to prevent memory issues
  if (gameState.gameLog.length > 30) {
    gameState.gameLog = gameState.gameLog.slice(-30);
  }
}

export function clearGameLog(gameState: GameState): void {
  gameState.gameLog = [];
}

// Point History Utility Functions
export function addPointHistoryEntry(gameState: GameState, points: number, action: string, cumulativeCost: number): void {
  const historyEntry: PointHistoryEntry = {
    timestamp: Date.now(),
    points,
    action,
    cumulativeCost
  };
  
  gameState.pointHistory.push(historyEntry);
  
  // Keep only the last 100 entries to prevent memory issues
  if (gameState.pointHistory.length > 100) {
    gameState.pointHistory = gameState.pointHistory.slice(-100);
  }
}

export function clearPointHistory(gameState: GameState): void {
  gameState.pointHistory = [];
}

// Global game state - will be initialized in GameDashboard component
export let gameState: GameState;