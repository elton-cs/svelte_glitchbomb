import { ModifierType, OrbCategory, type Orb, type Modifier, type Game } from "./types";

// Helper to create a modifier
function create_modifier(type: ModifierType, value: number): Modifier {
  return {
    type,
    value: { value },
  };
}

// Helper to create an orb with modifiers and category
function create_orb(modifiers: Modifier[], category: OrbCategory): Orb {
  return { modifiers, category };
}

// Get the starting orbs for a new game
function build_starting_orbs(): Orb[] {
  const starting_orbs: Orb[] = [
    // 4 Bomb orbs with different values (based on old implementation)
    create_orb([create_modifier(ModifierType.Bomb, 1)], OrbCategory.Bomb), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 1)], OrbCategory.Bomb), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 2)], OrbCategory.Bomb), // Double Bomb
    create_orb([create_modifier(ModifierType.Bomb, 3)], OrbCategory.Bomb), // Triple Bomb

    // 3 Point orbs with value 5 each
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)], OrbCategory.Point), // Points 5

    // 1 Health orb
    create_orb([create_modifier(ModifierType.Health, 1)], OrbCategory.Health), // Health 1

    // 1 Multiplier orb
    create_orb([create_modifier(ModifierType.Multiplier, 1)], OrbCategory.Multiplier), // Multiplier Boost
  ];

  return starting_orbs;
}

// Flatten multiple orb arrays into one and shuffle the result
export function flatten_and_shuffle_orbs(orb_lists: Orb[][]): Orb[] {
  // Flatten all arrays into one
  const flattened_orbs = orb_lists.flat();

  // Shuffle using Fisher-Yates algorithm
  const shuffled_orbs = [...flattened_orbs];
  for (let i = shuffled_orbs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled_orbs[i], shuffled_orbs[j]] = [shuffled_orbs[j], shuffled_orbs[i]];
  }

  return shuffled_orbs;
}

// Initialize a new game with all default values
export function init_game(): Game {
  const starting_orbs = build_starting_orbs();
  const purchased_orbs: Orb[] = [];
  const playground_orbs = flatten_and_shuffle_orbs([
    starting_orbs,
    purchased_orbs,
  ]);

  return {
    level: 1,
    points: 0,
    milestone: 12,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
    starting_orbs,
    purchased_orbs,
    playground_orbs,
  };
}
