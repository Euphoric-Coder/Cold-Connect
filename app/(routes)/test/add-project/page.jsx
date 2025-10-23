"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, PlusCircle, Search } from "lucide-react";

export default function ProjectsPage() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const addProject = useMutation(api.projects.addProject);
  const ingestProject = useAction(api.projects.ingestProject);
  const matchProjects = useAction(api.projects.matchProjects);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    skills: "",
    projectURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matches, setMatches] = useState([]);

  // 🧩 Add & Embed Project
  const handleAddProject = async () => {
    if (!form.projectName || !form.description || !form.skills) {
      toast.error("Please fill out all fields");
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ Add project to DB
      const projectId = await addProject({
        userEmail,
        projectName: form.projectName,
        description: form.description,
        skills: form.skills.split(",").map((s) => s.trim()),
        projectURL: form.projectURL || "N/A",
      });

      // 2️⃣ Embed into vector store
      await ingestProject({
        projectId,
        userEmail,
        projectName: form.projectName,
        description: form.description,
        skills: form.skills.split(",").map((s) => s.trim()),
        projectURL: form.projectURL || "N/A",
      });

      toast.success(`✅ Project "${form.projectName}" added & embedded!`);
      setForm({ projectName: "", description: "", skills: "", projectURL: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add project.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Match Projects with Job Description
  const handleMatch = async () => {
    if (!jobDescription) {
      toast.error("Please enter a job description.");
      return;
    }
    setMatching(true);
    try {
      const res = await matchProjects({ userEmail, jobDescription });
      setMatches(res);
      toast.success("✅ Matching complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch matches.");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        🚀 Project Intelligence Dashboard
      </h1>

      {/* ➕ Add Project */}
      <section className="border p-6 rounded-xl shadow-md bg-white/90 dark:bg-slate-900/80">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <PlusCircle className="text-blue-600" /> Add New Project
        </h2>

        <div className="space-y-3">
          <Input
            placeholder="Project Name"
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
          />
          <Textarea
            placeholder="Project Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <Input
            placeholder="Project URL (optional)"
            value={form.projectURL}
            onChange={(e) => setForm({ ...form, projectURL: e.target.value })}
          />
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
            onClick={handleAddProject}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Add & Embed Project"
            )}
          </Button>
        </div>
      </section>

      {/* 🔍 Job Matching Section */}
      <section className="border p-6 rounded-xl shadow-md bg-white/90 dark:bg-slate-900/80">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Search className="text-green-600" /> Match Projects with Job
          Description
        </h2>
        <Textarea
          placeholder="Paste the job description here..."
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button
          className="w-full mt-3 bg-green-600 hover:bg-green-700"
          disabled={matching}
          onClick={handleMatch}
        >
          {matching ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Find Matching Projects"
          )}
        </Button>

        {/* 🧠 Matched Results */}
        {matches.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">
              Top Matches:
            </h3>
            <div className="space-y-3">
              {matches.map((m, i) => (
                <div
                  key={m.projectId || i}
                  className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-500">Rank #{i + 1}</p>
                  <h4 className="text-lg font-semibold text-blue-600">
                    {m.projectName}
                  </h4>
                  {m.avgScore && (
                    <p className="text-xs text-gray-400">
                      Score: {m.avgScore.toFixed(3)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
