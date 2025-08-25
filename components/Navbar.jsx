"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="mx-auto flex items-center justify-between px-6 py-3 max-w-7xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/cold.png" // replace with your logo path
            alt="ColdConnect Logo"
            width={28}
            height={28}
          />
          <span className="font-bold text-lg">ColdConnect</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Home
          </Link>
          <Link href="/features" className="text-gray-800 hover:text-gray-900">
            Features
          </Link>
          <Link
            href="/get-started"
            className="text-gray-800 hover:text-gray-900"
          >
            Get Started
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-gray-900">
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Get Started button */}
          <Link
            href="/get-started"
            className="px-4 py-2 rounded-full font-medium text-white bg-gradient-to-r from-purple-500 to-teal-400 hover:opacity-90 transition"
          >
            Get Started
          </Link>

          {/* Sign In button */}
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-md border font-medium hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
