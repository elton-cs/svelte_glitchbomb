import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const controllerWalletSignup = mutation({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("controllerWalletSignup mutation called with wallet:", args.walletAddress);

    // Check if player already exists
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();

    if (existingPlayer) {
      console.log("Existing player found:", existingPlayer);
      return existingPlayer;
    }

    // Create new player with 1000 moonrocks
    const newPlayer = {
      walletAddress: args.walletAddress,
      moonrocks: 1000,
    };

    const playerId = await ctx.db.insert("players", newPlayer);
    const createdPlayer = await ctx.db.get(playerId);
    
    console.log("New player created:", createdPlayer);
    return createdPlayer;
  },
});
