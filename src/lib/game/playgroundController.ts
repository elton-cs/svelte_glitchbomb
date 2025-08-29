import type { PlaygroundState, PlaygroundOrb } from './playgroundTypes.js';
import { GAME_CONFIG } from './constants.js';
import { 
  getNextOrb, 
  getRemainingOrbCount, 
  addPlaygroundLog 
} from './playgroundState.js';

// Reuse orb effect logic from the main game with playground adaptations
export function pullNextOrb(state: PlaygroundState): boolean {
  if (!state.isActive) {
    addPlaygroundLog(state, 'Cannot pull: Playground not active');
    return false;
  }

  const orb = getNextOrb(state);
  
  if (!orb) {
    addPlaygroundLog(state, 'No more orbs available');
    state.isActive = false;
    return false;
  }

  // Apply orb effects BEFORE moving to next orb (to match main game logic)
  switch (orb.type) {
    case 'health':
      state.playerStats.health = Math.min(
        state.playerStats.health + orb.amount,
        GAME_CONFIG.maxHealth
      );
      addPlaygroundLog(state, `Pulled health orb (+${orb.amount} HP)`);
      break;
    case 'point':
      applyPointsWithMultiplier(state, orb.amount);
      addPlaygroundLog(state, `Pulled point orb (+${orb.amount} points)`);
      break;
    case 'bomb':
      state.playerStats.health = Math.max(0, state.playerStats.health - orb.amount);
      state.playerStats.bombsPulledThisLevel += 1;
      addPlaygroundLog(state, `Pulled bomb orb (-${orb.amount} HP)`);
      break;
    case 'points_per_anyorb':
      // Calculate BEFORE consuming the orb (includes the combo orb itself)
      const remainingOrbs = getRemainingOrbCount(state) - 1; // -1 for the combo orb itself
      const pointsPerAnyOrbPoints = remainingOrbs * orb.amount;
      applyPointsWithMultiplier(state, pointsPerAnyOrbPoints);
      addPlaygroundLog(state, `Pulled combo orb (+${pointsPerAnyOrbPoints} points from ${orb.amount} per orb)`);
      break;
    case 'points_per_bombpulled':
      const bombPoints = state.playerStats.bombsPulledThisLevel * orb.amount;
      applyPointsWithMultiplier(state, bombPoints);
      addPlaygroundLog(state, `Pulled danger orb (+${bombPoints} points from ${orb.amount} per bomb)`);
      break;
    case 'multiplier':
      state.playerStats.levelMultiplier += orb.amount;
      addPlaygroundLog(state, `Pulled multiplier orb (+${orb.amount}x boost)`);
      break;
    case 'bits':
      state.playerStats.chips += orb.amount;
      addPlaygroundLog(state, `Pulled chips orb (+${orb.amount} chips)`);
      break;
    case 'glitchbytes':
      state.playerStats.glitchbytes += orb.amount;
      addPlaygroundLog(state, `Pulled glitchbytes orb (+${orb.amount} glitchbytes)`);
      break;
  }

  // NOW move to next orb and track pulled orb (after effects are applied)
  state.pulledOrbs.push(orb);
  state.currentOrbIndex++;

  // Check if playground should end (no health or no orbs left)
  if (state.playerStats.health <= 0) {
    addPlaygroundLog(state, 'Game over! No health remaining');
    state.isActive = false;
  } else if (getRemainingOrbCount(state) === 0) {
    addPlaygroundLog(state, 'All orbs pulled! Playground complete');
    state.isActive = false;
  }

  return true;
}

// Reused from main game - applies points with current level multiplier
function applyPointsWithMultiplier(state: PlaygroundState, basePoints: number): void {
  const multipliedPoints = Math.floor(basePoints * state.playerStats.levelMultiplier);
  state.playerStats.points += multipliedPoints;
}

export function canPullOrb(state: PlaygroundState): boolean {
  return state.isActive && getRemainingOrbCount(state) > 0 && state.playerStats.health > 0;
}