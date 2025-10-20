import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * 🗑️ Deletes a file from Convex Storage by storageId.
 * Used by FileUpload.jsx when the user removes an uploaded resume.
 */
export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"), // Validate that this is a valid Convex storage ID
  },
  handler: async (ctx, args) => {
    try {
      // Step 1: Attempt to delete the file from Convex storage
      await ctx.storage.delete(args.storageId);
      console.log("✅ Resume deleted successfully:", args.storageId);

      // Step 2 (Optional): If you also store metadata in resumeFiles table,
      // remove it there too for full cleanup.
      const existingFile = await ctx.db
        .query("resumeFiles")
        .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
        .first();

      if (existingFile) {
        await ctx.db.delete(existingFile._id);
        console.log("🧹 Removed resume metadata from resumeFiles table.");
      }

      return { success: true, message: "File deleted successfully." };
    } catch (error) {
      console.error("❌ Error deleting file:", error);
      throw new Error("Failed to delete file from Convex storage.");
    }
  },
});
