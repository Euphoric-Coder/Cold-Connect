"use client";

import { Send } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-md text-center py-12 px-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-2xl opacity-40" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-transparent rounded-full blur-2xl opacity-40" />

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto relative z-10">
            Start creating personalized cold emails that get responses.
            ColdConnect helps you stand out from the crowd with professionally
            crafted emails tailored to your skills and experience.
          </p>

          {/* Button */}
          <button className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-md font-medium text-white bg-gradient-to-r from-purple-500 to-teal-400 shadow-md hover:opacity-90 transition mx-auto">
            <Send size={18} />
            Start Generating Emails
          </button>
        </div>
      </div>
    </section>
  );
}
