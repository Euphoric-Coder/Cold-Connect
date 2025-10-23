import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

// Adds a project entry for a given user.
export const addProject = mutation({
  args: {
    userEmail: v.string(),
    projectName: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    projectURL: v.string(),
    category: v.string(), // New field
    domain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    });
    return projectId;
  },
});

// Ingest Project (create Gemini embeddings & store in documents)
export const ingestProject = action({
  args: {
    projectId: v.string(),
    userEmail: v.string(),
    projectName: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    projectURL: v.string(),
    category: v.string(),
    domain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing.");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    const texts = [
      `Project Name: ${args.projectName}`,
      `Category: ${args.category}`,
      `Domain: ${args.domain ?? "General"}`,
      `Description: ${args.description}`,
      `Skills: ${args.skills.join(", ")}`,
      `Summary: ${args.projectName} is a ${args.category} project focused on ${args.domain ?? "general applications"} using ${args.skills.join(", ")}.`,
    ];

    const metadatas = texts.map(() => ({
      projectId: args.projectId,
      userEmail: args.userEmail,
      projectName: args.projectName,
      category: args.category,
      domain: args.domain ?? "General",
      source: "project",
    }));

    await ConvexVectorStore.fromTexts(texts, metadatas, embeddings, { ctx });

    return `Embedded project "${args.projectName}" with category "${args.category}".`;
  },
});

// Match Projects (vector search against documents)
export const matchProjects = action({
  args: {
    userEmail: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing.");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_QUERY,
    });

    const vectorStore = new ConvexVectorStore(embeddings, { ctx });

    // Enrich job description with pseudo-fields for better contextual matching
    const enrichedJobText = `
    Job Title Context:
    ${args.jobDescription}

    The goal is to match user projects that best fit the domain, category, and skill requirements implied above.
    Prioritize projects where category or skills overlap with the role focus.
    Skip irrelevant projects. Also if the skills in the project are not matching for the project don't have it. 
    `;

    // Use similaritySearchWithScore to get weighted scores
    const results = await vectorStore.similaritySearchWithScore(
      enrichedJobText,
      15
    );

    // Group and average multiple embeddings per project
    const scoresByProject = new Map();

    for (const [doc, score] of results) {
      if (doc.metadata.userEmail !== args.userEmail) continue;

      const pid = doc.metadata.projectId;
      if (!scoresByProject.has(pid)) {
        scoresByProject.set(pid, {
          projectName: doc.metadata.projectName,
          total: 0,
          count: 0,
        });
      }
      const entry = scoresByProject.get(pid);
      entry.total += score;
      entry.count += 1;
    }

    // Average the scores and rank
    const averaged = Array.from(scoresByProject.entries())
      .map(([projectId, { projectName, total, count }]) => ({
        projectId,
        projectName,
        avgScore: total / count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    console.log(averaged);

    // Optional threshold (tune as needed)
    const filtered = averaged.filter((p) => p.avgScore > 0.5);

    console.log("Filtered:", filtered);

    return filtered;
  },
});
