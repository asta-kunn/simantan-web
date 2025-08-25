import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center bg-transparent px-4 h-[calc(100vh-100px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-8xl font-extrabold text-gray-800 dark:text-gray-200 tracking-widest"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="text-gray-600 dark:text-gray-400 mt-4 w-full"
        >
          <p className="text-xl font-bold text-primary-normal">Page Not Found.</p>
          <p className="text-xl font-medium mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
