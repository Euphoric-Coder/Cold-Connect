"use client";

import { Upload, FileText, Send } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Enter the Job URL",
      description:
        "Paste the link to the job posting you're interested in. Our system will analyze the job description to understand the requirements and company culture.",
      content: (
        <div className="flex items-center justify-between border rounded-md px-4 py-3 mt-3 bg-white">
          <input
            type="text"
            placeholder="https://company.com/careers/job-posting"
            className="w-full focus:outline-none text-gray-600"
          />
          <button className="ml-3 text-blue-600 font-medium hover:underline">
            Paste
          </button>
        </div>
      ),
    },
    {
      number: "2",
      title: "Upload Your Resume",
      description:
        "Upload your resume as a PDF. ColdConnect will extract relevant skills, experience, and qualifications to highlight in your personalized email.",
      content: (
        <div className="border-2 border-dashed rounded-md px-6 py-10 text-center mt-3 bg-white">
          <FileText className="mx-auto text-gray-400 mb-2" size={28} />
          <p className="text-gray-600 text-sm">
            Drag and drop your PDF file here, or click to browse
          </p>
        </div>
      ),
    },
    {
      number: "3",
      title: "Generate Your Cold Email",
      description:
        "Click the generate button and within seconds you'll have a professional, personalized cold email ready to send. Edit, copy, or download as needed.",
      content: (
        <button className="w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white bg-gradient-to-r from-purple-500 to-teal-400 font-medium shadow-md hover:opacity-90 transition">
          <Send size={18} />
          Generate Cold Email
        </button>
      ),
    },
  ];

  return (
    <section className="bg-[#f9fafb] py-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
        <p className="text-gray-600 mb-12">
          Creating the perfect cold email is just three simple steps away
        </p>

        {/* Steps */}
        <div className="space-y-12 text-left">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-14">
              {/* Number Badge */}
              <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-gray-600 mt-1">{step.description}</p>
              {step.content}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="#"
            className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1"
          >
            Try It Now →
          </a>
        </div>
      </div>
    </section>
  );
}
