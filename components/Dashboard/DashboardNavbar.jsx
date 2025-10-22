import React from "react";
import { Home, Plus, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ModeToggle } from "../ThemeButton";
import Button from "../Button";

const DashboardNavbar = ({ userName }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-b border-dark-200 dark:border-dark-700">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Welcome */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-primary-500" />
              <span className="font-heading font-bold text-xl">
                ColdConnect
              </span>
            </Link>

            <div className="hidden md:block h-6 w-px bg-dark-200 dark:bg-dark-700"></div>

            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-dark-800 dark:text-dark-100">
                Welcome back,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-primary">
                  {userName}
                </span>
                !
              </h2>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Generate New Email Button */}
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => (window.location.href = "/generator")}
              className="hidden sm:flex"
            >
              Generate New Email
            </Button>

            {/* Mobile Generate Button */}
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => (window.location.href = "/generator")}
              className="sm:hidden"
              size="sm"
            >
              Generate
            </Button>

            {/* Back to Home Button */}
            <Button
              variant="outline"
              icon={Home}
              onClick={() => (window.location.href = "/")}
              className="hidden sm:flex"
            >
              Back to Home
            </Button>

            {/* Mobile Home Button */}
            <Button
              variant="outline"
              icon={Home}
              onClick={() => (window.location.href = "/")}
              className="sm:hidden"
              size="sm"
            />

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Welcome Message */}
        <motion.div
          className="md:hidden pb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-sm font-medium text-dark-600 dark:text-dark-300">
            Welcome back, <span className="text-primary-500">{userName}</span>!
          </p>
        </motion.div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
