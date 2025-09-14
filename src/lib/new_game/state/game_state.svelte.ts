import { GameView, type Game } from "./types";

export const game_state = $state({
  current_view: GameView.Menu,
  game: null as Game | null,
});

export function init_game() {
  game_state.game = {
    level: 1,
    points: 0,
    milestone: 10,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
  };
  game_state.current_view = GameView.Game;
}
