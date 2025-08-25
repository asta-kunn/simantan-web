import { useUIStore } from "@/stores/uiStore";
import { motion } from "framer-motion";
import { memo } from "react";

const Loading = memo(() => {
  const isLoading = useUIStore((state) => state.loader.isLoading);

  if (!isLoading) return null;

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: 20 }, // Reduced movement distance
  };

  const dotTransition = {
    duration: 0.4, // Faster animation
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "reverse",
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-primary-normal"
              variants={dotVariants}
              initial="animate"
              animate="initial"
              transition={{ ...dotTransition, delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
