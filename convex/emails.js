import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEmail = mutation({
  args: {
    subject: v.string(),
    content: v.string(),
    jobTitle: v.string(),
    company: v.string(),
    recipientEmail: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("resend")
    ),
    createdBy: v.string(), // User email
  },
  handler: async (ctx, args) => {
    const emailId = await ctx.db.insert("emails", {
      ...args,
    });
    return emailId;
  },
});

export const getEmailsByUser = query({
  args: { createdBy: v.string() },
  handler: async (ctx, { createdBy }) => {
    const emails = await ctx.db
      .query("emails")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", createdBy))
      .order("desc")
      .collect();

    // Transform system fields to clean format
    return emails.map((email) => ({
      id: email._id,
      createdAt: email._creationTime,
      subject: email.subject,
      content: email.content,
      jobTitle: email.jobTitle,
      company: email.company,
      recipientEmail: email.recipientEmail,
      status: email.status,
      createdBy: email.createdBy,
    }));
  },
});

// Update email
export const updateEmail = mutation({
  args: {
    id: v.id("emails"), // email document ID
    subject: v.optional(v.string()),
    content: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("failed"),
        v.literal("resend")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    // Ensure email exists
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Email not found");
    }

    // Patch the email document
    await ctx.db.patch(id, cleanUpdates);

    // Return the updated document
    const updated = await ctx.db.get(id);
    return {
      id: updated._id,
      createdAt: updated._creationTime,
      subject: updated.subject,
      content: updated.content,
      jobTitle: updated.jobTitle,
      company: updated.company,
      recipientEmail: updated.recipientEmail,
      status: updated.status,
      createdBy: updated.createdBy,
    };
  },
});
