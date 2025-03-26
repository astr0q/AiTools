import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    imageUrl: v.string(),
    prompt: v.string(),
    userId: v.string(),
    createdAt: v.string(),
  }),
});