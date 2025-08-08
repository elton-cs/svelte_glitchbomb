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
  return {
    health: Array(startingOrbs.health).fill(null).map(() => createOrb('health')),
    point: Array(startingOrbs.point).fill(null).map(() => createOrb('point')),
    bomb: Array(startingOrbs.bomb).fill(null).map(() => createOrb('bomb')),
  };
}

export function getTotalAvailableOrbs(bag: OrbBag): number {
  return bag.health.length + bag.point.length + bag.bomb.length;
}

export function getAvailableOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].length;
}

export function getAllOrbs(bag: OrbBag): Orb[] {
  return [...bag.health, ...bag.point, ...bag.bomb];
}

export function pullRandomOrb(bag: OrbBag): Orb | null {
  const allOrbs = getAllOrbs(bag);
  
  if (allOrbs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * allOrbs.length);
  const selectedOrb = allOrbs[randomIndex];
  
  // Remove the orb from the appropriate array
  const orbArray = bag[selectedOrb.type];
  const orbIndexInArray = orbArray.findIndex(orb => orb === selectedOrb);
  if (orbIndexInArray !== -1) {
    orbArray.splice(orbIndexInArray, 1);
  }
  
  return selectedOrb;
}

export function resetConsumedOrbs(bag: OrbBag): void {
  // This function needs to restore orbs to their original state
  // For now, we'll recreate the initial bag - this might need refinement
  // based on how orbs are added during gameplay
  const initialCounts = {
    health: GAME_CONFIG.startingOrbs.health,
    point: GAME_CONFIG.startingOrbs.point,
    bomb: GAME_CONFIG.startingOrbs.bomb
  };
  
  // Count current total orbs (including consumed ones would require tracking)
  // For now, assume we want to reset to initial + any permanently added orbs
  const totalHealth = Math.max(initialCounts.health, bag.health.length);
  const totalPoint = Math.max(initialCounts.point, bag.point.length);
  const totalBomb = Math.max(initialCounts.bomb, bag.bomb.length);
  
  bag.health = Array(totalHealth).fill(null).map(() => createOrb('health'));
  bag.point = Array(totalPoint).fill(null).map(() => createOrb('point'));
  bag.bomb = Array(totalBomb).fill(null).map(() => createOrb('bomb'));
}

export function addOrbsToBag(bag: OrbBag, orbType: OrbType, quantity: number, amount?: number): void {
  const newOrbs = Array(quantity).fill(null).map(() => createOrb(orbType, amount));
  bag[orbType].push(...newOrbs);
}