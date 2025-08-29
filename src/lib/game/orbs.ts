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
    createOrb('points_per_anyorb', GAME_CONFIG.startingOrbs.points_per_anyorb), // Points Per Any Orb
  ];
  
  const pointsPerBombPulledOrbs = [
    createOrb('points_per_bombpulled', GAME_CONFIG.startingOrbs.points_per_bombpulled), // Points Per Bomb Pulled
  ];
  
  const multiplierOrbs = [
    createOrb('multiplier', GAME_CONFIG.startingOrbs.multiplier), // Multiplier Boost
  ];

  const bitsOrbs: Orb[] = [];
  
  const glitchbytesOrbs: Orb[] = [];
  
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
    },
    bits: {
      available: [...bitsOrbs],
      total: [...bitsOrbs]
    },
    glitchbytes: {
      available: [...glitchbytesOrbs],
      total: [...glitchbytesOrbs]
    }
  };
}

export function getTotalAvailableOrbs(bag: OrbBag): number {
  return bag.health.available.length + bag.point.available.length + bag.bomb.available.length + bag.points_per_anyorb.available.length + bag.points_per_bombpulled.available.length + bag.multiplier.available.length + bag.bits.available.length + bag.glitchbytes.available.length;
}

export function getAvailableOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].available.length;
}

export function getTotalOrbCount(bag: OrbBag, type: OrbType): number {
  return bag[type].total.length;
}

export function getAllAvailableOrbs(bag: OrbBag): Orb[] {
  return [...bag.health.available, ...bag.point.available, ...bag.bomb.available, ...bag.points_per_anyorb.available, ...bag.points_per_bombpulled.available, ...bag.multiplier.available, ...bag.bits.available, ...bag.glitchbytes.available];
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
  bag.bits.available = [...bag.bits.total];
  bag.glitchbytes.available = [...bag.glitchbytes.total];
}

export function addOrbsToBag(bag: OrbBag, orbType: OrbType, quantity: number, amount?: number): void {
  const newOrbs = Array(quantity).fill(null).map(() => createOrb(orbType, amount));
  
  // Add to both total and available
  bag[orbType].total.push(...newOrbs);
  bag[orbType].available.push(...newOrbs);
}

export function calculatePointsPerAnyOrbPoints(bag: OrbBag, multiplier: number): number {
  // Count all remaining orbs (the points_per_anyorb orb has already been removed by pullRandomOrb)
  const remainingOrbs = getTotalAvailableOrbs(bag);
  return remainingOrbs * multiplier;
}
