import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"), // validates Convex storage ID type
  },
  handler: async (ctx, args) => {
    try {
      await ctx.storage.delete(args.storageId);
      console.log("File deleted successfully:", args.storageId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file from Convex storage.");
    }
  },
});
