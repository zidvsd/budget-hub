"use client";

interface LogoutButtonProps {
  showText?: boolean;
}
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
      variant={"ghost"}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className=" flex justify-start gap-2 w-full rounded-md px-2 py-1.5 text-sm font-medium  hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
