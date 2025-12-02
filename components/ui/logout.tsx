"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  showText?: boolean;
}

export default function LogoutButton({ showText = true }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Failed to logout");
        return;
      }

      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
      toast.error("Logout failed: " + err.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center gap-2 rounded-md transition
        ${showText ? "px-3 py-2 justify-start" : "p-0 w-8 h-8 justify-center"}
        dark:hover:bg-accent/60 hover:bg-accent/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {showText && (
        <span className="font-normal">
          {isLoggingOut ? "Logging Out..." : "Log Out"}
        </span>
      )}
    </Button>
  );
}
