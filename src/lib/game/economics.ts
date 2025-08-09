import { GAME_CONFIG, PRICING_CONFIG } from './constants.js';
import { 
  calculateDynamicPriceWithStrategy, 
  calculateTotalCostWithStrategy, 
  calculateMaxAffordableWithStrategy,
  getPricingStrategyForOrb,
  type PricingStrategy
} from './pricing.js';
import type { OrbType } from './types.js';


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

export function calculateVictoryReward(points: number): number {
  // Auto-convert points to moonrocks (1:1 ratio) instead of fixed reward
  return points;
}

export function validatePurchase(cheddah: number, cost: number): boolean {
  return cheddah >= cost;
}

// Legacy wrapper functions that use the extensible system with default strategy
export function calculateDynamicPrice(basePrice: number, purchaseCount: number): number {
  return calculateDynamicPriceWithStrategy(basePrice, purchaseCount, PRICING_CONFIG.defaultStrategy);
}

export function calculateTotalCostForQuantity(basePrice: number, currentPurchaseCount: number, quantity: number): number {
  return calculateTotalCostWithStrategy(basePrice, currentPurchaseCount, quantity, PRICING_CONFIG.defaultStrategy);
}

export function calculateMaxAffordableQuantity(cheddah: number, basePrice: number, currentPurchaseCount: number): number {
  return calculateMaxAffordableWithStrategy(cheddah, basePrice, currentPurchaseCount, PRICING_CONFIG.defaultStrategy);
}

// New extensible functions for specific orb types
export function calculateDynamicPriceForOrb(orbType: OrbType, basePrice: number, purchaseCount: number): number {
  const strategy = getPricingStrategyForOrb(orbType, PRICING_CONFIG);
  return calculateDynamicPriceWithStrategy(basePrice, purchaseCount, strategy);
}

export function calculateTotalCostForOrbQuantity(orbType: OrbType, basePrice: number, currentPurchaseCount: number, quantity: number): number {
  const strategy = getPricingStrategyForOrb(orbType, PRICING_CONFIG);
  return calculateTotalCostWithStrategy(basePrice, currentPurchaseCount, quantity, strategy);
}

export function calculateMaxAffordableForOrb(orbType: OrbType, cheddah: number, basePrice: number, currentPurchaseCount: number): number {
  const strategy = getPricingStrategyForOrb(orbType, PRICING_CONFIG);
  return calculateMaxAffordableWithStrategy(cheddah, basePrice, currentPurchaseCount, strategy);
}

export function getOrbPricingStrategy(orbType: OrbType): PricingStrategy {
  return getPricingStrategyForOrb(orbType, PRICING_CONFIG);
}