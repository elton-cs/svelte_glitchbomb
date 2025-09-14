import { GameView, type Game } from "./types";

export const game_state = $state({
  current_view: GameView.Menu,
  game: null as Game | null,
});

// Navigation functions - atomic, single field mutations
export function go_to_menu() {
  game_state.current_view = GameView.Menu;
}

export function go_to_shop() {
  game_state.current_view = GameView.Shop;
}

export function go_to_game() {
  game_state.current_view = GameView.Game;
}

export function go_to_win() {
  game_state.current_view = GameView.Win;
}

export function go_to_lose() {
  game_state.current_view = GameView.Lose;
}

// Game initialization - atomic functions
export function create_game() {
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

export function clear_game() {
  game_state.game = null;
}

// Composite function using atomic functions
export function init_game() {
  create_game();
  go_to_game();
}

// Game state mutation functions - atomic
export function set_level(level: number) {
  if (game_state.game) game_state.game.level = level;
}

export function set_points(points: number) {
  if (game_state.game) game_state.game.points = points;
}

export function set_milestone(milestone: number) {
  if (game_state.game) game_state.game.milestone = milestone;
}

export function set_health(health: number) {
  if (game_state.game) game_state.game.health = health;
}

export function set_max_health(max_health: number) {
  if (game_state.game) game_state.game.max_health = max_health;
}

export function set_multiplier(multiplier: number) {
  if (game_state.game) game_state.game.multiplier = multiplier;
}

export function set_chips(chips: number) {
  if (game_state.game) game_state.game.chips = chips;
}

// Increment/decrement helpers - atomic
export function add_points(amount: number) {
  if (game_state.game) game_state.game.points += amount;
}

export function add_chips(amount: number) {
  if (game_state.game) game_state.game.chips += amount;
}

export function add_health(amount: number) {
  if (game_state.game) {
    game_state.game.health = Math.min(game_state.game.health + amount, game_state.game.max_health);
  }
}

export function remove_health(amount: number) {
  if (game_state.game) {
    game_state.game.health = Math.max(0, game_state.game.health - amount);
  }
}
