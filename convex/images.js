import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserImages = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const saveImage = mutation({
  args: {
    imageUrl: v.string(),
    prompt: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const imageId = await ctx.db.insert("images", {
      imageUrl: args.imageUrl,
      prompt: args.prompt,
      userId: args.userId,
      createdAt: new Date().toISOString(),
    });
    return imageId;
  },
});

export const deleteImage = mutation({
  args: {
      id: v.id("images"),
      userId: v.string()
  },
  handler: async (ctx, args) => {
      // Verify the user owns this image
      const image = await ctx.db.get(args.id);
      if (!image || image.userId !== args.userId) {
          throw new Error("Unauthorized or image not found");
      }
      
      await ctx.db.delete(args.id);
  },
});