import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new user and assign them 10 credits
export const createNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    pictureURL: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .collect();

    // If user does not exist, create a new one with 10 credits
    if (!user[0]?.email) {
      const userData = {
        name: args.name,
        email: args.email,
        pictureURL: args.pictureURL,
        credits: 10, // Assign 10 credits to new users
      };
      const result = await ctx.db.insert("users", userData);
      return userData;
    }
    // If the user exists, return the existing user
    return user[0];
  },
});

// Query to get the user by email
export const getUser = query({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Deduct credits from the user (for tasks like image generation)
export const deductCredit = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  
    if (!user || user.credits < 1) {
      throw new Error("Not enough credits");
    }
  
    await ctx.db.patch(user._id, {
      credits: user.credits - 1
    });
  
    return user.credits - 1;
  },
});

// Add this mutation to give credits to a user
export const addCredits = mutation({
  args: { email: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      credits: (user.credits || 0) + args.amount
    });

    return user._id;
  },
});

export const getUserCredits = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    return user?.credits || 0;
  },
});

// Add this mutation if you don't have it already
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      credits: 3,  // Set initial credits to 5
      createdAt: new Date().toISOString(),
    });
  },
});

export const UpdateUserCredits = mutation({
  args: {
    uid: v.id('users'),
    credits: v.number(),
   },
   handler: async (ctx, args) => {
    const user = await ctx.db.get(args.uid);
    if (!user) throw new Error("User not found");

    const result = await ctx.db.patch(args.uid, {
      credits: user.credits + args.credits
    });
    return result;
   },
})
