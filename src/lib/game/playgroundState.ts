import type { PlaygroundState, PlaygroundOrb, OrbTemplate } from './playgroundTypes.js';
import { PLAYGROUND_ORB_TEMPLATES } from './playgroundTypes.js';
import { GAME_CONFIG } from './constants.js';
import { createOrb } from './orbs.js';

export function createInitialPlaygroundState(): PlaygroundState {
  return {
    playerStats: {
      moonrocks: 500, // Default 500 to see moonrocks orb effects
      cheddah: 0,   // Not relevant for playground  
      health: GAME_CONFIG.maxHealth,
      points: 0,
      bombsPulledThisLevel: 0,
      levelMultiplier: 1.0,
    },
    orbQueue: [],
    pulledOrbs: [],
    currentOrbIndex: 0,
    isActive: false,
    gameLog: []
  };
}

export function addOrbToPlayground(state: PlaygroundState, template: OrbTemplate, amount?: number): void {
  const orbAmount = amount ?? template.defaultAmount;
  const orb = createOrb(template.type, orbAmount);
  
  const playgroundOrb: PlaygroundOrb = {
    ...orb,
    id: `${template.type}-${Date.now()}-${Math.random()}`
  };
  
  state.orbQueue.push(playgroundOrb);
  addPlaygroundLog(state, `Added ${template.name} (+${orbAmount}) to bag`);
}

export function removeOrbFromPlayground(state: PlaygroundState, orbId: string): void {
  const index = state.orbQueue.findIndex(orb => orb.id === orbId);
  if (index !== -1) {
    const removedOrb = state.orbQueue.splice(index, 1)[0];
    // Adjust current index if necessary
    if (index < state.currentOrbIndex) {
      state.currentOrbIndex--;
    }
    addPlaygroundLog(state, `Removed ${getOrbTemplateName(removedOrb.type)} from bag`);
  }
}

export function resetPlaygroundStats(state: PlaygroundState): void {
  // Reset stats but preserve orb queue
  state.playerStats.moonrocks = 500;
  state.playerStats.health = GAME_CONFIG.maxHealth;
  state.playerStats.points = 0;
  state.playerStats.bombsPulledThisLevel = 0;
  state.playerStats.levelMultiplier = 1.0;
  state.currentOrbIndex = 0;
  state.pulledOrbs = [];
  state.isActive = true;
  addPlaygroundLog(state, 'Stats reset, orb bag preserved');
}

export function restartPlayground(state: PlaygroundState): void {
  // Reset everything including orb queue
  state.playerStats.moonrocks = 500;
  state.playerStats.health = GAME_CONFIG.maxHealth;
  state.playerStats.points = 0;
  state.playerStats.bombsPulledThisLevel = 0;
  state.playerStats.levelMultiplier = 1.0;
  state.orbQueue = [];
  state.pulledOrbs = [];
  state.currentOrbIndex = 0;
  state.isActive = false;
  addPlaygroundLog(state, 'Playground restarted, bag emptied');
}

export function getNextOrb(state: PlaygroundState): PlaygroundOrb | null {
  if (state.currentOrbIndex >= state.orbQueue.length) {
    return null;
  }
  return state.orbQueue[state.currentOrbIndex];
}

export function getRemainingOrbs(state: PlaygroundState): PlaygroundOrb[] {
  return state.orbQueue.slice(state.currentOrbIndex);
}

export function getTotalOrbs(state: PlaygroundState): number {
  return state.orbQueue.length;
}

export function getRemainingOrbCount(state: PlaygroundState): number {
  return state.orbQueue.length - state.currentOrbIndex;
}

export function addPlaygroundLog(state: PlaygroundState, message: string): void {
  const timestamp = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  state.gameLog.push(`${timestamp}: ${message}`);
  
  // Keep only last 20 entries
  if (state.gameLog.length > 20) {
    state.gameLog = state.gameLog.slice(-20);
  }
}

function getOrbTemplateName(type: string): string {
  const template = PLAYGROUND_ORB_TEMPLATES.find(t => t.type === type);
  return template?.name ?? type;
}

export function startPlayground(state: PlaygroundState): void {
  if (state.orbQueue.length === 0) {
    addPlaygroundLog(state, 'Cannot start: No orbs in bag');
    return;
  }
  
  state.isActive = true;
  addPlaygroundLog(state, `Playground started with ${state.orbQueue.length} orbs`);
}