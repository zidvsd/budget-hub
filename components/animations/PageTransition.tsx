"use client";

import { m, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: isAdmin ? 0.15 : 0.4, // Admin is 2.5x faster
          ease: "linear",
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
