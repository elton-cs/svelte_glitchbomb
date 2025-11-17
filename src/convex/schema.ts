import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    walletAddress: v.string(),
    moonrocks: v.number(),
  }).index("by_wallet", ["walletAddress"]),
  
  games: defineTable({
    playerId: v.id("players"),
    gameId: v.number(), // Auto-incremented game number per player (starts at 1)
    progress: v.union(v.literal("new"), v.literal("inprogress"), v.literal("complete")),
    gameState: v.any(), // Stores the entire GameState object as JSON
  })
    .index("by_player", ["playerId"])
    .index("by_player_and_game", ["playerId", "gameId"]),
});
