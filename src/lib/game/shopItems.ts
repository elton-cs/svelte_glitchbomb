import type { ShopItem } from './types.js';

// Common tier - basic amounts, affordable prices
export const COMMON_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'common_health',
    name: 'BASIC HEALTH',
    description: '+1 HP',
    type: 'health',
    amount: 1,
    cost: 2
  },
  {
    id: 'common_point',
    name: 'BASIC POINTS',
    description: '+3 PTS',
    type: 'point',
    amount: 3,
    cost: 2
  },
  {
    id: 'common_points_per_anyorb',
    name: 'BASIC COMBO',
    description: '+1 per orb',
    type: 'points_per_anyorb',
    amount: 1,
    cost: 3
  },
  {
    id: 'common_points_per_bombpulled',
    name: 'BASIC DANGER',
    description: '+2 per bomb',
    type: 'points_per_bombpulled',
    amount: 2,
    cost: 3
  },
  {
    id: 'common_multiplier',
    name: 'BASIC BOOST',
    description: '+0.2x mult',
    type: 'multiplier',
    amount: 0.2,
    cost: 4
  }
];

// Rare tier - enhanced amounts, moderate prices
export const RARE_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'rare_health',
    name: 'ENHANCED HEALTH',
    description: '+2 HP',
    type: 'health',
    amount: 2,
    cost: 4
  },
  {
    id: 'rare_point',
    name: 'ENHANCED POINTS',
    description: '+8 PTS',
    type: 'point',
    amount: 8,
    cost: 4
  },
  {
    id: 'rare_points_per_anyorb',
    name: 'ENHANCED COMBO',
    description: '+2 per orb',
    type: 'points_per_anyorb',
    amount: 2,
    cost: 6
  },
  {
    id: 'rare_points_per_bombpulled',
    name: 'ENHANCED DANGER',
    description: '+4 per bomb',
    type: 'points_per_bombpulled',
    amount: 4,
    cost: 6
  },
  {
    id: 'rare_multiplier',
    name: 'ENHANCED BOOST',
    description: '+0.4x mult',
    type: 'multiplier',
    amount: 0.4,
    cost: 8
  }
];

// Cosmic tier - maximum amounts, premium prices
export const COSMIC_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'cosmic_health',
    name: 'COSMIC HEALTH',
    description: '+3 HP',
    type: 'health',
    amount: 3,
    cost: 8
  },
  {
    id: 'cosmic_point',
    name: 'COSMIC POINTS',
    description: '+15 PTS',
    type: 'point',
    amount: 15,
    cost: 8
  },
  {
    id: 'cosmic_points_per_anyorb',
    name: 'COSMIC COMBO',
    description: '+3 per orb',
    type: 'points_per_anyorb',
    amount: 3,
    cost: 12
  },
  {
    id: 'cosmic_points_per_bombpulled',
    name: 'COSMIC DANGER',
    description: '+8 per bomb',
    type: 'points_per_bombpulled',
    amount: 8,
    cost: 12
  },
  {
    id: 'cosmic_multiplier',
    name: 'COSMIC BOOST',
    description: '+0.8x mult',
    type: 'multiplier',
    amount: 0.8,
    cost: 15
  }
];

// Legacy shop items object for backwards compatibility
export const SHOP_ITEMS: Record<string, ShopItem> = {
  ...Object.fromEntries(COMMON_SHOP_ITEMS.map(item => [item.id, item])),
  ...Object.fromEntries(RARE_SHOP_ITEMS.map(item => [item.id, item])),
  ...Object.fromEntries(COSMIC_SHOP_ITEMS.map(item => [item.id, item]))
};

// Configuration for which tiers are available at each level
export const SHOP_TIER_AVAILABILITY: Record<number, ('common' | 'rare' | 'cosmic')[]> = {
  1: ['common'],
  2: ['common', 'rare'],
  3: ['common', 'rare'],
  4: ['common', 'rare'],
  5: ['common', 'rare', 'cosmic']
};

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getAvailableShopItems(level: number): ShopItem[] {
  const availableTiers = SHOP_TIER_AVAILABILITY[level] || SHOP_TIER_AVAILABILITY[1];
  const items: ShopItem[] = [];
  
  // Always try to get 3 common items
  if (availableTiers.includes('common')) {
    const shuffledCommon = shuffleArray(COMMON_SHOP_ITEMS);
    items.push(...shuffledCommon.slice(0, 3));
  }
  
  // Try to get 2 rare items (if available at this level)
  if (availableTiers.includes('rare')) {
    const shuffledRare = shuffleArray(RARE_SHOP_ITEMS);
    items.push(...shuffledRare.slice(0, 2));
  }
  
  // Try to get 1 cosmic item (if available at this level)
  if (availableTiers.includes('cosmic')) {
    const shuffledCosmic = shuffleArray(COSMIC_SHOP_ITEMS);
    items.push(...shuffledCosmic.slice(0, 1));
  }
  
  return items;
}

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS[id];
}