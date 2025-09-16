import { GameView, type Game, type Orb, ModifierType } from "./types";
import { init_game as create_new_game, apply_orb, purchase_item } from "./helpers";

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

// Enter shop after winning - reset game state but go to shop view
export function enter_shop() {
  const current_chips = game_state.game?.chips || 0;
  game_state.current_view = GameView.Shop;
  game_state.game = create_new_game();
  game_state.game.chips = current_chips;
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
