import { resetLevelStats } from './state.js';
import type { GameState } from './types.js';
import { pullRandomOrb, resetConsumedOrbs, addOrbsToBag, calculatePointsPerAnyOrbPoints, createInitialBag } from './orbs.js';
import { 
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
import { GAME_CONFIG } from './constants.js';
import type { OrbType } from './types.js';
import { getShopItem, getAvailableShopItems } from './shopItems.js';

function applyPointsWithMultiplier(gameState: GameState, basePoints: number): void {
  const multipliedPoints = Math.floor(basePoints * gameState.playerStats.levelMultiplier);
  gameState.playerStats.points += multipliedPoints;
}

export function startNewGame(gameState: GameState): boolean {
  try {
    return enterLevel(gameState, 1);
  } catch (error) {
    console.error('Error starting new game:', error);
    return false;
  }
}

export function enterLevel(gameState: GameState, level: number): boolean {
  try {
    if (level < 1 || level > 5) {
      console.warn('Invalid level:', level);
      return false;
    }

    const cost = getLevelEntryCost(level);
    
    if (!canAffordLevel(gameState.playerStats.moonrocks, level)) {
      console.warn('Cannot afford level', level, 'cost:', cost);
      return false;
    }

    gameState.playerStats.moonrocks -= cost;
    gameState.currentLevel = level;
    gameState.phase = 'level';
    gameState.levelCompleted = false;
    gameState.gameStarted = true;
    gameState.playerStats.cheddah = 0;
    
    resetLevelStats(gameState);
    
    // Only reset consumed orbs when starting a new game (level 1)
    if (level === 1) {
      resetConsumedOrbs(gameState.orbBag);
    }
    
    return true;
  } catch (error) {
    console.error('Error entering level:', error);
    return false;
  }
}

export function pullOrb(gameState: GameState): boolean {
  try {
    if (gameState.phase !== 'level') {
      console.warn('Cannot pull orb - not in level phase');
      return false;
    }

    const orb = pullRandomOrb(gameState.orbBag);
    
    if (!orb) {
      console.log('No more orbs available');
      if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
        gameState.phase = 'gameover';
      }
      return false;
    }

    switch (orb.type) {
      case 'health':
        gameState.playerStats.health = Math.min(
          gameState.playerStats.health + orb.amount,
          GAME_CONFIG.maxHealth
        );
        break;
      case 'point':
        applyPointsWithMultiplier(gameState, orb.amount);
        break;
      case 'bomb':
        gameState.playerStats.health = Math.max(0, gameState.playerStats.health - orb.amount);
        gameState.playerStats.bombsPulledThisLevel += 1;
        break;
      case 'points_per_anyorb':
        const pointsPerAnyOrbPoints = calculatePointsPerAnyOrbPoints(gameState.orbBag, orb.amount);
        applyPointsWithMultiplier(gameState, pointsPerAnyOrbPoints);
        break;
      case 'points_per_bombpulled':
        const bombPoints = gameState.playerStats.bombsPulledThisLevel * orb.amount;
        applyPointsWithMultiplier(gameState, bombPoints);
        break;
      case 'multiplier':
        gameState.playerStats.levelMultiplier += orb.amount;
        break;
    }

    if (checkGameOver(gameState.playerStats.health, gameState.orbBag)) {
      if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
        gameState.phase = 'gameover';
        return true;
      }
    }

    if (checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
      completeLevel(gameState);
    }

    return true;
  } catch (error) {
    console.error('Error pulling orb:', error);
    return false;
  }
}

export function completeLevel(gameState: GameState): void {
  gameState.levelCompleted = true;
  gameState.playerStats.cheddah = processLevelReward(gameState.playerStats.points);

  if (isLastLevel(gameState.currentLevel)) {
    gameState.phase = 'victory';
    gameState.playerStats.moonrocks += calculateVictoryReward(gameState.playerStats.points);
  } else {
    gameState.phase = 'marketplace';
    gameState.marketplace.available = true;
    gameState.marketplace.currentShopItems = getAvailableShopItems(gameState.currentLevel);
    // Reset consumed orbs so players can see their full collection in marketplace
    resetConsumedOrbs(gameState.orbBag);
  }
}

export function cashOutMidLevel(gameState: GameState): number {
  const levelCost = getLevelEntryCost(gameState.currentLevel);
  const cashOut = calculateCashOut(gameState.playerStats.points, levelCost);
  
  gameState.playerStats.moonrocks += cashOut;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
  
  return cashOut;
}

export function cashOutPostLevel(gameState: GameState): number {
  const points = gameState.playerStats.points;
  gameState.playerStats.moonrocks += points;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
  
  return points;
}

export function enterMarketplace(gameState: GameState): void {
  if (gameState.levelCompleted) {
    gameState.phase = 'marketplace';
    gameState.marketplace.available = true;
    gameState.marketplace.currentShopItems = getAvailableShopItems(gameState.currentLevel);
  }
}

export function purchaseOrb(gameState: GameState, type: OrbType, quantity: number = 1): boolean {
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

export function purchaseShopItem(gameState: GameState, shopItemId: string, quantity: number = 1): boolean {
  if (gameState.phase !== 'marketplace' || !gameState.marketplace.available) {
    return false;
  }

  const shopItem = getShopItem(shopItemId);
  
  if (!shopItem) {
    return false;
  }

  const totalCost = shopItem.cost * quantity;
  
  if (gameState.playerStats.cheddah < totalCost) {
    return false;
  }

  gameState.playerStats.cheddah -= totalCost;
  addOrbsToBag(gameState.orbBag, shopItem.type, quantity, shopItem.amount);
  
  return true;
}

export function proceedToNextLevel(gameState: GameState): boolean {
  if (gameState.phase !== 'marketplace') {
    return false;
  }

  const nextLevel = getNextLevel(gameState.currentLevel);
  gameState.playerStats.cheddah = 0;
  gameState.marketplace.available = false;
  
  return enterLevel(gameState, nextLevel);
}

export function returnToMenu(gameState: GameState): void {
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  gameState.levelCompleted = false;
  gameState.marketplace.available = false;
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
}