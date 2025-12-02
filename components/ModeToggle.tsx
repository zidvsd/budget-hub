"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ModeToggleProps {
  showText?: boolean;
  variant?: "ghost" | "nav";
}

export function ModeToggle({
  showText = false,
  variant = "ghost",
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR mismatch
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const label = theme === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <Button
      variant={variant}
      onClick={toggleTheme}
      className={`flex items-center   gap-2 rounded-md  
        ${showText ? "px-3 py-2 justify-start" : "p-0 w-8 h-8 justify-center"} 
        ${
          variant === "nav"
            ? "hover:bg-muted hover:text-accent"
            : "dark:hover:bg-accent/60 hover:text-white dark:hover:text-white"
        }
      `}
    >
      {/* ICON WRAPPER — fixes layout shift */}
      <span className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>

      {/* TEXT */}
      {showText && <span className="font-normal">{label}</span>}
    </Button>
  );
}
