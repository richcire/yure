"use client";

import { motion } from "motion/react";

export default function ScrollDownInstructor() {
  return (
    <motion.div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-xl shadow-lg flex flex-col items-center gap-2 py-8"
      //   initial={{ x: "-50%" }}
      animate={{
        x: ["-50%", "-50%", "-50%"],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-6 h-1 bg-foreground/80 rounded-full" />
      <span className="text-sm font-medium text-foreground/80">
        Scroll for more
      </span>
    </motion.div>
  );
}
