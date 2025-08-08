import type { OrbBag, OrbType, Orb } from './types.js';
import { GAME_CONFIG } from './constants.js';

export function createOrb(type: OrbType, amount?: number): Orb {
  return {
    type,
    amount: amount ?? GAME_CONFIG.defaultOrbAmounts[type]
  };
}

export function createInitialBag(): OrbBag {
  // Create specific orbs as per specification
  const bombOrbs = [
    createOrb('bomb', 1),  // Bomb
    createOrb('bomb', 1),  // Bomb  
    createOrb('bomb', 2),  // Double Bomb
    createOrb('bomb', 2),  // Double Bomb
    createOrb('bomb', 3),  // Triple Bomb
  ];
  
  const pointOrbs = [
    createOrb('point', 5), // Points 5
    createOrb('point', 5), // Points 5
    createOrb('point', 5), // Points 5
  ];
  
  const healthOrbs = [
    createOrb('health', 1), // Health 1
  ];
  
  const pointsPerAnyOrbOrbs = [
    createOrb('points_per_anyorb', 2), // 2 Points Per Any Orb
  ];
  
  const pointsPerBombPulledOrbs = [
    createOrb('points_per_bombpulled', 3), // 3 Points Per Bomb Pulled
  ];
  
  const multiplierOrbs = [
    createOrb('multiplier', 1.0), // 1x Multiplier Boost
  ];
  
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
    },
    points_per_anyorb: {
      available: [...pointsPerAnyOrbOrbs],
      total: [...pointsPerAnyOrbOrbs]
    },
    points_per_bombpulled: {
      available: [...pointsPerBombPulledOrbs],
      total: [...pointsPerBombPulledOrbs]
    },
    multiplier: {
      available: [...multiplierOrbs],
      total: [...multiplierOrbs]
    }
  };
}

export function getTotalAvailableOrbs(bag: OrbBag): number {
  return bag.health.available.length + bag.point.available.length + bag.bomb.available.length + bag.points_per_anyorb.available.length + bag.points_per_bombpulled.available.length + bag.multiplier.available.length;
}

export function getAvailableOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].available.length;
}

export function getTotalOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].total.length;
}

export function getAllAvailableOrbs(bag: OrbBag): Orb[] {
  return [...bag.health.available, ...bag.point.available, ...bag.bomb.available, ...bag.points_per_anyorb.available, ...bag.points_per_bombpulled.available, ...bag.multiplier.available];
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
  bag.points_per_anyorb.available = [...bag.points_per_anyorb.total];
  bag.points_per_bombpulled.available = [...bag.points_per_bombpulled.total];
  bag.multiplier.available = [...bag.multiplier.total];
}

export function addOrbsToBag(bag: OrbBag, orbType: OrbType, quantity: number, amount?: number): void {
  const newOrbs = Array(quantity).fill(null).map(() => createOrb(orbType, amount));
  
  // Add to both total and available
  bag[orbType].total.push(...newOrbs);
  bag[orbType].available.push(...newOrbs);
}

export function calculatePointsPerAnyOrbPoints(bag: OrbBag, multiplier: number): number {
  // Count all remaining orbs (excluding the points_per_anyorb orb that's about to be consumed)
  const remainingOrbs = getTotalAvailableOrbs(bag) - 1; // -1 for the points_per_anyorb orb itself
  return remainingOrbs * multiplier;
}