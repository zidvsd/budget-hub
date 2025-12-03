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
  icon: ReactNode;
  stat: string | number;
  description?: string;
}

export function StatCard({ title, icon, stat, description }: StatCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between p-4 w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Left side: title, icon, description */}
      <div className="flex flex-col gap-2 items-start w-full">
        <CardTitle className=" text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
        {description && (
          <CardDescription className="text-xs max-w-sm text-wrap text-neutral-500 dark:text-neutral-400">
            {description}
          </CardDescription>
        )}
      </div>

      {/* Right side: stat */}
      <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {stat}
      </div>
    </Card>
  );
}
