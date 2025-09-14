import { ModifierType, type Orb, type Modifier, type Game } from "./types";

// Helper to create a modifier
function create_modifier(type: ModifierType, value: number): Modifier {
  return {
    type,
    value: { value },
  };
}

// Helper to create an orb with modifiers
function create_orb(modifiers: Modifier[]): Orb {
  return { modifiers };
}

// Get the starting orbs for a new game
function build_starting_orbs(): Orb[] {
  const starting_orbs: Orb[] = [
    // 4 Bomb orbs with different values (based on old implementation)
    create_orb([create_modifier(ModifierType.Bomb, 1)]), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 1)]), // Bomb 1
    create_orb([create_modifier(ModifierType.Bomb, 2)]), // Double Bomb
    create_orb([create_modifier(ModifierType.Bomb, 3)]), // Triple Bomb

    // 3 Point orbs with value 5 each
    create_orb([create_modifier(ModifierType.Point, 5)]), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)]), // Points 5
    create_orb([create_modifier(ModifierType.Point, 5)]), // Points 5

    // 1 Health orb
    create_orb([create_modifier(ModifierType.Health, 1)]), // Health 1

    // 1 Multiplier orb
    create_orb([create_modifier(ModifierType.Multiplier, 1)]), // Multiplier Boost
  ];

  return starting_orbs;
}

// Initialize a new game with all default values
export function init_game(): Game {
  return {
    level: 1,
    points: 0,
    milestone: 10,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
    starting_orbs: build_starting_orbs(),
    purchased_orbs: [],
  };
}
