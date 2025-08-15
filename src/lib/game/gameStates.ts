import type { GamePhase } from './types.js';

export const GAME_PHASES = {
  MENU: 'menu' as const,
  LEVEL: 'level' as const,
  CONFIRMATION: 'confirmation' as const,
  MARKETPLACE: 'marketplace' as const,
  GAMEOVER: 'gameover' as const,
  VICTORY: 'victory' as const,
};

export function isValidPhaseTransition(currentPhase: GamePhase, nextPhase: GamePhase): boolean {
  switch (currentPhase) {
    case 'menu':
      return nextPhase === 'level';
    
    case 'level':
      return nextPhase === 'confirmation' || nextPhase === 'gameover' || nextPhase === 'victory' || nextPhase === 'menu';
    
    case 'confirmation':
      return nextPhase === 'marketplace' || nextPhase === 'menu';
    
    case 'marketplace':
      return nextPhase === 'level' || nextPhase === 'menu';
    
    case 'gameover':
      return nextPhase === 'menu';
    
    case 'victory':
      return nextPhase === 'menu';
    
    default:
      return false;
  }
}

export function getPhaseDisplayName(phase: GamePhase): string {
  switch (phase) {
    case 'menu':
      return 'Main Menu';
    case 'level':
      return 'Playing Level';
    case 'confirmation':
      return 'Level Complete';
    case 'marketplace':
      return 'Marketplace';
    case 'gameover':
      return 'Game Over';
    case 'victory':
      return 'Victory!';
    default:
      return 'Unknown';
  }
}