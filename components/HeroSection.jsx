"use client";

import { Mail } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-[#f6f9fc] py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-12">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-snug">
            Effortlessly Create{" "}
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 bg-clip-text text-transparent">
              Tailored Cold Emails
            </span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            ColdConnect makes professional outreach a breeze. Input job details,
            upload your resume, and generate personalized cold emails that stand
            out.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="flex items-center gap-2 px-6 py-3 rounded-md font-medium text-white bg-gradient-to-r from-purple-500 to-teal-400 shadow-md hover:opacity-90 transition">
              <Mail size={18} />
              Start Generating Emails
            </button>
            <button className="px-6 py-3 rounded-md border font-medium hover:bg-gray-50 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Email Preview Card */}
        <div className="w-full md:w-[420px] bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-blue-500" size={22} />
            <h2 className="text-xl font-bold">Generated Email Preview</h2>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium">To:</span> hiring@company.com
            </p>
            <p className="font-medium mt-1">
              Application for Senior Developer Position
            </p>
            <hr className="my-3" />
            <p className="leading-relaxed text-gray-600">
              Dear Hiring Manager, <br />I was excited to discover the Senior
              Developer position at Company Inc. With my 5+ years of experience
              in React development and proven track record of...
            </p>
            <p className="mt-2 text-blue-500 text-sm">[See full email]</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition">
              Copy
            </button>
            <button className="px-4 py-2 text-sm text-white rounded-md bg-gradient-to-r from-purple-500 to-teal-400 shadow-md hover:opacity-90 transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
