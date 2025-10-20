"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Mail } from "lucide-react";
import { motion } from "framer-motion";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Button from "./Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ThemeButton";
import Image from "next/image";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "Get Started", path: "/generate" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href={"/"} className="flex items-center space-x-2">
            <Image src="/cold.png" alt="Logo" width={32} height={32} />
            <span className="font-heading font-bold text-xl">ColdConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-medium hover:text-primary-500 transition-colors ${
                  location === item.path ? "text-primary-500" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex gap-2 items-center">
            {/* Theme Toggle */}
            <ModeToggle />

            <UserButton />

            {/* Get Started Button (Desktop) */}
            {!isSignedIn && (
              <Link
                href={"/generate"}
                className="hidden md:block btn btn-primary rounded-3xl"
              >
                Get Started
              </Link>
            )}

            <div className="hidden md:flex">
              {!isSignedIn ? (
                <SignInButton>
                  <Button variant="secondary" size="md" className="rounded-3xl">
                    Sign In
                  </Button>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <Button variant="secondary" size="md" className="rounded-3xl">
                    Sign Out
                  </Button>
                </SignOutButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="ml-4 p-2 md:hidden rounded-md hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={
          isMenuOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white dark:bg-dark-900"
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-medium py-2 hover:text-primary-500 transition-colors ${
                  location.pathname === item.path ? "text-primary-500" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={"/generate"}
              className="btn btn-primary w-full justify-center mt-2"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
