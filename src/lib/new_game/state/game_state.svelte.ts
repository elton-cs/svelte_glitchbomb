import { GameView, type Game } from "./types";

export const game_state = $state({
  current_view: GameView.Menu,
  game: null as Game | null,
});

// Private atomic navigation functions
function go_to_menu() {
  game_state.current_view = GameView.Menu;
}

function go_to_shop() {
  game_state.current_view = GameView.Shop;
}

function go_to_game() {
  game_state.current_view = GameView.Game;
}

function go_to_win() {
  game_state.current_view = GameView.Win;
}

function go_to_lose() {
  game_state.current_view = GameView.Lose;
}

// Private atomic game functions
function create_game() {
  game_state.game = {
    level: 1,
    points: 0,
    milestone: 10,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
  };
}

function clear_game() {
  game_state.game = null;
}

// Private atomic mutation functions
function set_level(level: number) {
  if (game_state.game) game_state.game.level = level;
}

function set_points(points: number) {
  if (game_state.game) game_state.game.points = points;
}

function set_milestone(milestone: number) {
  if (game_state.game) game_state.game.milestone = milestone;
}

function set_health(health: number) {
  if (game_state.game) game_state.game.health = health;
}

function set_max_health(max_health: number) {
  if (game_state.game) game_state.game.max_health = max_health;
}

function set_multiplier(multiplier: number) {
  if (game_state.game) game_state.game.multiplier = multiplier;
}

function set_chips(chips: number) {
  if (game_state.game) game_state.game.chips = chips;
}

// Private atomic increment/decrement helpers
function add_points(amount: number) {
  if (game_state.game) game_state.game.points += amount;
}

function add_chips(amount: number) {
  if (game_state.game) game_state.game.chips += amount;
}

function add_health(amount: number) {
  if (game_state.game) {
    game_state.game.health = Math.min(game_state.game.health + amount, game_state.game.max_health);
  }
}

function remove_health(amount: number) {
  if (game_state.game) {
    game_state.game.health = Math.max(0, game_state.game.health - amount);
  }
}

// EXPORTED COMPOSITE FUNCTIONS - These are the only functions that should be used by components

// Start a new game
export function init_game() {
  create_game();
  go_to_game();
}

// Return to menu and clean up
export function back_to_menu() {
  go_to_menu();
  clear_game();
}

// Navigate to shop (keeping game state)
export function open_shop() {
  go_to_shop();
}

// Return from shop to game
export function close_shop() {
  go_to_game();
}

// Game over scenarios
export function trigger_win() {
  go_to_win();
}

export function trigger_lose() {
  go_to_lose();
  if (game_state.game) {
    set_health(0);
  }
}

// Gameplay actions
export function earn_points(amount: number) {
  add_points(amount);
  // Check for milestone
  if (game_state.game && game_state.game.points >= game_state.game.milestone) {
    // Handle level up or win condition
  }
}

export function spend_chips(amount: number) {
  if (game_state.game && game_state.game.chips >= amount) {
    add_chips(-amount);
    return true;
  }
  return false;
}

export function take_damage(amount: number) {
  remove_health(amount);
  if (game_state.game && game_state.game.health <= 0) {
    trigger_lose();
  }
}

export function heal(amount: number) {
  add_health(amount);
}

export function level_up() {
  if (game_state.game) {
    set_level(game_state.game.level + 1);
    set_milestone(game_state.game.milestone + 10);
    set_points(0);
  }
}
