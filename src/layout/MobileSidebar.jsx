import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

import logoInnolife from "@/assets/images/logo.png"
import useGeneralStore from "@/stores/generalStore";
import useAuthStore from "@/stores/authStore";

// Mobile MenuItem component - simplified for mobile use
const MobileMenuItem = ({ item, index, onNavigate }) => {
  const location = useLocation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // Fix active detection logic by checking both exact matches and path prefixes
  const isActive =
    location.pathname === item.URL ||
    (item.URL !== "/" && location.pathname.startsWith(item.URL));

  // Check if any submenu item is active
  const hasActiveChild =
    item.SUB_MENU &&
    item.SUB_MENU.some(
      (child) =>
        location.pathname === child.URL ||
        (child.URL !== "/" && location.pathname.startsWith(child.URL))
    );

  // Auto-expand submenu if child is active
  useEffect(() => {
    if (hasActiveChild) {
      setIsSubmenuOpen(true);
    }
  }, [location.pathname, hasActiveChild]);

  return (
    <div className="mb-1">
      <Link
        to={item.SUB_MENU?.length > 0 ? "#" : item.URL}
        onClick={(e) => {
          if (item.SUB_MENU?.length > 0) {
            e.preventDefault();
            setIsSubmenuOpen(!isSubmenuOpen);
          } else {
            onNavigate();
          }
        }}
        className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors relative ${
          (isActive && !hasActiveChild) || hasActiveChild
            ? "bg-gradient-to-r from-primary-soft to-white dark:from-primary-soft dark:to-gray-800 hover:from-primary-soft/80 hover:to-white/80 dark:hover:from-primary-soft/80 dark:hover:to-gray-800/80"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {((isActive && !hasActiveChild) || hasActiveChild) && (
          <div className="absolute left-0 top-0 h-full w-1 bg-primary-normal rounded-l-md"></div>
        )}
        <div className="flex items-center gap-3 min-w-0 w-full">
          <i
            className={`${item.ICON} text-xl ${
              (isActive && !hasActiveChild) || hasActiveChild
                ? "text-primary-normal"
                : "text-black dark:text-white"
            }`}
          ></i>
          <span
            className={`text-base font-medium truncate ${
              (isActive && !hasActiveChild) || hasActiveChild
                ? "text-primary-normal hover:text-primary-normal"
                : "text-black dark:text-white hover:text-black dark:hover:text-white"
            }`}
          >
            {item.NAME}
          </span>
        </div>

        {item.SUB_MENU?.length > 0 && (
          <ChevronDown
            className={`w-5 h-5 ml-2 text-gray-500 transition-transform ${
              isSubmenuOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      <AnimatePresence mode="wait">
        {item.SUB_MENU?.length > 0 && isSubmenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
              {item.SUB_MENU.map((child, childIndex) => (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: childIndex * 0.05 }}
                  key={`mobile-submenu-${child.ID || childIndex}`}
                >
                  <Link
                    to={child.URL}
                    onClick={onNavigate}
                    className={`block px-4 py-3 text-base rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      location.pathname === child.URL ||
                      (child.URL !== "/" &&
                        location.pathname.startsWith(child.URL))
                        ? "bg-gray-100 dark:bg-gray-800 text-primary-normal font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {child.NAME}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Sidebar Component
const MobileSidebar = () => {
  const isSidebarMobileOpen = useGeneralStore((state) => state.isSidebarMobileOpen);
  const toggleSidebarMobile = useGeneralStore((state) => state.toggleSidebarMobile);
  const getMenus = useAuthStore((state) => state.getMenus);
  const menus = getMenus() || [];

  return (
    <AnimatePresence>
      {isSidebarMobileOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
            onClick={toggleSidebarMobile}
          />

          {/* Mobile Sidebar - slide from left animation */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="w-full absolute z-[100] bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-xl lg:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <nav className="flex-1 py-2 overflow-y-auto">
                {Array.isArray(menus) && menus.length > 0 ? (
                  menus.map((item, index) => (
                    <MobileMenuItem
                      key={`mobile-menu-${item.ID || index}`}
                      item={item}
                      index={index}
                      onNavigate={() => toggleSidebarMobile()}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center h-32 text-gray-500">
                    No menu items available
                  </div>
                )}
              </nav>

              <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500">
                <img
                  src={logoInnolife}
                  alt="InnoLife"
                  className={`transition-all duration-300 h-9`}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
