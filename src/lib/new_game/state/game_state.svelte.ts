import { GameView, type Game } from "./types";
import { get_starting_orbs } from "./helpers";

export const game_state = $state({
  current_view: GameView.Menu,
  game: null as Game | null,
});

// Start a new game
export function init_game() {
  game_state.current_view = GameView.Game;
  game_state.game = {
    level: 1,
    points: 0,
    milestone: 10,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
    starting_orbs: get_starting_orbs(),
    purchased_orbs: [],
  };
}

// Return to menu and clean up
export function back_to_menu() {
  game_state.current_view = GameView.Menu;
  game_state.game = null;
}
