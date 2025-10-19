import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    resumeURL: v.optional(v.string()),
    githubURL: v.optional(v.string()),
    hasOnboarded: v.optional(v.boolean()),
  },
  handler: async (ctx, { name, email, resumeURL, githubURL, hasOnboarded }) => {
    // Check if user exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      // Update existing user with only provided fields
      await ctx.db.patch(existingUser._id, {
        name,
        ...(resumeURL !== undefined && { resumeURL }),
        ...(githubURL !== undefined && { githubURL }),
        ...(hasOnboarded !== undefined && { hasOnboarded }),
      });
      return existingUser._id;
    }

    // Create new user if not found
    const newUserId = await ctx.db.insert("users", {
      name,
      email,
      resumeURL: resumeURL ?? undefined,
      githubURL: githubURL ?? undefined,
      hasOnboarded: hasOnboarded ?? false,
    });

    return newUserId;
  },
});

export const onboardingStatus = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // If no record found, assume not onboarded
    if (!user) {
      return false;
    }

    // Return onboarding status
    return user.hasOnboarded;
  },
});
