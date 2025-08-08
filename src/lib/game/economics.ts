import { GAME_CONFIG } from './constants.js';


export function canAffordLevel(moonrocks: number, level: number): boolean {
  if (level < 1 || level > GAME_CONFIG.levelCosts.length) {
    return false;
  }
  
  const cost = GAME_CONFIG.levelCosts[level - 1];
  return moonrocks >= cost;
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

export function calculateVictoryReward(): number {
  return GAME_CONFIG.victoryReward + GAME_CONFIG.levelMilestones[GAME_CONFIG.levelMilestones.length - 1];
}

export function validatePurchase(cheddah: number, cost: number): boolean {
  return cheddah >= cost;
}