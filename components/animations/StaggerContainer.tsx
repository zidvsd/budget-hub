"use client";

import { m, Variants, HTMLMotionProps } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// We use HTMLMotionProps to allow className, key, and other standard div props
interface ContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  inView?: boolean;
}

export function StaggerContainer({
  children,
  className,
  inView = false,
  ...props
}: ContainerProps) {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      // Changed to whileInView to trigger when scrolled into sight
      animate={!inView ? "visible" : undefined}
      whileInView={inView ? "visible" : undefined}
      // viewport ensures it only plays once and triggers when 10% is visible
      viewport={{ once: true, amount: 0.05 }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className, ...props }: ContainerProps) {
  return (
    <m.div variants={itemVariants} className={className} {...props}>
      {children}
    </m.div>
  );
}
