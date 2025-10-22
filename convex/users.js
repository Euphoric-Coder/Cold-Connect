import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    resumeURL: v.optional(v.string()),
    githubURL: v.optional(v.string()),
    portfolioURL: v.optional(v.string()),
    linkedinURL: v.optional(v.string()),
    hasOnboarded: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    {
      name,
      email,
      resumeURL,
      githubURL,
      portfolioURL,
      linkedinURL,
      hasOnboarded,
    }
  ) => {
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
        ...(portfolioURL !== undefined && { portfolioURL }),
        ...(linkedinURL !== undefined && { linkedinURL }),
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
      portfolioURL: portfolioURL ?? undefined,
      linkedinURL: linkedinURL ?? undefined,
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

// Get user details by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Look up the user by email index
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // Return null if user doesn't exist
    if (!user) return null;

    // Return user details
    return {
      name: user.name,
      email: user.email,
      resumeURL: user.resumeURL ?? null,
      githubURL: user.githubURL ?? null,
      portfolioURL: user.portfolioURL ?? null,
      linkedinURL: user.linkedinURL ?? null,
    };
  },
});
