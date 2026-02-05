"use client";

import { m, HTMLMotionProps } from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "none";
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  direction = "none",
  ...props
}: FadeInProps) {
  // Define directional movement
  const directions = {
    up: { y: 15 },
    down: { y: -15 },
    none: { y: 0 },
  };

  return (
    <m.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }} // Only animate the first time it enters view
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom "smooth" cubic-bezier
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
