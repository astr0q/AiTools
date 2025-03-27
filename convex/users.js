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
    // Add console.log for debugging
    console.log("Creating new user:", args);

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }

    const newUser = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      credits: 5, // Default credits for new users
      pictureURL: args.pictureURL || "",
      createdAt: new Date().toISOString(),
    });

    console.log("New user created:", newUser);
    return newUser;
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
