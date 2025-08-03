import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    paid: v.boolean(),
    subscriptionId: v.optional(v.string()),
    imagesGenerated: v.number(),
    lastResetAt: v.string(), // ISO date string
  }).index("by_user_id", ["userId"]).index("by_email", ["email"]),
  
  generations: defineTable({
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    textContent: v.string(),
    generatedAt: v.string(), // ISO date string
  }).index("by_user_id", ["userId"]),
});