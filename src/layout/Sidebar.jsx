import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import logoInnolife from "@/assets/images/Logo.png"
import logoIconInnolife from "@/assets/images/Logo.png"

import { Divider } from "@/components/fields/Divider";
import { Button } from "@/components/Dexain";

import useGeneralStore from "@/stores/generalStore";
import useAuthStore from "@/stores/authStore";

import { ChevronDown, Settings } from "lucide-react";

const MenuItem = ({ item, index, isSidebarOpen }) => {
  const location = useLocation();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const linkRef = useRef(null);
  const timeoutRef = useRef(null);

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

  const handleMouseEnter = () => {
    if (!isSidebarOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowPopover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSidebarOpen) {
      timeoutRef.current = setTimeout(() => {
        setShowPopover(false);
      }, 100);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        ref={linkRef}
        to={item.SUB_MENU?.length > 0 ? "#" : item.URL}
        onClick={(e) => {
          if (item.SUB_MENU?.length > 0) {
            e.preventDefault();
            if (isSidebarOpen) {
              setIsSubmenuOpen(!isSubmenuOpen);
            }
          }
        }}
        className={`flex items-center justify-between px-3 py-2 transition-colors ${
          !isSidebarOpen ? "justify-center" : ""
        } ${
          (isActive && !hasActiveChild) || hasActiveChild
            ? "bg-gradient-to-r from-primary-soft to-white dark:from-primary-soft dark:to-gray-800 hover:from-primary-soft/80 hover:to-white/80 dark:hover:from-primary-soft/80 dark:hover:to-gray-800/80"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {((isActive && !hasActiveChild) || hasActiveChild) && (
          <div className="absolute left-0 top-0 h-full w-1 bg-primary-normal"></div>
        )}
        <div
          className={`flex items-center ${isSidebarOpen ? "gap-3 min-w-0 w-full" : "justify-center w-full"}`}
        >
          <motion.i
            className={`${item.ICON} ${
              (isActive && !hasActiveChild) || hasActiveChild
                ? "text-primary-normal"
                : "text-black"
            }`}
            animate={{
              scale: isSidebarOpen ? 1 : 1.2,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          ></motion.i>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`text-md font-medium truncate ml-3 ${
                  (isActive && !hasActiveChild) || hasActiveChild
                    ? "text-primary-normal hover:text-primary-normal"
                    : "text-black hover:text-black"
                }`}
              >
                {item.NAME}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isSidebarOpen && item.SUB_MENU?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${
                  isSubmenuOpen ? "rotate-180" : ""
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {!isSidebarOpen && showPopover && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed left-16 ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 px-4 min-w-[180px]"
          style={{
            top: linkRef.current?.getBoundingClientRect().top,
          }}
        >
          <div className="font-medium text-md">{item.NAME}</div>
          {item.SUB_MENU?.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.SUB_MENU.map((child, idx) => (
                <Link
                  key={`submenu-popup-${child.ID || idx}`}
                  to={child.URL}
                  className={`block px-2 py-1 text-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                    location.pathname === child.URL ||
                    (child.URL !== "/" &&
                      location.pathname.startsWith(child.URL))
                      ? "bg-gray-100 dark:bg-gray-800 text-primary-normal font-medium"
                      : ""
                  }`}
                >
                  {child.NAME}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        {item.SUB_MENU?.length > 0 && isSidebarOpen && isSubmenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-8 space-y-1">
              {item.SUB_MENU.map((child, childIndex) => (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: childIndex * 0.1 }}
                  key={`submenu-${child.ID || childIndex}`}
                >
                  <Link
                    to={child.URL}
                    className={`block px-3 py-2 text-md rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
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

const Sidebar = () => {
  const navigate = useNavigate();

  const isSidebarOpen = useGeneralStore((state) => state.isSidebarOpen);
  const getMenus = useAuthStore((state) => state.getMenus);
  const user = useAuthStore((state) => state.user);
  const menus = getMenus() || [];

  return (
    <div
      className={`sticky top-0 left-0 flex flex-col bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-all duration-300 z-10 shadow-lg ${
        isSidebarOpen ? "w-64" : "w-16"
      } hidden lg:flex xl:flex 2xl:flex`}
    >
      <div
        className={`px-4 py-2 flex items-center justify-center${
          !isSidebarOpen ? " justify-center" : ""
        }`}
      >
        <div className="grid grid-cols-1">
          <img
            src={isSidebarOpen ? logoInnolife : logoIconInnolife}
            alt="InnoLife"
            className={`transition-all duration-300 ${
              !isSidebarOpen ? "h-10" : "h-14"
            }`}
          />
        </div>
      </div>
      {isSidebarOpen && (
        <Divider
          style="dash"
          label="Menu"
          labelAlignment="left"
          className="text-[#959697] text-base"
        />
      )}

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-0">
          {Array.isArray(menus) &&
            menus.length > 0 &&
            menus.map((item, index) => (
              <MenuItem
                key={`menu-${item.ID || index}`}
                item={item}
                index={index}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
        </div>
      </nav>

      {user.ROLE_CODE === "SUPERUSER" && (
        <div className="p-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            className={`w-full ${
              location.pathname === "/settings" ||
              (location.pathname !== "/" &&
                location.pathname.startsWith("/settings"))
                ? "bg-primary-normal hover:bg-primary-normal/80 text-white"
                : ""
            }`}
            onClick={() => {
              navigate("/settings");
            }}
          >
            {isSidebarOpen ? (
              <>
                <Settings className="w-4 h-4" />
                Settings
              </>
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
