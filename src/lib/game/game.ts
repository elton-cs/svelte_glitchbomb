import { resetLevelStats } from './state.js';
import type { GameState } from './types.js';
import { pullRandomOrb, resetConsumedOrbs, addOrbsToBag, calculatePointsPerAnyOrbPoints, createInitialBag } from './orbs.js';
import { audioManager } from '../utils/audio.js';
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
import { addStructuredLogEntry, clearGameLog, addPointHistoryEntry, clearPointHistory, saveGlitchbytes } from './state.js';
import { getCumulativeLevelCost } from './economics.js';

function applyPointsWithMultiplier(gameState: GameState, basePoints: number, action: string = 'Points gained'): void {
  const multipliedPoints = Math.floor(basePoints * gameState.playerStats.levelMultiplier);
  gameState.playerStats.points += multipliedPoints;
  
  // Play points bar sound when points increase
  if (multipliedPoints > 0) {
    audioManager.playSoundEffect('pointsbar', 0.3);
  }
  
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
      addStructuredLogEntry(gameState, {
        type: 'game_event',
        data: {
          event: 'game_start'
        }
      });
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
      gameState.playerStats.chips = 0;
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
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'health',
            amount: orb.amount,
            effect: {
              health: orb.amount
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'point':
        const pointOrbMultiplied = Math.floor(orb.amount * gameState.playerStats.levelMultiplier);
        applyPointsWithMultiplier(gameState, orb.amount, `Point orb (+${orb.amount})`);
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'point',
            amount: orb.amount,
            effect: {
              points: pointOrbMultiplied,
              basePoints: orb.amount,
              appliedMultiplier: gameState.playerStats.levelMultiplier
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'bomb':
        const previousHealth = gameState.playerStats.health;
        gameState.playerStats.health = Math.max(0, gameState.playerStats.health - orb.amount);
        
        // Play appropriate sound when health decreases
        if (orb.amount > 0) {
          if (gameState.playerStats.health === 0 && previousHealth > 0) {
            // Health hit 0 - play endgame sound instead of bomb sound
            audioManager.playSoundEffect('endgame', 0.6);
          } else {
            // Health decreased but didn't hit 0 - play bomb sound
            audioManager.playSoundEffect('bomb1', 0.5);
          }
        }
        
        gameState.playerStats.bombsPulledThisLevel += 1;
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Bomb orb (-${orb.amount} HP)`, getCumulativeLevelCost(gameState.currentLevel));
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'bomb',
            amount: orb.amount,
            effect: {
              bombDamage: orb.amount,
              bombsPulled: gameState.playerStats.bombsPulledThisLevel
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'points_per_anyorb':
        const pointsPerAnyOrbPoints = calculatePointsPerAnyOrbPoints(gameState.orbBag, orb.amount);
        const orbsConsumed = pointsPerAnyOrbPoints / orb.amount; // Calculate orbs consumed from the result
        const comboMultiplied = Math.floor(pointsPerAnyOrbPoints * gameState.playerStats.levelMultiplier);
        applyPointsWithMultiplier(gameState, pointsPerAnyOrbPoints, `Combo orb (+${pointsPerAnyOrbPoints})`);
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'points_per_anyorb',
            amount: orb.amount,
            effect: {
              points: comboMultiplied,
              basePoints: pointsPerAnyOrbPoints,
              appliedMultiplier: gameState.playerStats.levelMultiplier,
              orbsConsumed: orbsConsumed
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'points_per_bombpulled':
        const bombPoints = gameState.playerStats.bombsPulledThisLevel * orb.amount;
        const dangerMultiplied = Math.floor(bombPoints * gameState.playerStats.levelMultiplier);
        applyPointsWithMultiplier(gameState, bombPoints, `Danger orb (+${bombPoints})`);
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'points_per_bombpulled',
            amount: orb.amount,
            effect: {
              points: dangerMultiplied,
              basePoints: bombPoints,
              appliedMultiplier: gameState.playerStats.levelMultiplier,
              bombsPulled: gameState.playerStats.bombsPulledThisLevel
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'multiplier':
        gameState.playerStats.levelMultiplier += orb.amount;
        
        // Play multiplier sound when multiplier increases
        if (orb.amount > 0) {
          audioManager.playSoundEffect('multiplier', 0.6);
        }
        
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Multiplier orb (+${orb.amount}x)`, getCumulativeLevelCost(gameState.currentLevel));
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'multiplier',
            amount: orb.amount,
            effect: {
              multiplier: orb.amount
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'bits':
        gameState.playerStats.chips += orb.amount;
        
        // Play special pull sound when chips increase
        if (orb.amount > 0) {
          audioManager.playSoundEffect('specialpull', 0.4);
        }
        
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Chips orb (+${orb.amount})`, getCumulativeLevelCost(gameState.currentLevel));
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'bits',
            amount: orb.amount,
            effect: {
              chips: orb.amount
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
      case 'glitchbytes':
        gameState.playerStats.glitchbytes += orb.amount;
        
        // Play special pull sound when glitchbytes increase
        if (orb.amount > 0) {
          audioManager.playSoundEffect('specialpull', 0.4);
        }
        
        addPointHistoryEntry(gameState, gameState.playerStats.points, `Glitchbytes orb (+${orb.amount})`, getCumulativeLevelCost(gameState.currentLevel));
        addStructuredLogEntry(gameState, {
          type: 'orb_pulled',
          data: {
            orbType: 'glitchbytes',
            amount: orb.amount,
            effect: {
              glitchbytes: orb.amount
            },
            resultingStats: {
              health: gameState.playerStats.health,
              points: gameState.playerStats.points,
              multiplier: gameState.playerStats.levelMultiplier,
              chips: gameState.playerStats.chips,
              glitchbytes: gameState.playerStats.glitchbytes
            }
          }
        });
        break;
    }

    if (checkGameOver(gameState.playerStats.health, gameState.orbBag)) {
      if (!checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
        gameState.phase = 'gameover';
        addStructuredLogEntry(gameState, {
          type: 'game_event',
          data: {
            event: 'game_over',
            details: {
              finalPoints: gameState.playerStats.points,
              reason: 'No health or orbs remaining'
            }
          }
        });
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

  // Play levelup sound after a brief delay to let progress bar sound finish
  setTimeout(() => {
    audioManager.playSoundEffect('levelup', 0.7);
  }, 400);

  if (isLastLevel(gameState.currentLevel)) {
    gameState.phase = 'victory';
    const victoryReward = calculateVictoryReward(gameState.playerStats.points);
    gameState.playerStats.glitchbytes += victoryReward;
    addStructuredLogEntry(gameState, {
      type: 'level_change',
      data: {
        fromLevel: gameState.currentLevel,
        toLevel: gameState.currentLevel,
        reward: victoryReward,
        reason: 'victory'
      }
    });
  } else {
    gameState.phase = 'confirmation';
    gameState.marketplace.available = false;
    gameState.marketplace.currentShopItems = [];
    addStructuredLogEntry(gameState, {
      type: 'level_change',
      data: {
        fromLevel: gameState.currentLevel,
        toLevel: gameState.currentLevel,
        reason: 'complete'
      }
    });
  }
}

export function cashOutMidLevel(gameState: GameState): number {
  const cashOut = gameState.playerStats.points;
  
  gameState.playerStats.glitchbytes += cashOut;
  gameState.phase = 'menu';
  gameState.gameStarted = false;
  
  addStructuredLogEntry(gameState, {
    type: 'game_event',
    data: {
      event: 'cash_out',
      details: {
        glitchbytesEarned: cashOut,
        finalPoints: gameState.playerStats.points
      }
    }
  });
  
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
  
  addStructuredLogEntry(gameState, {
    type: 'points_conversion',
    data: {
      pointsConverted: points,
      chipsGained: 0,
      totalChips: gameState.playerStats.chips,
      conversionType: 'cash_out'
    }
  });
  
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

  if (gameState.playerStats.chips < cost) {
    return false;
  }

  gameState.playerStats.chips -= cost;
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
  
  if (gameState.playerStats.chips < totalCost) {
    return false;
  }

  gameState.playerStats.chips -= totalCost;
  addOrbsToBag(gameState.orbBag, deckItem.type, quantity, deckItem.amount);
  
  addStructuredLogEntry(gameState, {
    type: 'shop_purchase',
    data: {
      itemName: deckItem.name,
      itemId: deckItem.id,
      cost: totalCost,
      remainingChips: gameState.playerStats.chips
    }
  });
  
  // Update deck item price for future purchases
  for (let i = 0; i < quantity; i++) {
    updateDeckItemPrice(deckItem);
  }
  
  return true;
}

export function continueToMarketplace(gameState: GameState): void {
  gameState.phase = 'marketplace';
  gameState.committedToNextLevel = true;
  const newChips = processLevelReward(gameState.playerStats.points);
  gameState.playerStats.chips += newChips;
  gameState.marketplace.available = true;
  gameState.marketplace.currentShopItems = getAvailableShopItemsFromDeck(gameState.shopDeck, gameState.currentLevel);
  
  // Reset consumed orbs so players can purchase more orbs with their chips
  resetConsumedOrbs(gameState.orbBag);
  
  addStructuredLogEntry(gameState, {
    type: 'points_conversion',
    data: {
      pointsConverted: gameState.playerStats.points,
      chipsGained: newChips,
      totalChips: gameState.playerStats.chips,
      conversionType: 'level_end'
    }
  });
}

export function proceedToNextLevel(gameState: GameState): boolean {
  if (gameState.phase !== 'marketplace') {
    return false;
  }

  const nextLevel = getNextLevel(gameState.currentLevel);
  const levelCost = getLevelEntryCost(nextLevel);
  gameState.marketplace.available = false;
  gameState.committedToNextLevel = false; // Reset for next level cycle
  
  addStructuredLogEntry(gameState, {
    type: 'level_change',
    data: {
      fromLevel: gameState.currentLevel,
      toLevel: nextLevel,
      cost: levelCost,
      reason: 'advance'
    }
  });
  
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
  addStructuredLogEntry(gameState, {
    type: 'game_event',
    data: {
      event: 'return_to_menu'
    }
  });
  
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
    addStructuredLogEntry(gameState, {
      type: 'system',
      data: {
        message: `Added ${pointsNeeded} points to reach level ${gameState.currentLevel} milestone`,
        level: 'debug'
      }
    });
  }
  
  // Complete the level if we now have enough points
  if (checkLevelComplete(gameState.playerStats.points, gameState.currentLevel)) {
    // Custom debug completion logic instead of using completeLevel()
    gameState.levelCompleted = true;
    
    // Play levelup sound after a brief delay to let progress bar sound finish
    setTimeout(() => {
      audioManager.playSoundEffect('levelup', 0.7);
    }, 400);
    
    if (isLastLevel(gameState.currentLevel)) {
      gameState.phase = 'victory';
      const victoryReward = calculateVictoryReward(gameState.playerStats.points);
      gameState.playerStats.glitchbytes += victoryReward;
      saveGlitchbytes(gameState.playerStats.glitchbytes);
      addStructuredLogEntry(gameState, {
        type: 'level_change',
        data: {
          fromLevel: gameState.currentLevel,
          toLevel: gameState.currentLevel,
          reward: victoryReward,
          reason: 'skip'
        }
      });
    } else {
      gameState.phase = 'confirmation';
      gameState.marketplace.available = false;
      gameState.marketplace.currentShopItems = [];
      addStructuredLogEntry(gameState, {
        type: 'level_change',
        data: {
          fromLevel: gameState.currentLevel,
          toLevel: gameState.currentLevel,
          reason: 'skip'
        }
      });
    }
  }
  
  return true;
}
