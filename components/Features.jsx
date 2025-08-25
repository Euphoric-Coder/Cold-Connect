"use client";

import { Target, FileText, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Target size={28} className="text-white" />,
      title: "Tailored Outreach",
      description:
        "Generate emails specifically tailored to the job description and your unique skills and experience.",
    },
    {
      icon: <FileText size={28} className="text-white" />,
      title: "Resume-Integrated Emails",
      description:
        "Upload your resume and we'll extract key information to craft compelling emails that highlight your qualifications.",
    },
    {
      icon: <Zap size={28} className="text-white" />,
      title: "Seamless Experience",
      description:
        "From job URL to finished email in minutes. Save time and increase your job application success rate.",
    },
  ];

  return (
    <section className="bg-[#f9fafb] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose ColdConnect?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Our platform makes it easy to create professional, personalized cold
          emails that help you stand out to potential employers.
        </p>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition"
            >
              {/* Icon with gradient background */}
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
