"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Ensure you have this utility or use standard strings

interface StatCardProps {
  title: string;
  icon: ReactNode;
  stat: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  icon,
  stat,
  description,
  trend,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "border-neutral-200 dark:border-neutral-800",
    success: "border-green-500/20 bg-green-50/30 dark:bg-green-500/5",
    warning: "border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5",
    danger: "border-red-500/20 bg-red-50/30 dark:bg-red-500/5",
  };

  const glowStyles = {
    default: "bg-neutral-400/10",
    success: "bg-green-500/20",
    warning: "bg-amber-500/20",
    danger: "bg-red-500/20",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-2xl hover:shadow-neutral-500/10 hover:-translate-y-1",
        "border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-sm",
        variantStyles[variant]
      )}
    >
      {/* Decorative Gradient Glow */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl transition-opacity opacity-50 group-hover:opacity-100",
          glowStyles[variant]
        )}
      />

      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Title & Trend */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {stat}
                </h3>
                {trend && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                      trend.isPositive
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    )}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
            </div>

            {/* Icon Container */}
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                "bg-white dark:bg-sidebar border border-neutral-200 dark:border-neutral-800"
              )}
            >
              <div className="h-6 w-6 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">
                {icon}
              </div>
            </div>
          </div>

          {/* Description footer */}
          {description && (
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-600/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
