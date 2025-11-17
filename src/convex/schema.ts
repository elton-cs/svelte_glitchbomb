import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    walletAddress: v.string(),
    moonrocks: v.number(),
  }).index("by_wallet", ["walletAddress"]),
});
