import { GAME_CONFIG } from './constants.js';


export function canAffordLevel(glitchbytes: number, level: number): boolean {
  if (level < 1 || level > GAME_CONFIG.levelCosts.length) {
    return false;
  }
  
  const cost = GAME_CONFIG.levelCosts[level - 1];
  return glitchbytes >= cost;
}

export function calculateCashOut(points: number, levelCost: number): number {
  return Math.max(0, points - levelCost);
}

export function processLevelReward(points: number): number {
  return points;
}

export function getLevelEntryCost(level: number): number {
  if (level < 1 || level > GAME_CONFIG.levelCosts.length) {
    return 0;
  }
  return GAME_CONFIG.levelCosts[level - 1];
}

export function calculateVictoryReward(points: number): number {
  // Auto-convert points to glitchbytes (1:1 ratio) instead of fixed reward
  return points;
}

export function validatePurchase(bits: number, cost: number): boolean {
  return bits >= cost;
}

export function getCumulativeLevelCost(currentLevel: number): number {
  if (currentLevel < 1 || currentLevel > GAME_CONFIG.levelCosts.length) {
    return 0;
  }
  
  let total = 0;
  for (let i = 0; i < currentLevel; i++) {
    total += GAME_CONFIG.levelCosts[i];
  }
  return total;
}