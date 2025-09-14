import { ModifierType, type Orb, type Modifier, type ModifierValue } from "./types";

// Helper to create a modifier
function create_modifier(type: ModifierType, value: number): Modifier {
  return {
    type,
    value: { value }
  };
}

// Helper to create an orb with modifiers
function create_orb(modifiers: Modifier[]): Orb {
  return { modifiers };
}

// Get the starting orbs for a new game
export function get_starting_orbs(): Orb[] {
  const starting_orbs: Orb[] = [
    // 4 Bomb orbs with different values (based on old implementation)
    create_orb([create_modifier(ModifierType.Bomb, 1)]),  // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 1)]),  // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 2)]),  // Double Bomb
    create_orb([create_modifier(ModifierType.Bomb, 3)]),  // Triple Bomb

    // 3 Point orbs with value 5 each
    create_orb([create_modifier(ModifierType.Point, 5)]),  // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)]),  // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)]),  // Points 5

    // 1 Health orb
    create_orb([create_modifier(ModifierType.Health, 1)]), // Health 1

    // 1 Multiplier orb
    create_orb([create_modifier(ModifierType.Multiplier, 1)]), // Multiplier Boost
  ];

  return starting_orbs;
}

// Helper to count orbs by modifier type
export function count_orbs_by_type(orbs: Orb[], type: ModifierType): number {
  return orbs.filter(orb =>
    orb.modifiers.some(modifier => modifier.type === type)
  ).length;
}

// Helper to get total value of all modifiers of a type
export function get_total_modifier_value(orbs: Orb[], type: ModifierType): number {
  return orbs.reduce((total, orb) => {
    const modifier_value = orb.modifiers
      .filter(m => m.type === type)
      .reduce((sum, m) => sum + m.value.value, 0);
    return total + modifier_value;
  }, 0);
}

// Helper to check if an orb has a specific modifier type
export function orb_has_modifier(orb: Orb, type: ModifierType): boolean {
  return orb.modifiers.some(modifier => modifier.type === type);
}

// Helper to get a random orb from array
export function get_random_orb(orbs: Orb[]): Orb | null {
  if (orbs.length === 0) return null;
  const random_index = Math.floor(Math.random() * orbs.length);
  return orbs[random_index];
}

// Helper to remove an orb from array (returns new array)
export function remove_orb(orbs: Orb[], orb_to_remove: Orb): Orb[] {
  const index = orbs.indexOf(orb_to_remove);
  if (index === -1) return orbs;
  return [...orbs.slice(0, index), ...orbs.slice(index + 1)];
}