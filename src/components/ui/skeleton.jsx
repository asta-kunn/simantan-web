import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Skeleton = memo(({ className, isLoading, children, ...props }) => {
  if (!isLoading && children) {
    return children;
  }
  
  return (
    <div 
      className={cn("relative overflow-hidden rounded-md bg-gray-200/80 w-100 min-h-[20px] h-[calc(95vh-100px)]", className)} 
      {...props}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        style={{
          boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.3) inset"
        }}
      />
    </div>
  );
});