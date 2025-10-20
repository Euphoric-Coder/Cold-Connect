import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Generate upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Add Resume
export const addFile = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    fileURL: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("resumeFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileURL: args.fileURL,
      createdBy: args.createdBy,
    });
    return "File added successfully";
  },
});

// Update file name
export const updateFileName = mutation({
  args: {
    storageId: v.id("_storage"),
    newName: v.string(),
  },
  handler: async (ctx, { storageId, newName }) => {
    const file = await ctx.db
      .query("resumeFiles")
      .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
      .first();

    if (!file) {
      throw new Error("File not found for the given storageId.");
    }

    await ctx.db.patch(file._id, {
      fileName: newName,
    });

    return { success: true, message: "File name updated successfully." };
  },
});