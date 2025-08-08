import type { OrbBag, OrbType, Orb } from './types.js';
import { GAME_CONFIG } from './constants.js';

export function createInitialBag(): OrbBag {
  const { startingOrbs } = GAME_CONFIG;
  return {
    health: {
      total: startingOrbs.health,
      available: startingOrbs.health,
    },
    point: {
      total: startingOrbs.point,
      available: startingOrbs.point,
    },
    bomb: {
      total: startingOrbs.bomb,
      available: startingOrbs.bomb,
    },
  };
}

export function getTotalAvailableOrbs(bag: OrbBag): number {
  return bag.health.available + bag.point.available + bag.bomb.available;
}

export function pullRandomOrb(bag: OrbBag): Orb | null {
  const totalAvailable = getTotalAvailableOrbs(bag);
  
  if (totalAvailable === 0) {
    return null;
  }

  const random = Math.random() * totalAvailable;
  let currentCount = 0;

  if (bag.health.available > 0) {
    currentCount += bag.health.available;
    if (random < currentCount) {
      bag.health.available--;
      return {
        type: 'health',
        effect: GAME_CONFIG.orbEffects.health,
      };
    }
  }

  if (bag.point.available > 0) {
    currentCount += bag.point.available;
    if (random < currentCount) {
      bag.point.available--;
      return {
        type: 'point',
        effect: GAME_CONFIG.orbEffects.point,
      };
    }
  }

  if (bag.bomb.available > 0) {
    bag.bomb.available--;
    return {
      type: 'bomb',
      effect: GAME_CONFIG.orbEffects.bomb,
    };
  }

  return null;
}

export function resetConsumedOrbs(bag: OrbBag): void {
  bag.health.available = bag.health.total;
  bag.point.available = bag.point.total;
  bag.bomb.available = bag.bomb.total;
}

export function addOrbsToBag(bag: OrbBag, orbType: OrbType, quantity: number): void {
  switch (orbType) {
    case 'health':
      bag.health.total += quantity;
      bag.health.available += quantity;
      break;
    case 'point':
      bag.point.total += quantity;
      bag.point.available += quantity;
      break;
    case 'bomb':
      bag.bomb.total += quantity;
      bag.bomb.available += quantity;
      break;
  }
}