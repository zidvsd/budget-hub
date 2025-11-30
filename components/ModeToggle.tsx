"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  showText?: boolean;
}

export function ModeToggle({ showText = false }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const label = theme === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <Button
      variant="ghost"
      size={showText ? "default" : "icon"}
      onClick={toggleTheme}
      className="flex text items-start justify-start p-2 gap-2 md:w-full  "
    >
      {/* ICON WRAPPER — FIXES LAYOUT SHIFT */}
      <span className="relative h-5 w-5 flex items-center justify-center">
        <Sun className="absolute size-4  rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4   rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>

      {/* TEXT */}
      {showText && <span>{label}</span>}
    </Button>
  );
}
