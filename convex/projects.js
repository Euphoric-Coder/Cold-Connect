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
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      userEmail: args.userEmail,
      projectName: args.projectName,
      description: args.description,
      skills: args.skills,
      projectURL: args.projectURL,
      createdAt: Date.now(),
    });

    return projectId;
  },
});

// ---------------------------------------------
// 2️⃣ Ingest Project (create Gemini embeddings & store in documents)
// ---------------------------------------------
export const ingestProject = action({
  args: {
    projectId: v.string(),
    userEmail: v.string(),
    projectName: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    projectURL: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      throw new Error("❌ GEMINI_API_KEY missing in Convex environment.");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    // Create multiple meaningful text chunks for embedding
    const texts = [
      `Project Name: ${args.projectName}`,
      `Project Description: ${args.description}`,
      `Project Skills: ${args.skills.join(", ")}`,
      `Project URL: ${args.projectURL}`,
      `Summary: ${args.projectName} focuses on ${args.description}. Core technologies include ${args.skills.join(", ")}.`,
    ];

    const metadatas = texts.map(() => ({
      projectId: args.projectId,
      userEmail: args.userEmail,
      projectName: args.projectName,
      source: "project",
    }));

    await ConvexVectorStore.fromTexts(texts, metadatas, embeddings, { ctx });

    return `✅ Embedded all aspects for project "${args.projectName}"`;
  },
});

// ---------------------------------------------
// 3️⃣ Match Projects (vector search against documents)
// ---------------------------------------------
export const matchProjects = action({
  args: {
    userEmail: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("❌ GEMINI_API_KEY missing.");

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_QUERY,
    });

    const vectorStore = new ConvexVectorStore(embeddings, { ctx });

    // ✅ Enrich job description with pseudo-fields for better contextual matching
    const enrichedJobText = `
Job Title Context:
${args.jobDescription}

This is a job description. Key focus areas include technology stacks, skills, and project types that align
with the job responsibilities. Match projects that demonstrate relevant
experience, problem-solving, or domain overlap.Also show the projects that are more specific towards the tech stack and skills used in the project.
`;

    console.log(args.jobDescription);
    // Use similaritySearchWithScore to get weighted scores
    const results = await vectorStore.similaritySearchWithScore(
      enrichedJobText,
      5
    );

    console.log(results);

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

    // Optional threshold (tune as needed)
    const filtered = averaged.filter((p) => p.avgScore > 0.55);

    return filtered;
  },
});
