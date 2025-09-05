"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false); // trigger exit when unmounted
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-5">
      <Navbar />
      <main
        className={`flex-grow transform transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {children}
      </main>

      {/* Footer could go here */}
    </div>
  );
};

export default Layout;
