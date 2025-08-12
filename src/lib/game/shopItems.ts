import type { ShopItem } from './types.js';

export const SHOP_ITEMS: Record<string, ShopItem> = {
  // Basic Items (always available)
  minor_health: {
    id: 'minor_health',
    name: 'MINOR HEALTH',
    description: '+1 HP',
    orb: {
      type: 'health',
      amount: 1
    },
    cost: 2
  },
  
  minor_points: {
    id: 'minor_points',
    name: 'MINOR POINTS',
    description: '+5 PTS',
    orb: {
      type: 'point',
      amount: 5
    },
    cost: 2
  },

  // Enhanced Items (better value, higher cost)
  major_health: {
    id: 'major_health',
    name: 'MAJOR HEALTH',
    description: '+3 HP',
    orb: {
      type: 'health',
      amount: 3
    },
    cost: 5
  },

  major_points: {
    id: 'major_points',
    name: 'MAJOR POINTS',
    description: '+12 PTS',
    orb: {
      type: 'point',
      amount: 12
    },
    cost: 6
  },

  // Premium Items (maximum efficiency)
  mega_health: {
    id: 'mega_health',
    name: 'MEGA HEALTH',
    description: '+5 HP',
    orb: {
      type: 'health',
      amount: 5
    },
    cost: 8
  },

  mega_points: {
    id: 'mega_points',
    name: 'MEGA POINTS',
    description: '+20 PTS',
    orb: {
      type: 'point',
      amount: 20
    },
    cost: 10
  }
};

// Configuration for which items are available at each level
export const SHOP_AVAILABILITY: Record<number, string[]> = {
  1: ['minor_health', 'minor_points'],
  2: ['minor_health', 'minor_points'],
  3: ['minor_health', 'minor_points', 'major_health', 'major_points'],
  4: ['minor_health', 'minor_points', 'major_health', 'major_points'],
  5: ['minor_health', 'minor_points', 'major_health', 'major_points', 'mega_health', 'mega_points']
};

export function getAvailableShopItems(level: number): ShopItem[] {
  const availableIds = SHOP_AVAILABILITY[level] || SHOP_AVAILABILITY[1];
  return availableIds.map(id => SHOP_ITEMS[id]);
}

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS[id];
}