import type { OrbType } from './types.js';

export interface PricingStrategy {
  name: string;
  description: string;
  calculateIncrement(purchaseNumber: number): number;
}

export const LINEAR_PRICING: PricingStrategy = {
  name: 'Linear',
  description: 'Price increases by purchase number (1, 2, 3, 4...)',
  calculateIncrement: (purchaseNumber: number) => purchaseNumber
};

export const EXPONENTIAL_PRICING: PricingStrategy = {
  name: 'Exponential',
  description: 'Price doubles with each purchase (1, 2, 4, 8...)',
  calculateIncrement: (purchaseNumber: number) => Math.pow(2, purchaseNumber - 1)
};

export const FIBONACCI_PRICING: PricingStrategy = {
  name: 'Fibonacci',
  description: 'Price follows Fibonacci sequence (1, 1, 2, 3, 5, 8...)',
  calculateIncrement: (purchaseNumber: number) => {
    if (purchaseNumber <= 2) return 1;
    let a = 1, b = 1;
    for (let i = 3; i <= purchaseNumber; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }
};

export const QUADRATIC_PRICING: PricingStrategy = {
  name: 'Quadratic',
  description: 'Price increases quadratically (1, 4, 9, 16...)',
  calculateIncrement: (purchaseNumber: number) => purchaseNumber * purchaseNumber
};

export const FLAT_PRICING: PricingStrategy = {
  name: 'Flat',
  description: 'No price increase (1, 1, 1, 1...)',
  calculateIncrement: () => 1
};

export const SIMPLE_INCREMENT_PRICING: PricingStrategy = {
  name: 'Simple Increment',
  description: 'Price increases by 1 after each purchase (base, base+1, base+2, base+3...)',
  calculateIncrement: () => 1
};

export interface PricingConfig {
  defaultStrategy: PricingStrategy;
  orbStrategies?: Partial<Record<OrbType, PricingStrategy>>;
}

export function calculateDynamicPriceWithStrategy(
  basePrice: number, 
  purchaseCount: number, 
  strategy: PricingStrategy
): number {
  if (purchaseCount === 0) {
    return basePrice;
  }
  
  // Special case for simple increment - just add purchase count to base price
  if (strategy === SIMPLE_INCREMENT_PRICING) {
    return basePrice + purchaseCount;
  }
  
  let totalPrice = basePrice;
  for (let i = 1; i <= purchaseCount; i++) {
    totalPrice += strategy.calculateIncrement(i);
  }
  
  return totalPrice;
}

export function calculateTotalCostWithStrategy(
  basePrice: number, 
  currentPurchaseCount: number, 
  quantity: number, 
  strategy: PricingStrategy
): number {
  let totalCost = 0;
  
  for (let i = 0; i < quantity; i++) {
    const priceForThisPurchase = calculateDynamicPriceWithStrategy(
      basePrice, 
      currentPurchaseCount + i, 
      strategy
    );
    totalCost += priceForThisPurchase;
  }
  
  return totalCost;
}

export function calculateMaxAffordableWithStrategy(
  cheddah: number, 
  basePrice: number, 
  currentPurchaseCount: number, 
  strategy: PricingStrategy
): number {
  let quantity = 0;
  let totalCost = 0;
  
  while (true) {
    const priceForNextPurchase = calculateDynamicPriceWithStrategy(
      basePrice, 
      currentPurchaseCount + quantity, 
      strategy
    );
    if (totalCost + priceForNextPurchase > cheddah) {
      break;
    }
    totalCost += priceForNextPurchase;
    quantity++;
  }
  
  return quantity;
}

export function getPricingStrategyForOrb(orbType: OrbType, config: PricingConfig): PricingStrategy {
  return config.orbStrategies?.[orbType] ?? config.defaultStrategy;
}