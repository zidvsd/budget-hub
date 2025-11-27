"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  icon: ReactNode; // Pass a Lucide icon component here
  stat: string | number;
  description?: string; // optional
}

export function StatCard({ title, icon, stat, description }: StatCardProps) {
  return (
    <Card className="flex flex-col items-start p-4">
      <CardHeader className="flex items-center gap-4 p-0">
        <div className="text-primary">{icon}</div>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <div className="text-2xl font-bold">{stat}</div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}
