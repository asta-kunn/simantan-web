import React, { memo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const RunningTime = memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();  
    const seconds = date.getSeconds();

    const pad = (num) => num.toString().padStart(2, "0");

    return [pad(hours), pad(minutes), pad(seconds)];
  };

  const [hours, minutes, seconds] = formatTime(currentTime);

  return (
    <div className="flex items-start justify-center w-full gap-4 transition-all duration-300">
      <div className="timer w-16">
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.h3
              key={hours}
              initial={{ opacity: 0, rotateX: 90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -90, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.68, -0.6, 0.32, 1.6],
              }}
              className="font-semibold text-2xl text-primary text-center"
            >
              {hours}
            </motion.h3>
          </AnimatePresence>
        </div>
        <p className="text-sm font-normal text-primary mt-1 text-center w-full">
          hours
        </p>
      </div>
      <h3 className="font-manrope font-semibold text-2xl text-primary">:</h3>
      <div className="timer w-16">
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.h3
              key={minutes}
              initial={{ opacity: 0, rotateX: 90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -90, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.68, -0.6, 0.32, 1.6],
              }}
              className="font-semibold text-2xl text-primary text-center"
            >
              {minutes}
            </motion.h3>
          </AnimatePresence>
        </div>
        <p className="text-sm font-normal text-primary mt-1 text-center w-full">
          minutes
        </p>
      </div>
      <h3 className="font-semibold text-2xl text-primary">:</h3>
      <div className="timer w-16">
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.h3
              key={seconds}
              initial={{ opacity: 0, rotateX: 90, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -90, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.68, -0.6, 0.32, 1.6],
              }}
              className="countdown-element seconds font-manrope font-semibold text-2xl text-primary text-center"
            >
              {seconds}
            </motion.h3>
          </AnimatePresence>
        </div>
        <p className="text-sm font-normal text-primary mt-1 text-center w-full">
          seconds
        </p>
      </div>
    </div>
  );
});
