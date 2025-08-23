import type { OrbType, Orb, PlayerStats } from './types.js';

export interface PlaygroundOrb extends Orb {
  id: string; // Unique identifier for each orb instance
}

export interface PlaygroundState {
  playerStats: PlayerStats;
  orbQueue: PlaygroundOrb[]; // Deterministic order queue
  pulledOrbs: PlaygroundOrb[]; // Track pulled orbs for reset functionality
  currentOrbIndex: number; // Current position in the queue
  isActive: boolean; // Whether playground is running
  gameLog: string[]; // Simple log for playground actions
}

export interface OrbTemplate {
  type: OrbType;
  name: string;
  description: string;
  defaultAmount: number;
  emoji: string;
  color: string;
}

// Available orb templates for the playground
export const PLAYGROUND_ORB_TEMPLATES: OrbTemplate[] = [
  {
    type: 'health',
    name: 'Health Orb',
    description: 'Restores health',
    defaultAmount: 1,
    emoji: '♥',
    color: 'text-red-500'
  },
  {
    type: 'point',
    name: 'Point Orb',
    description: 'Gives points',
    defaultAmount: 5,
    emoji: '★',
    color: 'text-purple-500'
  },
  {
    type: 'bomb',
    name: 'Bomb Orb',
    description: 'Damages health',
    defaultAmount: 2,
    emoji: '💣',
    color: 'text-orange-500'
  },
  {
    type: 'points_per_anyorb',
    name: 'Combo Orb',
    description: 'Points per remaining orb',
    defaultAmount: 2,
    emoji: '🔗',
    color: 'text-cyan-500'
  },
  {
    type: 'points_per_bombpulled',
    name: 'Danger Orb', 
    description: 'Points per bomb pulled',
    defaultAmount: 3,
    emoji: '⚡',
    color: 'text-yellow-500'
  },
  {
    type: 'multiplier',
    name: 'Multiplier Orb',
    description: 'Boosts point multiplier',
    defaultAmount: 0.5,
    emoji: '✖',
    color: 'text-blue-500'
  },
  {
    type: 'bits',
    name: 'Bits Orb',
    description: 'Gives bits currency',
    defaultAmount: 10,
    emoji: '💾',
    color: 'text-yellow-300'
  },
  {
    type: 'glitchbytes',
    name: 'Glitchbyte Orb',
    description: 'Gives glitchbytes currency',
    defaultAmount: 5,
    emoji: '🌙',
    color: 'text-gray-300'
  }
];