"use client";

import { motion } from "motion/react";

interface ScheduleBadgeProps {
  title: string;
  bgColor: string;
  borderColor: string;
}

export default function ScheduleBadge({
  title,
  bgColor,
  borderColor,
}: ScheduleBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="px-3 py-1.5 bg-background rounded-full text-sm inline-block"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      {title}
    </motion.div>
  );
}
