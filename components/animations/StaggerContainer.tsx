"use client";

import { m, Variants } from "motion/react";

// Parent Variants: Controls the flow
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Time between each child (in seconds)
      delayChildren: 0.2, // Wait before the first child starts
    },
  },
};

// Child Variants: Defines the individual movement
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return <m.div variants={itemVariants}>{children}</m.div>;
}
