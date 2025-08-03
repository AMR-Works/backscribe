import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logGeneration = mutation({
  args: { 
    userId: v.string(),
    imageUrl: v.optional(v.string()),
    textContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("generations", {
      userId: args.userId,
      imageUrl: args.imageUrl,
      textContent: args.textContent,
      generatedAt: new Date().toISOString(),
    });
  },
});

export const getUserGenerations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getTotalUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

export const getPaidUsers = query({
  args: {},
  handler: async (ctx) => {
    const paidUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("paid"), true))
      .collect();
    return paidUsers.length;
  },
});