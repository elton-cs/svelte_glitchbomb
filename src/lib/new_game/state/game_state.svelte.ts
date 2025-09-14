import { GameView, type Game } from "./types";

export const gameState = $state({
  currentView: GameView.Menu,
  game: null as Game | null,
});

export function initGame() {
  gameState.game = {
    level: 1,
    points: 0,
    milestone: 10,
    health: 5,
    max_health: 5,
    multiplier: 1,
    chips: 0,
  };
  gameState.currentView = GameView.Game;
}
