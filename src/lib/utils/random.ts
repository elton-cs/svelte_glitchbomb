import type { OrbBag, OrbType } from '../game/types.js';

export function getRandomOrbFromBag(bag: OrbBag): OrbType | null {
  const availableOrbs: OrbType[] = [];
  
  for (let i = 0; i < bag.health.available; i++) {
    availableOrbs.push('health');
  }
  
  for (let i = 0; i < bag.point.available; i++) {
    availableOrbs.push('point');
  }
  
  for (let i = 0; i < bag.bomb.available; i++) {
    availableOrbs.push('bomb');
  }
  
  if (availableOrbs.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableOrbs.length);
  return availableOrbs[randomIndex];
}

export function getRandomFloat(): number {
  return Math.random();
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}