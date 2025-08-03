import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateUser = query({
  args: { userId: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (user) {
      return user;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      paid: false,
      imagesGenerated: 0,
      lastResetAt: new Date().toISOString(),
    });

    return await ctx.db.get(newUserId);
  },
});

export const updateUserSubscription = mutation({
  args: { 
    email: v.string(), 
    paid: v.boolean(), 
    subscriptionId: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      paid: args.paid,
      subscriptionId: args.subscriptionId,
    });

    return await ctx.db.get(user._id);
  },
});

export const incrementImageGeneration = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if we need to reset monthly counter
    const now = new Date();
    const lastReset = new Date(user.lastResetAt);
    const shouldReset = now.getMonth() !== lastReset.getMonth() || 
                       now.getFullYear() !== lastReset.getFullYear();

    const newCount = shouldReset ? 1 : user.imagesGenerated + 1;
    const newResetDate = shouldReset ? now.toISOString() : user.lastResetAt;

    await ctx.db.patch(user._id, {
      imagesGenerated: newCount,
      lastResetAt: newResetDate,
    });

    return {
      imagesGenerated: newCount,
      maxImages: user.paid ? -1 : 5,
      canGenerate: user.paid || newCount <= 5,
    };
  },
});

export const resetMonthlyUsage = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      imagesGenerated: 0,
      lastResetAt: new Date().toISOString(),
    });

    return await ctx.db.get(user._id);
  },
});