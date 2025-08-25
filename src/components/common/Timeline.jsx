import React, { memo } from "react";
import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";

export const Timeline = memo(({ data, orientation = "vertical" }) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "relative",
        isHorizontal ? "flex items-center space-x-8 px-4" : "space-y-8"
      )}
    >
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, [isHorizontal ? "y" : "x"]: -20 }}
          animate={{ opacity: 1, [isHorizontal ? "y" : "x"]: 0 }}
          transition={{ delay: index * 0.2 }}
          className={cn("relative", isHorizontal ? "flex-1" : "flex gap-4")}
        >
          {/* Timeline Line & Dot */}
          <div
            className={cn(
              "relative",
              isHorizontal ? "flex flex-col items-center" : "flex items-center"
            )}
          >
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-background border-2 border-primary" />
              <div className="absolute -inset-2 bg-primary/10 rounded-full animate-pulse" />
            </div>
            {index !== data.length - 1 && (
              <div
                className={cn(
                  "bg-primary/20",
                  isHorizontal
                    ? "absolute h-[2px] w-[calc(100%+2rem)] left-1/2 top-[6px]"
                    : "absolute w-[2px] h-[calc(100%+2rem)] left-[5px] top-1/2"
                )}
              />
            )}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
            className={cn("flex-1 ml-4", isHorizontal ? "mt-8" : "")}
          >
            <div className="bg-card p-4 rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              {item.title && (
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {item.title}
                </h3>
              )}
              {item.date && (
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  {item.date}
                </p>
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
});
