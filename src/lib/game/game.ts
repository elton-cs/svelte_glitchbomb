import { gameState, resetLevelStats } from './state.js';
import { pullRandomOrb, resetConsumedOrbs, addOrbsToBag } from './orbs.js';
import { 
  canAffordGame, 
  canAffordLevel, 
  calculateCashOut, 
  processLevelReward, 
  getLevelEntryCost, 
  calculateVictoryReward 
} from './economics.js';
import { 
  getLevelMilestone, 
  checkLevelComplete, 
  checkGameOver, 
  isLastLevel, 
  getNextLevel 
} from './levels.js';
import { saveMoonrocks } from './persistence.js';
import { GAME_CONFIG } from './constants.js';
import type { OrbType } from './types.js';

export function startNewGame(): boolean {
  if (!canAffordGame(gameState.playerStats.moonrocks)) {
    return false;
  }

  gameState.playerStats.moonrocks -= GAME_CONFIG.gameEntryCost;
  gameState.currentLevel = 1;
  gameState.playerStats.cheddah = 0;
  gameState.gameStarted = true;
  gameState.phase = 'level';
  
  resetLevelStats(gameState);
  saveMoonrocks(gameState.playerStats.moonrocks);
  
  return true;
}

export function enterLevel(level: number): boolean {
  const cost = getLevelEntryCost(level);
  
  if (!canAffordLevel(gameState.playerStats.moonrocks, level)) {
    return false;
  }

  gameState.playerStats.moonrocks -= cost;
  gameState.currentLevel = level;
  gameState.phase = 'level';
  gameState.levelCompleted = false;
  
  resetLevelStats(gameState);
  resetConsumedOrbs(gameState.orbBag);
  saveMoonrocks(gameState.playerStats.moonrocks);
  
  return true;
}

export function pullOrb(): boolean {
  if (gameState.phase !== 'level') {
    return false;
  }

  const orb = pullRandomOrb(gameState.orbBag);
  
  if (!orb) {
    if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
      gameState.phase = 'gameover';
    }
    return false;
  }

  switch (orb.type) {
    case 'health':
      gameState.playerStats.health = Math.min(
        gameState.playerStats.health + orb.effect,
        GAME_CONFIG.maxHealth
      );
      break;
    case 'point':
      gameState.playerStats.points += orb.effect;
      break;
    case 'bomb':
      gameState.playerStats.health += orb.effect;
      break;
  }

  if (checkGameOver(gameState.playerStats.health, gameState.orbBag)) {
    if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
      gameState.phase = 'gameover';
      return true;
    }
  }

  if (checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
    completeLevel();
  }

  return true;
}

export function completeLevel(): void {
  gameState.levelCompleted = true;
  gameState.playerStats.cheddah = processLevelReward(gameState.playerStats.points);

  if (isLastLevel(gameState.currentLevel)) {
    gameState.phase = 'victory';
    gameState.playerStats.moonrocks += calculateVictoryReward();
    saveMoonrocks(gameState.playerStats.moonrocks);
  } else {
    gameState.phase = 'marketplace';
    gameState.marketplace.available = true;
  }
}

export function cashOutMidLevel(): number {
  const levelCost = getLevelEntryCost(gameState.currentLevel);
  const cashOut = calculateCashOut(gameState.playerStats.points, levelCost);
  
  gameState.playerStats.moonrocks += cashOut;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  saveMoonrocks(gameState.playerStats.moonrocks);
  
  return cashOut;
}

export function cashOutPostLevel(): number {
  const points = gameState.playerStats.points;
  gameState.playerStats.moonrocks += points;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  saveMoonrocks(gameState.playerStats.moonrocks);
  
  return points;
}

export function enterMarketplace(): void {
  if (gameState.levelCompleted) {
    gameState.phase = 'marketplace';
    gameState.marketplace.available = true;
  }
}

export function purchaseOrb(type: OrbType, quantity: number = 1): boolean {
  if (gameState.phase !== 'marketplace' || !gameState.marketplace.available) {
    return false;
  }

  if (type === 'bomb') {
    return false;
  }

  const cost = type === 'health' ? 
    gameState.marketplace.healthOrbCost * quantity :
    gameState.marketplace.pointOrbCost * quantity;

  if (gameState.playerStats.cheddah < cost) {
    return false;
  }

  gameState.playerStats.cheddah -= cost;
  addOrbsToBag(gameState.orbBag, type, quantity);
  
  return true;
}

export function proceedToNextLevel(): boolean {
  if (gameState.phase !== 'marketplace') {
    return false;
  }

  const nextLevel = getNextLevel(gameState.currentLevel);
  gameState.playerStats.cheddah = 0;
  gameState.marketplace.available = false;
  
  return enterLevel(nextLevel);
}

export function returnToMenu(): void {
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  gameState.levelCompleted = false;
  gameState.marketplace.available = false;
}