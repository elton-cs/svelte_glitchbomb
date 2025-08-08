import type { GameConfig } from './types.js';

export const GAME_CONFIG: GameConfig = {
  initialMoonrocks: 1000,
  gameEntryCost: 5,
  levelMilestones: [10, 20, 30, 40, 50],
  levelCosts: [0, 15, 25, 35, 45],
  orbCosts: {
    health: 2,
    point: 2,
  },
  orbEffects: {
    health: 1,
    point: 5,
    bomb: -2,
  },
  victoryReward: 100,
  maxHealth: 5,
  startingOrbs: {
    health: 5,
    point: 5,
    bomb: 5,
  },
};

export const LEVEL_COUNT = 5;