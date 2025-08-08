import { GAME_CONFIG } from './constants.js';

const MOONROCKS_KEY = 'glitch_bomb_moonrocks';

export function saveMoonrocks(amount: number): void {
  try {
    localStorage.setItem(MOONROCKS_KEY, amount.toString());
  } catch (error) {
    console.warn('Failed to save moonrocks to localStorage:', error);
  }
}

export function loadMoonrocks(): number {
  try {
    const saved = localStorage.getItem(MOONROCKS_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load moonrocks from localStorage:', error);
  }
  
  return GAME_CONFIG.initialMoonrocks;
}

export function clearSavedData(): void {
  try {
    localStorage.removeItem(MOONROCKS_KEY);
  } catch (error) {
    console.warn('Failed to clear saved data from localStorage:', error);
  }
}