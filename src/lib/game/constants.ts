import type { GameConfig } from './types.js';
import { 
  LINEAR_PRICING, 
  EXPONENTIAL_PRICING, 
  FIBONACCI_PRICING, 
  QUADRATIC_PRICING,
  SIMPLE_INCREMENT_PRICING,
  type PricingConfig 
} from './pricing.js';

export const GAME_CONFIG: GameConfig = {
  initialMoonrocks: 0,
  levelMilestones: [12, 18, 28, 44, 66],
  levelCosts: [10, 3, 5, 7, 9],
  orbCosts: {
    health: 9,
    point: 5,
  },
  defaultOrbAmounts: {
    health: 1,
    point: 5,
    bomb: 2,
    points_per_anyorb: 1,
    points_per_bombpulled: 1,
    multiplier: 0.5,
    cheddah: 10,
    moonrocks: 5,
  },
  maxHealth: 5,
  startingOrbs: {
    health: 1,
    point: 3,
    bomb: 5,
    points_per_anyorb: 1,
    points_per_bombpulled: 1,
    multiplier: 1,
    cheddah: 0,
    moonrocks: 0,
  },
};

export const LEVEL_COUNT = 5;

export const PRICING_CONFIG: PricingConfig = {
  defaultStrategy: SIMPLE_INCREMENT_PRICING,
  // Example: Different strategies for different orb types
  // To enable different pricing for different orbs, uncomment and modify:
  // orbStrategies: {
  //   health: EXPONENTIAL_PRICING,  // Health orbs get exponentially more expensive
  //   point: FIBONACCI_PRICING,     // Point orbs follow Fibonacci sequence
  // }
  //
  // Available strategies: LINEAR_PRICING, EXPONENTIAL_PRICING, 
  // FIBONACCI_PRICING, QUADRATIC_PRICING, FLAT_PRICING, SIMPLE_INCREMENT_PRICING
};