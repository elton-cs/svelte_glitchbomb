import type { GameConfig } from './types.js';

export const GAME_CONFIG: GameConfig = {
  initialMoonrocks: 0,
  levelMilestones: [12, 18, 28, 44, 66],
  levelCosts: [10, 3, 5, 7, 9],
  orbCosts: {
    health: 2,
    point: 2,
  },
  defaultOrbAmounts: {
    health: 1,
    point: 5,
    bomb: 2,
    points_per_anyorb: 1,
    points_per_bombpulled: 1,
    multiplier: 0.5,
  },
  victoryReward: 100,
  maxHealth: 5,
  startingOrbs: {
    health: 1,
    point: 3,
    bomb: 5,
    points_per_anyorb: 1,
    points_per_bombpulled: 1,
    multiplier: 1,
  },
};

export const LEVEL_COUNT = 5;