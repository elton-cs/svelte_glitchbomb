import type { GameConfig } from './types.js';

export const GAME_CONFIG: GameConfig = {
  initialGlitchbytes: 0,
  levelMilestones: [12, 18, 28, 44, 70, 100, 150],
  levelCosts: [10, 1, 2, 4, 6, 9, 13],
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
    bits: 10,
    glitchbytes: 5,
  },
  maxHealth: 5,
  startingOrbs: {
    health: 1,
    point: 3,
    bomb: 5,
    points_per_anyorb: 1,
    points_per_bombpulled: 4,
    multiplier: 1,
    bits: 0,
    glitchbytes: 0,
  },
};

export const LEVEL_COUNT = 7;