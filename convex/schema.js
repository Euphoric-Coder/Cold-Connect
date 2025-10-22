import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    resumeURL: v.optional(v.string()),
    githubURL: v.optional(v.string()),
    portfolioURL: v.optional(v.string()),
    linkedinURL: v.optional(v.string()),
    hasOnboarded: v.boolean(),
  }).index("by_email", ["email"]),

  resumeFiles: defineTable({
    fileId: v.string(),
    storageId: v.string("_storage"),
    fileName: v.string(),
    fileURL: v.string(),
    createdBy: v.string(),
  }).index("by_storageId", ["storageId"]),

  // Table storing project metadata (reactive, used in UI)
  projects: defineTable({
    userEmail: v.string(), // Clerk user ID
    projectName: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    projectURL: v.string(),
    embeddingId: v.optional(v.id("projectEmbeddings")), // link to embedding row
    createdAt: v.number(), // Date.now()
  }).index("by_userEmail", ["userEmail"]),

  // Separate table for embeddings (big vectors live here)
  projectEmbeddings: defineTable({
    embedding: v.array(v.float64()), // Gemini embedding vector
    userEmail: v.string(), // same Clerk user ID
    projectId: v.id("projects"), // reference back to the project
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["userEmail"],
  }),
});
