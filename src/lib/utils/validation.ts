export function validatePurchase(bits: number, cost: number): boolean {
  return bits >= cost && cost > 0;
}

export function validateQuantity(quantity: number, maxQuantity?: number): boolean {
  if (quantity < 1) return false;
  if (maxQuantity !== undefined && quantity > maxQuantity) return false;
  return true;
}

export function validateHealth(health: number, maxHealth: number): boolean {
  return health >= 0 && health <= maxHealth;
}

export function validatePoints(points: number): boolean {
  return points >= 0;
}

export function validateGlitchbytes(glitchbytes: number): boolean {
  return glitchbytes >= 0;
}