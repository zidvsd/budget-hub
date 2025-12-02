"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Signup error", data.error);
        toast.error("Failed to sign in", data.error);
      }

      toast.success("Account created successfully!");
      setEmail("");
      setPassword("");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm dark:bg-muted">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="off"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                autoComplete="off"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute hover-utility cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant={"accent"}
            className="w-full mt-2 cursor-pointer"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <CardAction>
          <Link href="/login">
            <Button variant="link" className="w-full cursor-pointer">
              Already have an account? Log in
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
