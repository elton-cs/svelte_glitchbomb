import type { OrbBag, OrbType, Orb } from './types.js';
import { GAME_CONFIG } from './constants.js';

export function createOrb(type: OrbType, amount?: number): Orb {
  return {
    type,
    amount: amount ?? GAME_CONFIG.defaultOrbAmounts[type]
  };
}

export function createInitialBag(): OrbBag {
  const { startingOrbs } = GAME_CONFIG;
  
  const healthOrbs = Array(startingOrbs.health).fill(null).map(() => createOrb('health'));
  const pointOrbs = Array(startingOrbs.point).fill(null).map(() => createOrb('point'));
  const bombOrbs = Array(startingOrbs.bomb).fill(null).map(() => createOrb('bomb'));
  
  return {
    health: {
      available: [...healthOrbs],
      total: [...healthOrbs]
    },
    point: {
      available: [...pointOrbs],
      total: [...pointOrbs]
    },
    bomb: {
      available: [...bombOrbs],
      total: [...bombOrbs]
    }
  };
}

export function getTotalAvailableOrbs(bag: OrbBag): number {
  return bag.health.available.length + bag.point.available.length + bag.bomb.available.length;
}

export function getAvailableOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].available.length;
}

export function getTotalOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].total.length;
}

export function getAllAvailableOrbs(bag: OrbBag): Orb[] {
  return [...bag.health.available, ...bag.point.available, ...bag.bomb.available];
}

export function pullRandomOrb(bag: OrbBag): Orb | null {
  const allAvailableOrbs = getAllAvailableOrbs(bag);
  
  if (allAvailableOrbs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * allAvailableOrbs.length);
  const selectedOrb = allAvailableOrbs[randomIndex];
  
  // Remove the orb from the available array
  const availableArray = bag[selectedOrb.type].available;
  const orbIndexInArray = availableArray.findIndex(orb => orb === selectedOrb);
  if (orbIndexInArray !== -1) {
    availableArray.splice(orbIndexInArray, 1);
  }
  
  return selectedOrb;
}

export function resetConsumedOrbs(bag: OrbBag): void {
  // Restore available orbs to match total owned orbs (including purchased ones)
  bag.health.available = [...bag.health.total];
  bag.point.available = [...bag.point.total];
  bag.bomb.available = [...bag.bomb.total];
}

export function addOrbsToBag(bag: OrbBag, orbType: OrbType, quantity: number, amount?: number): void {
  const newOrbs = Array(quantity).fill(null).map(() => createOrb(orbType, amount));
  
  // Add to both total and available
  bag[orbType].total.push(...newOrbs);
  bag[orbType].available.push(...newOrbs);
}