"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
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
      router.push("/login"); // redirect after logout
    } catch (err: any) {
      console.error("Logout failed:", err.message);
      toast.error("Logout failed: " + err.message);
    } finally {
      setIsLoggingOut(false); // reset state
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="cursor-pointer"
    >
      {isLoggingOut ? "Logging Out..." : "Log Out"}
    </Button>
  );
}
