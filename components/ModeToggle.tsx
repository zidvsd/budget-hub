"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, forwardRef } from "react";
import { cn } from "@/lib/utils"; // Ensure you have this utility

interface ModeToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean;
}

export const ModeToggle = forwardRef<HTMLDivElement, ModeToggleProps>(
  ({ showText = false, className, onClick, ...props }, ref) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    // 1. Return a skeleton or null during the first pass
    if (!mounted) {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2 opacity-0", className)}
          {...props}
        >
          <div className="h-4 w-4 shrink-0" />
          {showText && <span className="truncate">Loading...</span>}
        </div>
      );
    }
    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e); // Essential for triggering the parent's logic
      if (!mounted) return;
      setTheme(theme === "dark" ? "light" : "dark");
    };

    const label = theme === "dark" ? "Light Mode" : "Dark Mode";

    return (
      <div
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "flex w-full items-center gap-2 cursor-pointer outline-hidden",
          className, // This allows SidebarMenuButton to pass its hover classes
        )}
        {...props}
      >
        <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
          <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
        {showText && <span className="truncate">{label}</span>}
      </div>
    );
  },
);

ModeToggle.displayName = "ModeToggle";
