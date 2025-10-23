"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddProjectForm() {
  const { user } = useUser();
  const addProject = useMutation(api.projects.addProject);
  const ingestProject = useAction(api.projects.ingestProject);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    skills: "",
    projectURL: "",
    category: "",
    domain: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.primaryEmailAddress?.emailAddress)
      return toast.error("You must be logged in.");

    try {
      setLoading(true);
      const projectId = await addProject({
        userEmail: user.primaryEmailAddress.emailAddress,
        projectName: form.projectName,
        description: form.description,
        skills: form.skills.split(",").map((s) => s.trim()),
        projectURL: form.projectURL,
        category: form.category,
        domain: form.domain || "General",
      });

      toast.success("Project added successfully!");

      // Trigger embedding
      await ingestProject({
        projectId,
        userEmail: user.primaryEmailAddress.emailAddress,
        projectName: form.projectName,
        description: form.description,
        skills: form.skills.split(",").map((s) => s.trim()),
        projectURL: form.projectURL,
        category: form.category,
        domain: form.domain || "General",
      });

      toast.success("Project embedded successfully!");
      //   setForm({
      //     projectName: "",
      //     description: "",
      //     skills: "",
      //     projectURL: "",
      //     category: "",
      //     domain: "",
      //   });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add or embed project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-lg p-6 shadow-md bg-white/80 dark:bg-slate-900/70"
    >
      <h2 className="text-xl font-semibold text-blue-600">Add New Project</h2>
      <Input
        name="projectName"
        placeholder="Project Name"
        value={form.projectName}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Project Description"
        rows={3}
        value={form.description}
        onChange={handleChange}
        required
      />
      <Input
        name="skills"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={handleChange}
        required
      />
      <Input
        name="projectURL"
        placeholder="Project URL"
        value={form.projectURL}
        onChange={handleChange}
      />
      <Input
        name="category"
        placeholder="Category (e.g., AI/ML, Full Stack)"
        value={form.category}
        onChange={handleChange}
        required
      />
      <Input
        name="domain"
        placeholder="Domain (optional, e.g., Finance, Healthcare)"
        value={form.domain}
        onChange={handleChange}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Processing..." : "Add Project"}
      </Button>
    </form>
  );
}
