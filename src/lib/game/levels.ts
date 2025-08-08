import { GAME_CONFIG, LEVEL_COUNT } from './constants.js';
import type { OrbBag } from './types.js';
import { getTotalAvailableOrbs } from './orbs.js';

export function getLevelMilestone(level: number): number {
  if (level < 1 || level > GAME_CONFIG.levelMilestones.length) {
    return 0;
  }
  return GAME_CONFIG.levelMilestones[level - 1];
}

export function getLevelCost(level: number): number {
  if (level < 1 || level > GAME_CONFIG.levelCosts.length) {
    return 0;
  }
  return GAME_CONFIG.levelCosts[level - 1];
}

export function checkLevelComplete(points: number, level: number): boolean {
  const milestone = getLevelMilestone(level);
  return points >= milestone;
}

export function checkGameOver(health: number, orbBag: OrbBag): boolean {
  const noHealthLeft = health <= 0;
  const noOrbsLeft = getTotalAvailableOrbs(orbBag) === 0;
  return noHealthLeft || noOrbsLeft;
}

export function isValidLevel(level: number): boolean {
  return level >= 1 && level <= LEVEL_COUNT;
}

export function isLastLevel(level: number): boolean {
  return level === LEVEL_COUNT;
}

export function getNextLevel(currentLevel: number): number {
  return Math.min(currentLevel + 1, LEVEL_COUNT);
}