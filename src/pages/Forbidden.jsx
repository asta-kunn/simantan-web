import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center bg-transparent px-4 h-[calc(100vh-100px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-8xl font-extrabold text-gray-800 dark:text-gray-200 tracking-widest"
        >
          403
        </motion.h1>
  
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="text-gray-600 dark:text-gray-400 mt-3 w-full"
        >
          <p className="text-xl font-bold text-primary-normal">Forbidden Access.</p>
          <p className="text-xl font-medium">
            Oops! You don't have access to this page.
          </p>
          <p className="text-sm">
            Please contact your administrator for access.
          </p>
        </motion.div>
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg inline-flex items-center transition duration-150 ease-in-out text-sm"
          >
            Return Home
          </Link>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default Forbidden;
