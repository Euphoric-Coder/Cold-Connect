"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Target, Zap, Mail, ArrowRight, Send } from "lucide-react";
import Button from "./Button";
import FeatureCard from "./FeatureCard";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { sendEmail } from "@/lib/sendEmail";

const HomePage = () => {
  // const { user, isSignedIn } = useUser();
  // const { getToken } = useAuth();

  const [hasAddedUser, setHasAddedUser] = useState(false); // to avoid re-posting

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/10 -z-10"></div>

        {/* Animated Dots (Background Pattern) */}
        <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary-400"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 20 - 10],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <motion.h1
                className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Effortlessly Create
                <span className="bg-clip-text text-transparent bg-gradient-primary">
                  {" "}
                  Tailored Cold Emails
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-dark-600 dark:text-dark-300 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                ColdConnect makes professional outreach a breeze. Input job
                details, upload your resume, and generate personalized cold
                emails that stand out.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  to="/generate"
                  variant="primary"
                  size="md"
                  icon={Send}
                  className="rounded-3xl"
                  // onClick={() =>
                  //   sendEmail(
                  //     "deydsagnik@gmail.com",
                  //     "Test Email",
                  //     "<html><body><h1>This is a test email from ColdConnect!</h1><p>Generated using Gmail API and Clerk OAuth integration.</p></body></html>"
                  //   )
                  // }
                >
                  Start Generating Emails
                </Button>

                <Button
                  to="/#features"
                  variant="secondary"
                  size="md"
                  className="rounded-3xl"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>

            {/* Illustration/Image */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-3xl opacity-20 -z-10 transform scale-95"></div>
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 max-w-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 dark:bg-primary-900/20 p-2 rounded-full">
                      <Mail className="h-6 w-6 text-primary-500" />
                    </div>
                    <h3 className="ml-3 font-medium">
                      Generated Email Preview
                    </h3>
                  </div>

                  <div className="border-b border-dark-200 dark:border-dark-700 pb-2 mb-3">
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      To: hiring@company.com
                    </p>
                    <p className="font-medium">
                      Application for Senior Developer Position
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none text-dark-600 dark:text-dark-300">
                    <p>Dear Hiring Manager,</p>
                    <p>
                      I was excited to discover the Senior Developer position at
                      Company Inc. With my 5+ years of experience in React
                      development and proven track record of...
                    </p>
                    <p className="text-dark-400 dark:text-dark-500">
                      [See full email]
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" disabled>
                      Copy
                    </Button>
                    <Button variant="primary" size="sm" disabled>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="font-heading font-bold text-3xl md:text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Why Choose ColdConnect?
            </motion.h2>
            <motion.p
              className="text-dark-600 dark:text-dark-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Our platform makes it easy to create professional, personalized
              cold emails that help you stand out to potential employers.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Tailored Outreach"
              description="Generate emails specifically tailored to the job description and your unique skills and experience."
              delay={0.1}
            />

            <FeatureCard
              icon={FileText}
              title="Resume-Integrated Emails"
              description="Upload your resume and we'll extract key information to craft compelling emails that highlight your qualifications."
              delay={0.2}
            />

            <FeatureCard
              icon={Zap}
              title="Seamless Experience"
              description="From job URL to finished email in minutes. Save time and increase your job application success rate."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-dark-50 dark:bg-dark-800/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              className="font-heading font-bold text-3xl md:text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-dark-600 dark:text-dark-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              Creating the perfect cold email is just three simple steps away
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-shrink-0 bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Enter the Job URL
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">
                  Paste the link to the job posting you're interested in. Our
                  system will analyze the job description to understand the
                  requirements and company culture.
                </p>
                <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center border border-dark-200 dark:border-dark-700 rounded-lg p-2">
                    <input
                      type="text"
                      className="flex-grow bg-transparent border-none focus:outline-none text-sm p-1"
                      placeholder="https://company.com/careers/job-posting"
                      disabled
                    />
                    <button className="text-primary-500 p-1">Paste</button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-shrink-0 bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">
                  Upload your resume as a PDF. ColdConnect will extract relevant
                  skills, experience, and qualifications to highlight in your
                  personalized email.
                </p>
                <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
                  <div className="border-2 border-dashed border-dark-200 dark:border-dark-700 rounded-lg p-4 text-center">
                    <FileText className="mx-auto h-8 w-8 text-dark-400 dark:text-dark-500 mb-2" />
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      Drag and drop your PDF file here, or click to browse
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-shrink-0 bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Generate Your Cold Email
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-4">
                  Click the generate button and within seconds you'll have a
                  professional, personalized cold email ready to send. Edit,
                  copy, or download as needed.
                </p>
                <div className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-center">
                    <Button variant="primary" icon={Send}>
                      Generate Cold Email
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <Link
              href={"/generate"}
              className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            >
              Try It Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-primary opacity-10 dark:opacity-20 -z-10"></div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full transform -translate-x-16 translate-y-16"></div>

            <div className="relative z-10">
              <motion.h2
                className="font-heading font-bold text-3xl md:text-4xl mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Ready to Land Your Dream Job?
              </motion.h2>

              <motion.p
                className="text-dark-600 dark:text-dark-300 text-lg text-center mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Start creating personalized cold emails that get responses.
                ColdConnect helps you stand out from the crowd with
                professionally crafted emails tailored to your skills and
                experience.
              </motion.p>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Button to="/generator" variant="primary" size="lg" icon={Send}>
                  Start Generating Emails
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
