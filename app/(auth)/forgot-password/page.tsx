"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add logic to send password reset email
    console.log("Reset link sent to:", email);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <Button type="submit" className="w-full mt-2 cursor-pointer">
            Send Reset Link
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Link
          href="/login"
          className="text-sm underline hover:underline-offset-2"
        >
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
