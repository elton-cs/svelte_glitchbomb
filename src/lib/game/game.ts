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
import { GAME_CONFIG, LEVEL_COUNT } from './constants.js';
import type { OrbType } from './types.js';
import { getShopItem, getAvailableShopItemsFromDeck, findDeckItem, updateDeckItemPrice, initializeShopDeck } from './shopItems.js';
import { addLogEntry, clearGameLog, addPointHistoryEntry, clearPointHistory } from './state.js';
import { getCumulativeLevelCost } from './economics.js';

function applyPointsWithMultiplier(gameState: GameState, basePoints: number, action: string = 'Points gained'): void {
  const multipliedPoints = Math.floor(basePoints * gameState.playerStats.levelMultiplier);
  gameState.playerStats.points += multipliedPoints;
  const cumulativeCost = getCumulativeLevelCost(gameState.currentLevel);
  addPointHistoryEntry(gameState, gameState.playerStats.points, action, cumulativeCost);
}

export function startNewGame(gameState: GameState): boolean {
  try {
    // Clear game log for new session
    clearGameLog(gameState);
    
    // Clear point history for new session
    clearPointHistory(gameState);
    
    // Add initial point history entry
    addPointHistoryEntry(gameState, 0, 'Game started', getCumulativeLevelCost(1));
    
    // Reset shop deck to initial prices (new game session)
    gameState.shopDeck = initializeShopDeck();
    
    const success = enterLevel(gameState, 1);
    if (success) {
      addLogEntry(gameState, 'Game started');
    }
    return success;
  } catch (error) {
    console.error('Error starting new game:', error);
    return false;
  }
}

export function enterLevel(gameState: GameState, level: number): boolean {
  try {
    if (level < 1 || level > LEVEL_COUNT) {
      console.warn('Invalid level:', level);
      return false;
    }

    const cost = getLevelEntryCost(level);
    
    if (!canAffordLevel(gameState.playerStats.glitchbytes, level)) {
      console.warn('Cannot afford level', level, 'cost:', cost);
      return false;
    }

    gameState.playerStats.glitchbytes -= cost;
    gameState.currentLevel = level;
    gameState.phase = 'level';
    gameState.levelCompleted = false;
    gameState.gameStarted = true;
    
    resetLevelStats(gameState);
    
    // Only reset consumed orbs and cheddah when starting a new game (level 1)
    if (level === 1) {
      resetConsumedOrbs(gameState.orbBag);
      gameState.playerStats.bits = 0;
    }
    
    // Track P/L change from entering new level (points reset to 0, moonrocks spent)
    if (level > 1) {
      addPointHistoryEntry(gameState, 0, `Entered Level ${level} (-${cost} glitchbytes)`, getCumulativeLevelCost(level));
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
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Health orb (+${orb.amount} HP)`, getCumulativeLevelCost(gameState.currentLevel));
        addLogEntry(gameState, `Pulled health orb (+${orb.amount} HP)`);
        break;
      case 'point':
        applyPointsWithMultiplier(gameState, orb.amount, `Point orb (+${orb.amount})`);
        addLogEntry(gameState, `Pulled point orb (+${orb.amount} points)`);
        break;
      case 'bomb':
        gameState.playerStats.health = Math.max(0, gameState.playerStats.health - orb.amount);
        gameState.playerStats.bombsPulledThisLevel += 1;
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Bomb orb (-${orb.amount} HP)`, getCumulativeLevelCost(gameState.currentLevel));
        addLogEntry(gameState, `Pulled bomb orb (-${orb.amount} HP)`);
        break;
      case 'points_per_anyorb':
        const pointsPerAnyOrbPoints = calculatePointsPerAnyOrbPoints(gameState.orbBag, orb.amount);
        applyPointsWithMultiplier(gameState, pointsPerAnyOrbPoints, `Combo orb (+${pointsPerAnyOrbPoints})`);
        addLogEntry(gameState, `Pulled combo orb (+${pointsPerAnyOrbPoints} points from ${orb.amount} per orb)`);
        break;
      case 'points_per_bombpulled':
        const bombPoints = gameState.playerStats.bombsPulledThisLevel * orb.amount;
        applyPointsWithMultiplier(gameState, bombPoints, `Danger orb (+${bombPoints})`);
        addLogEntry(gameState, `Pulled danger orb (+${bombPoints} points from ${orb.amount} per bomb)`);
        break;
      case 'multiplier':
        gameState.playerStats.levelMultiplier += orb.amount;
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Multiplier orb (+${orb.amount}x)`, getCumulativeLevelCost(gameState.currentLevel));
        addLogEntry(gameState, `Pulled multiplier orb (+${orb.amount}x boost)`);
        break;
      case 'bits':
        gameState.playerStats.bits += orb.amount;
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Bits orb (+${orb.amount})`, getCumulativeLevelCost(gameState.currentLevel));
        addLogEntry(gameState, `Pulled bits orb (+${orb.amount} bits)`);
        break;
      case 'glitchbytes':
        gameState.playerStats.glitchbytes += orb.amount;
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Glitchbytes orb (+${orb.amount})`, getCumulativeLevelCost(gameState.currentLevel));
        addLogEntry(gameState, `Pulled glitchbytes orb (+${orb.amount} glitchbytes)`);
        break;
    }

    if (checkGameOver(gameState.playerStats.health, gameState.orbBag)) {
      if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
        gameState.phase = 'gameover';
        addLogEntry(gameState, 'Game over! No health or orbs remaining');
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

  if (isLastLevel(gameState.currentLevel)) {
    gameState.phase = 'victory';
    const victoryReward = calculateVictoryReward(gameState.playerStats.points);
    gameState.playerStats.glitchbytes += victoryReward;
    addLogEntry(gameState, `Victory! Level ${gameState.currentLevel} completed (+${victoryReward} glitchbytes)`);
  } else {
    gameState.phase = 'confirmation';
    gameState.marketplace.available = false;
    gameState.marketplace.currentShopItems = [];
    addLogEntry(gameState, `Level ${gameState.currentLevel} completed! Choose: cash out or continue?`);
  }
}

export function cashOutMidLevel(gameState: GameState): number {
  const cashOut = gameState.playerStats.points;
  
  gameState.playerStats.glitchbytes += cashOut;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  
  addLogEntry(gameState, `Cashed out mid-level: ${gameState.playerStats.points} points for ${cashOut} glitchbytes`);
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
  
  // Reset shop deck to initial prices (new game session)
  gameState.shopDeck = initializeShopDeck();
  
  // Reset commitment flag
  gameState.committedToNextLevel = false;
  
  return cashOut;
}

export function cashOutPostLevel(gameState: GameState): number {
  const points = gameState.playerStats.points;
  gameState.playerStats.glitchbytes += points;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  
  addLogEntry(gameState, `Cashed out post-level: ${points} points for ${points} glitchbytes`);
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
  
  // Reset shop deck to initial prices (new game session)
  gameState.shopDeck = initializeShopDeck();
  
  // Reset commitment flag
  gameState.committedToNextLevel = false;
  
  return points;
}

export function enterMarketplace(gameState: GameState): void {
  if (gameState.levelCompleted) {
    gameState.phase = 'marketplace';
    gameState.marketplace.available = true;
    gameState.marketplace.currentShopItems = getAvailableShopItemsFromDeck(gameState.shopDeck, gameState.currentLevel);
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

  if (gameState.playerStats.bits < cost) {
    return false;
  }

  gameState.playerStats.bits -= cost;
  addOrbsToBag(gameState.orbBag, type, quantity);
  
  return true;
}

export function purchaseShopItem(gameState: GameState, shopItemId: string, quantity: number = 1): boolean {
  if (gameState.phase !== 'marketplace' || !gameState.marketplace.available) {
    return false;
  }

  const deckItem = findDeckItem(gameState.shopDeck, shopItemId);
  
  if (!deckItem) {
    return false;
  }

  const totalCost = deckItem.currentCost * quantity;
  
  if (gameState.playerStats.bits < totalCost) {
    return false;
  }

  gameState.playerStats.bits -= totalCost;
  addOrbsToBag(gameState.orbBag, deckItem.type, quantity, deckItem.amount);
  
  addLogEntry(gameState, `Bought ${deckItem.name} for ${totalCost} bits`);
  
  // Update deck item price for future purchases
  for (let i = 0; i < quantity; i++) {
    updateDeckItemPrice(deckItem);
  }
  
  return true;
}

export function continueToMarketplace(gameState: GameState): void {
  gameState.phase = 'marketplace';
  gameState.committedToNextLevel = true;
  const newBits = processLevelReward(gameState.playerStats.points);
  gameState.playerStats.bits += newBits;
  gameState.marketplace.available = true;
  gameState.marketplace.currentShopItems = getAvailableShopItemsFromDeck(gameState.shopDeck, gameState.currentLevel);
  
  // Reset consumed orbs so players can purchase more orbs with their cheddah
  resetConsumedOrbs(gameState.orbBag);
  
  addLogEntry(gameState, `Converted ${gameState.playerStats.points} points to ${newBits} bits (+${newBits} total: ${gameState.playerStats.bits})`);
}

export function proceedToNextLevel(gameState: GameState): boolean {
  if (gameState.phase !== 'marketplace') {
    return false;
  }

  const nextLevel = getNextLevel(gameState.currentLevel);
  const levelCost = getLevelEntryCost(nextLevel);
  gameState.marketplace.available = false;
  gameState.committedToNextLevel = false; // Reset for next level cycle
  
  addLogEntry(gameState, `Advanced to level ${nextLevel} (-${levelCost} glitchbytes)`);
  
  return enterLevel(gameState, nextLevel);
}

export function restartGame(gameState: GameState): boolean {
  // Reset orb bag to initial state (same as going to main menu then starting)
  gameState.orbBag = createInitialBag();
  
  // Reset other game state
  gameState.gameStarted = false;
  gameState.levelCompleted = false;
  gameState.marketplace.available = false;
  gameState.committedToNextLevel = false;
  
  return startNewGame(gameState);
}

export function returnToMenu(gameState: GameState): void {
  addLogEntry(gameState, 'Returned to main menu');
  
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  gameState.levelCompleted = false;
  gameState.marketplace.available = false;
  
  // Reset orb bag to initial state (lose all purchased orbs)
  gameState.orbBag = createInitialBag();
  
  // Reset shop deck to initial prices (new game session)
  gameState.shopDeck = initializeShopDeck();
  
  // Reset commitment flag
  gameState.committedToNextLevel = false;
}

export function skipLevel(gameState: GameState): boolean {
  if (gameState.phase !== 'level') {
    return false;
  }

  const milestone = getLevelMilestone(gameState.currentLevel);
  const pointsNeeded = milestone - gameState.playerStats.points;
  
  if (pointsNeeded > 0) {
    applyPointsWithMultiplier(gameState, pointsNeeded, `DEBUG: Skip to milestone (+${pointsNeeded})`);
    addLogEntry(gameState, `DEBUG: Added ${pointsNeeded} points to reach level ${gameState.currentLevel} milestone`);
  }
  
  // Complete the level if we now have enough points
  if (checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
    completeLevel(gameState);
  }
  
  return true;
}