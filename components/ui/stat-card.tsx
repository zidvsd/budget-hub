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
    default:
      "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
    success:
      "border-green-200 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20",
    warning:
      "border-amber-200 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-800 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20",
    danger:
      "border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20",
  };

  const iconBackgrounds = {
    default: "bg-primary/10 text-primary",
    success:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    warning:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return (
    <Card
      className={`
      group relative overflow-hidden
      transition-all duration-300 ease-out
      hover:shadow-lg hover:-translate-y-0.5
      border-2
      ${variantStyles[variant]}
    `}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: icon, title, description */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Icon with background */}
            <div
              className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transition-transform duration-300 group-hover:scale-110
              ${iconBackgrounds[variant]}
            `}
            >
              <div className="w-6 h-6">{icon}</div>
            </div>

            {/* Title */}
            <div>
              <CardTitle className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {title}
              </CardTitle>

              {/* Trend indicator */}
              {trend && (
                <div
                  className={`
                  inline-flex items-center gap-1 text-xs font-medium
                  ${
                    trend.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                `}
                >
                  <span>{trend.isPositive ? "↑" : "↓"}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>

          {/* Right side: stat */}
          <div className="text-right">
            <div className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {stat}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
