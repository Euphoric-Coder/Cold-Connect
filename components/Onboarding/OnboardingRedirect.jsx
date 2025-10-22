"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const OnboardingRedirect = ({ name, delay = 5500 }) => {
  const [counter, setCounter] = useState(Math.ceil(delay / 1000));
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + delay;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(endTime - now, 0);

      setProgress(Math.min((elapsed / delay) * 100, 100));
      setCounter(Math.ceil(remaining / 1000));

      if (now >= endTime) {
        clearInterval(interval);
        router.push(`/onboarding`);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [router, delay]);

  const greeting = `Welcome!${name}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full p-8 mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Loading Spinner */}
          <div className="mb-6 flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 dark:text-green-400" />
          </div>

          {/* Greeting */}
          <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            {greeting}
          </h1>

          {/* Redirect Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Redirecting you to Onboarding Page
            {counter > 0 ? ` in ${counter}...` : "..."}
          </p>

          {/* Progress Bar (simple CSS) */}
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Manual Link */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you&apos;re not redirected automatically,{" "}
            <span
              onClick={() => router.push("/sign-in")}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 underline cursor-pointer"
            >
              click here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRedirect;
