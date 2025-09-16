import { GameView, type Game, type Orb, ModifierType } from "./types";
import { init_game as create_new_game, apply_orb, purchase_item, advance_to_next_level } from "./helpers";

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

// Restart the current game with fresh state
export function restart_game() {
  game_state.current_view = GameView.Game;
  game_state.game = create_new_game();
}

// Enter shop after winning - preserve game state and go to shop view
export function enter_shop() {
  game_state.current_view = GameView.Shop;
}

// Continue to next level from shop
export function continue_to_next_level() {
  if (!game_state.game) return;

  // Check if all levels completed (7 levels total)
  if (game_state.game.level >= 7) {
    // All levels completed - could add victory view or return to menu
    game_state.current_view = GameView.Menu;
    game_state.game = null;
    return;
  }

  // Advance to next level
  game_state.game = advance_to_next_level(game_state.game);
  game_state.current_view = GameView.Game;
}

// Pull first orb from playground, apply it, and remove from list
export function pull_orb() {
  if (!game_state.game || game_state.game.playground_orbs.length === 0) return;

  // Get first orb
  const orb = game_state.game.playground_orbs[0];

  // Apply its effects using helper function
  apply_orb(game_state.game, orb);

  // Add to pulled orbs list
  game_state.game.pulled_orbs = [...game_state.game.pulled_orbs, orb];

  // Remove it from playground
  game_state.game.playground_orbs = game_state.game.playground_orbs.slice(1);
}

// Purchase shop item (user interaction wrapper)
export function buy_item(item_index: number): boolean {
  if (!game_state.game) return false;
  return purchase_item(game_state.game, item_index);
}
