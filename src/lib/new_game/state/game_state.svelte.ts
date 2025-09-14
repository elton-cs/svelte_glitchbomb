import { GameView, type Game, type Orb, ModifierType } from "./types";
import { init_game as create_new_game } from "./helpers";

export const game_state = $state({
  current_view: GameView.Menu,
  game: null as Game | null,
});

// Start a new game
export function init_game() {
  game_state.current_view = GameView.Game;
  game_state.game = create_new_game();
}

// Return to menu and clean up
export function back_to_menu() {
  game_state.current_view = GameView.Menu;
  game_state.game = null;
}

// Apply orb effects to game state
export function apply_orb(orb: Orb) {
  if (!game_state.game) return;

  for (const modifier of orb.modifiers) {
    switch (modifier.type) {
      case ModifierType.Bomb:
        // Bomb deals damage (reduce health, minimum 0)
        game_state.game.health = Math.max(0, game_state.game.health - modifier.value.value);
        break;

      case ModifierType.Health:
        // Health restores health (maximum is max_health)
        game_state.game.health = Math.min(game_state.game.max_health, game_state.game.health + modifier.value.value);
        break;

      case ModifierType.Point:
        // Points add to score
        game_state.game.points += modifier.value.value;
        break;

      case ModifierType.Multiplier:
        // Multiplier increases the multiplier value
        game_state.game.multiplier += modifier.value.value;
        break;
    }
  }
}

// Pull first orb from playground, apply it, and remove from list
export function pull_orb() {
  if (!game_state.game || game_state.game.playground_orbs.length === 0) return;

  // Get first orb
  const orb = game_state.game.playground_orbs[0];

  // Apply its effects
  apply_orb(orb);

  // Remove it from playground
  game_state.game.playground_orbs = game_state.game.playground_orbs.slice(1);
}
