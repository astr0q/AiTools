import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    imageUrl: v.string(),
    prompt: v.string(),
    userId: v.string(),
    createdAt: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    pictureURL: v.string(),
    createdAt: v.string(),
  }),
});