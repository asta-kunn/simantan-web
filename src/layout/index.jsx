import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/layout/Header";
import Menu from "@/layout/Sidebar";
import MobileSidebar from "@/layout/MobileSidebar";
import Footer from "./Footer";
import useGeneralStore from "@/stores/generalStore";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const closeSidebar = useGeneralStore((state) => state.closeSidebar);
  const prevIsMobile = useRef(window.innerWidth < 1024);

  useEffect(() => {
    // Add transition class before changing dark mode
    document.documentElement.classList.add(
      "transition-colors",
      "transition-transform",
      "duration-300"
    );

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close sidebar when crossing mobile/desktop breakpoint
  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 1024;
      if (isMobile !== prevIsMobile.current) {
        closeSidebar();
        prevIsMobile.current = isMobile;
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeSidebar]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key="layout" className="scrollbar-hide">
        <div className="flex min-h-screen bg-[#F8F9FB] dark:bg-gray-900 relative">
          {/* Sidebar - Full height */}
          <Menu />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0 relative z-[10]">
            {/* Header - Higher z-index to stay above content */}
            <div className="sticky top-0 w-full z-[100] dark:bg-gray-800 shadow-sm">
              <Header handleDarkMode={() => setDarkMode(!darkMode)} />
            </div>

            {/* Main Content with container */}
            <main className="flex-1 overflow-x-hidden relative">
              {/* Mobile Sidebar - Only shows on mobile */}
              <MobileSidebar />

              <div className="max-h-[calc(100vh-200px)] relative">
                <Outlet />
              </div>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Layout;
