import { GameView, type Game, type Orb, type Player, ModifierType } from "./types";
import {
  init_game as create_new_game,
  apply_orb,
  purchase_item,
  advance_to_next_level,
  load_player_from_storage,
  save_player_to_storage,
  can_afford_level,
  deduct_moonrocks,
  get_level_cost,
} from "./helpers";

export const game_state = $state({
  current_view: GameView.Menu,
  current_game: null as Game | null,
  player: load_player_from_storage(),
});

// Start a new game
export function init_game(): boolean {
  // Check if player can afford level 1 (costs 10 moonrocks)
  if (!can_afford_level(game_state.player, 1)) {
    return false; // Cannot start game due to insufficient moonrocks
  }

  // Deduct moonrocks for level 1
  const success = deduct_moonrocks(game_state.player, 1);
  if (!success) {
    return false; // Failed to deduct moonrocks
  }

  // Save player data after deducting moonrocks
  save_player_to_storage(game_state.player);

  // Start the game
  game_state.current_view = GameView.Game;
  game_state.current_game = create_new_game();
  return true;
}

// Return to menu and clean up
export function back_to_menu() {
  game_state.current_view = GameView.Menu;
  game_state.current_game = null;
}

// Restart the current game with fresh state
export function restart_game() {
  game_state.current_view = GameView.Game;
  game_state.current_game = create_new_game();
}

// Enter shop after winning - preserve game state and go to shop view
// For level 7, show Victory view instead
export function enter_shop() {
  if (game_state.current_game?.level === 7) {
    game_state.current_view = GameView.Victory;
  } else {
    game_state.current_view = GameView.Shop;
  }
}

// Continue to next level from shop
export function continue_to_next_level(): boolean {
  if (!game_state.current_game) return false;

  // Check if all levels completed (7 levels total)
  if (game_state.current_game.level >= 7) {
    // All levels completed - could add victory view or return to menu
    game_state.current_view = GameView.Menu;
    game_state.current_game = null;
    return true;
  }

  const next_level = game_state.current_game.level + 1;

  // Check if player can afford the next level
  if (!can_afford_level(game_state.player, next_level)) {
    return false; // Cannot continue due to insufficient moonrocks
  }

  // Deduct moonrocks for the next level
  const success = deduct_moonrocks(game_state.player, next_level);
  if (!success) {
    return false; // Failed to deduct moonrocks
  }

  // Save player data after deducting moonrocks
  save_player_to_storage(game_state.player);

  // Advance to next level
  game_state.current_game = advance_to_next_level(game_state.current_game);
  game_state.current_view = GameView.Game;
  return true;
}

// Pull first orb from playground, apply it, and remove from list
export function pull_orb() {
  if (
    !game_state.current_game ||
    game_state.current_game.playground_orbs.length === 0
  )
    return;

  // Get first orb
  const orb = game_state.current_game.playground_orbs[0];

  // Apply its effects using helper function
  apply_orb(game_state.current_game, orb);

  // Add to pulled orbs list
  game_state.current_game.pulled_orbs = [
    ...game_state.current_game.pulled_orbs,
    orb,
  ];

  // Remove it from playground
  game_state.current_game.playground_orbs =
    game_state.current_game.playground_orbs.slice(1);
}

// Purchase shop item (user interaction wrapper)
export function buy_item(item_index: number): boolean {
  if (!game_state.current_game) return false;
  return purchase_item(game_state.current_game, item_index);
}

// Restart completely from level 1 (for Victory view)
export function restart_from_beginning(): boolean {
  // Check if player can afford level 1 (costs 10 moonrocks)
  if (!can_afford_level(game_state.player, 1)) {
    return false; // Cannot restart game due to insufficient moonrocks
  }

  // Deduct moonrocks for level 1
  const success = deduct_moonrocks(game_state.player, 1);
  if (!success) {
    return false; // Failed to deduct moonrocks
  }

  // Save player data after deducting moonrocks
  save_player_to_storage(game_state.player);

  // Restart the game
  game_state.current_view = GameView.Game;
  game_state.current_game = create_new_game(); // Fresh start - no carried over orbs or chips
  return true;
}
