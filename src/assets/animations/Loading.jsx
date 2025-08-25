import { motion } from "framer-motion";

const Loading = ({ className = "" }) => {
  const dotVariants = {
    initial: { y: 4 },
    animate: { y: 12 }, // Reduced movement for button size
  };

  const dotTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for speedramp effect
    repeat: Infinity,
    repeatType: "reverse",
  };

  return (
    <motion.div
      className={`inline-flex items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex space-x-1">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-current"
          variants={dotVariants}
          initial="animate"
          animate="initial"
          transition={{ ...dotTransition, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-current"
          variants={dotVariants}
          initial="animate"
          animate="initial"
          transition={{ ...dotTransition, delay: 0.1 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-current"
          variants={dotVariants}
          initial="animate"
          animate="initial"
          transition={{ ...dotTransition, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export { Loading };
