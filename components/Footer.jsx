import React from "react";
import Link from "next/link";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-100 dark:bg-dark-800 py-12 mt-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href={"/"} className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary-500" />
              <span className="font-heading font-bold text-xl">
                ColdConnect
              </span>
            </Link>
            <p className="mt-4 text-dark-600 dark:text-dark-300 max-w-md">
              ColdConnect helps job seekers craft personalized, professional
              cold emails tailored to their skills and the job requirements.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-dark-500 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-dark-500 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-dark-500 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#features"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/generator"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Email Generator
                </Link>
              </li>
              <li>
                <Link
                  to="/#pricing"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-200 dark:border-dark-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            &copy; {new Date().getFullYear()} ColdConnect. All rights reserved.
          </p>
          <p className="text-dark-500 dark:text-dark-400 text-sm mt-2 md:mt-0">
            Designed with ❤️ for job seekers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
