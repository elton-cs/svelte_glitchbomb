import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Duplicated from src/lib/game/constants.ts
const GAME_CONFIG = {
  initialGlitchbytes: 1000,
  maxHealth: 5,
  orbCosts: {
    health: 2,
    point: 2,
  },
  startingOrbs: {
    points_per_anyorb: 1,
    points_per_bombpulled: 4,
    multiplier: 1,
  },
};

// Helper to create initial orb bag (duplicated from createInitialBag)
function createInitialOrbBag() {
  const bombOrbs = [
    { type: "bomb", amount: 1 },
    { type: "bomb", amount: 1 },
    { type: "bomb", amount: 2 },
    { type: "bomb", amount: 3 },
  ];

  const pointOrbs = [
    { type: "point", amount: 5 },
    { type: "point", amount: 5 },
    { type: "point", amount: 5 },
  ];

  const healthOrbs = [{ type: "health", amount: 1 }];

  const pointsPerAnyOrbOrbs = [
    { type: "points_per_anyorb", amount: GAME_CONFIG.startingOrbs.points_per_anyorb },
  ];

  const pointsPerBombPulledOrbs = [
    { type: "points_per_bombpulled", amount: GAME_CONFIG.startingOrbs.points_per_bombpulled },
  ];

  const multiplierOrbs = [
    { type: "multiplier", amount: GAME_CONFIG.startingOrbs.multiplier },
  ];

  return {
    health: {
      available: [...healthOrbs],
      total: [...healthOrbs],
    },
    point: {
      available: [...pointOrbs],
      total: [...pointOrbs],
    },
    bomb: {
      available: [...bombOrbs],
      total: [...bombOrbs],
    },
    points_per_anyorb: {
      available: [...pointsPerAnyOrbOrbs],
      total: [...pointsPerAnyOrbOrbs],
    },
    points_per_bombpulled: {
      available: [...pointsPerBombPulledOrbs],
      total: [...pointsPerBombPulledOrbs],
    },
    multiplier: {
      available: [...multiplierOrbs],
      total: [...multiplierOrbs],
    },
    bits: {
      available: [],
      total: [],
    },
    glitchbytes: {
      available: [],
      total: [],
    },
  };
}

// Duplicated logic from createInitialGameState
function createInitialGameState(glitchbytes: number = GAME_CONFIG.initialGlitchbytes) {
  return {
    phase: "menu",
    currentLevel: 1,
    playerStats: {
      glitchbytes,
      chips: 0,
      health: GAME_CONFIG.maxHealth,
      points: 0,
      bombsPulledThisLevel: 0,
      levelMultiplier: 1.0,
    },
    orbBag: createInitialOrbBag(),
    marketplace: {
      available: false,
      healthOrbCost: GAME_CONFIG.orbCosts.health,
      pointOrbCost: GAME_CONFIG.orbCosts.point,
      currentShopItems: [],
    },
    shopDeck: {
      common: [],
      rare: [],
      cosmic: [],
    },
    gameLog: [],
    pointHistory: [],
    gameStarted: false,
    levelCompleted: false,
    committedToNextLevel: false,
    matrixDisarrayActive: false,
  };
}

export const newGame = mutation({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("newGame mutation called with wallet:", args.walletAddress);

    // Find the player by wallet address
    const player = await ctx.db
      .query("players")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();

    if (!player) {
      throw new Error(`Player with wallet ${args.walletAddress} not found`);
    }

    // Get the latest gameId for this player to determine next gameId
    const playerGames = await ctx.db
      .query("games")
      .withIndex("by_player", (q) => q.eq("playerId", player._id))
      .collect();

    const nextGameId = playerGames.length + 1;

    // Create initial game state using duplicated logic
    const initialGameState = createInitialGameState(1000);

    // Create new game entry
    const newGameData = {
      playerId: player._id,
      gameId: nextGameId,
      progress: "new" as const,
      gameState: initialGameState,
    };

    const gameId = await ctx.db.insert("games", newGameData);
    const createdGame = await ctx.db.get(gameId);

    console.log("New game created:", createdGame);
    return createdGame;
  },
});

export const updateGame = mutation({
  args: {
    walletAddress: v.string(),
    gameState: v.any(),
  },
  handler: async (ctx, args) => {
    console.log("updateGame mutation called with wallet:", args.walletAddress);

    // Find the player by wallet address
    const player = await ctx.db
      .query("players")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();

    if (!player) {
      throw new Error(`Player with wallet ${args.walletAddress} not found`);
    }

    // Get the latest game for this player
    const latestGame = await ctx.db
      .query("games")
      .withIndex("by_player", (q) => q.eq("playerId", player._id))
      .order("desc")
      .first();

    if (!latestGame) {
      throw new Error(`No games found for player with wallet ${args.walletAddress}`);
    }

    // Update the game state
    await ctx.db.patch(latestGame._id, { gameState: args.gameState });

    const updatedGame = await ctx.db.get(latestGame._id);
    console.log("Game state updated for gameId:", latestGame.gameId);

    return updatedGame;
  },
});
