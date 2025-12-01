"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ModeToggleProps {
  showText?: boolean;
}

export function ModeToggle({ showText = false }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const label = theme === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <Button
      variant={"ghost"}
      onClick={toggleTheme}
      className="flex justify-start gap-2 w-full rounded-md px-2 py-1.5 text-sm font-medium  hover:text-white"
    >
      {/* ICON WRAPPER — FIXES LAYOUT SHIFT */}
      <span className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>

      {/* TEXT */}
      {showText && <span className="font-normal">{label}</span>}
    </Button>
  );
}
