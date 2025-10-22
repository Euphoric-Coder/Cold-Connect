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
