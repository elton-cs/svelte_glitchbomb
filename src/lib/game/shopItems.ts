import type { ShopItem, ShopDeck, ShopDeckItem } from './types.js';

// Common tier - basic amounts, affordable prices
export const COMMON_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'common_point_5',
    name: 'POINTS',
    description: '+5 PTS',
    type: 'point',
    amount: 5,
    cost: 5
  },
  {
    id: 'common_point_7',
    name: 'POINTS',
    description: '+7 PTS',
    type: 'point',
    amount: 7,
    cost: 8
  },
  {
    id: 'common_bits_15',
    name: 'BITS',
    description: '+15 bits',
    type: 'bits',
    amount: 15,
    cost: 5
  },
  {
    id: 'common_glitchbytes_15',
    name: 'GLITCH BYTES',
    description: '+15 🌙',
    type: 'glitchbytes',
    amount: 15,
    cost: 8
  },
  {
    id: 'common_points_per_bombpulled_4',
    name: 'DANGER',
    description: '+4 per bomb',
    type: 'points_per_bombpulled',
    amount: 4,
    cost: 6
  },
  {
    id: 'common_health_1',
    name: 'HEALTH',
    description: '+1 HP',
    type: 'health',
    amount: 1,
    cost: 9
  },
  {
    id: 'common_multiplier_05',
    name: 'MULTIPLIER',
    description: '+0.5x mult',
    type: 'multiplier',
    amount: 0.5,
    cost: 9
  }
];

// Rare tier - enhanced amounts, moderate prices
export const RARE_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'rare_point_8',
    name: 'POINTS',
    description: '+8 PTS',
    type: 'point',
    amount: 8,
    cost: 11
  },
  {
    id: 'rare_point_9',
    name: 'POINTS',
    description: '+9 PTS',
    type: 'point',
    amount: 9,
    cost: 13
  },
  {
    id: 'rare_multiplier_next_point',
    name: 'MULTIPLIER',
    description: '+1.0x mult',
    type: 'multiplier',
    amount: 1.0,
    cost: 14
  },
  {
    id: 'rare_multiplier_15',
    name: 'MULTIPLIER',
    description: '+1.5x mult',
    type: 'multiplier',
    amount: 1.5,
    cost: 16
  }
];

// Cosmic tier - maximum amounts, premium prices
export const COSMIC_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'cosmic_health_3',
    name: 'HEALTH',
    description: 'Gain 3 Health',
    type: 'health',
    amount: 3,
    cost: 21
  },
  {
    id: 'cosmic_glitchbytes_40',
    name: 'GLITCH BYTES',
    description: '+40 🌙',
    type: 'glitchbytes',
    amount: 40,
    cost: 23
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
  1: ['common', 'rare', 'cosmic'],
  2: ['common', 'rare', 'cosmic'],
  3: ['common', 'rare', 'cosmic'],
  4: ['common', 'rare', 'cosmic'],
  5: ['common', 'rare', 'cosmic'],
  6: ['common', 'rare', 'cosmic'],
  7: ['common', 'rare', 'cosmic']
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
  
  // Always get 3 common items
  if (availableTiers.includes('common')) {
    const shuffledCommon = shuffleArray(COMMON_SHOP_ITEMS);
    items.push(...shuffledCommon.slice(0, 3));
  }
  
  // Always get 2 rare items
  if (availableTiers.includes('rare')) {
    const shuffledRare = shuffleArray(RARE_SHOP_ITEMS);
    items.push(...shuffledRare.slice(0, 2));
  }
  
  // Always get 1 cosmic item
  if (availableTiers.includes('cosmic')) {
    const shuffledCosmic = shuffleArray(COSMIC_SHOP_ITEMS);
    items.push(...shuffledCosmic.slice(0, 1));
  }
  
  return items;
}

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS[id];
}

// ShopDeck Management Functions

/**
 * Calculate dynamic price based on purchase count with 20% increase per purchase
 */
export function calculateDynamicPrice(baseCost: number, purchaseCount: number): number {
  return Math.ceil(baseCost * Math.pow(1.2, purchaseCount));
}

/**
 * Convert a ShopItem to ShopDeckItem with initial pricing
 */
function createShopDeckItem(shopItem: ShopItem): ShopDeckItem {
  return {
    ...shopItem,
    baseCost: shopItem.cost,
    currentCost: shopItem.cost,
    purchaseCount: 0
  };
}

/**
 * Initialize a complete ShopDeck from static item arrays
 */
export function initializeShopDeck(): ShopDeck {
  return {
    common: COMMON_SHOP_ITEMS.map(createShopDeckItem),
    rare: RARE_SHOP_ITEMS.map(createShopDeckItem),
    cosmic: COSMIC_SHOP_ITEMS.map(createShopDeckItem)
  };
}

/**
 * Find a deck item by ID across all tiers
 */
export function findDeckItem(shopDeck: ShopDeck, itemId: string): ShopDeckItem | undefined {
  const allItems = [...shopDeck.common, ...shopDeck.rare, ...shopDeck.cosmic];
  return allItems.find(item => item.id === itemId);
}

/**
 * Update deck item price after purchase
 */
export function updateDeckItemPrice(deckItem: ShopDeckItem): void {
  deckItem.purchaseCount += 1;
  deckItem.currentCost = calculateDynamicPrice(deckItem.baseCost, deckItem.purchaseCount);
}

/**
 * Get available shop items from deck (replaces old function)
 */
export function getAvailableShopItemsFromDeck(shopDeck: ShopDeck, level: number): ShopDeckItem[] {
  const availableTiers = SHOP_TIER_AVAILABILITY[level] || SHOP_TIER_AVAILABILITY[1];
  const items: ShopDeckItem[] = [];
  
  // Always get 3 common items
  if (availableTiers.includes('common')) {
    const shuffledCommon = shuffleArray(shopDeck.common);
    items.push(...shuffledCommon.slice(0, 3));
  }
  
  // Always get 2 rare items
  if (availableTiers.includes('rare')) {
    const shuffledRare = shuffleArray(shopDeck.rare);
    items.push(...shuffledRare.slice(0, 2));
  }
  
  // Always get 1 cosmic item
  if (availableTiers.includes('cosmic')) {
    const shuffledCosmic = shuffleArray(shopDeck.cosmic);
    items.push(...shuffledCosmic.slice(0, 1));
  }
  
  return items.sort((a, b) => a.currentCost - b.currentCost);
}
