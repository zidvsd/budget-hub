"use client";

import { TrendingUp, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
interface ChartLineDefaultProps {
  data: { month: string; users: number }[];
}

export const description = "A line chart";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineDefault({ data }: ChartLineDefaultProps) {
  const totalUsers = data.reduce((acc, d) => acc + d.users, 0);
  const lastVal = data[data.length - 1]?.users || 0;
  const prevVal = data[data.length - 2]?.users || 0;
  const change = prevVal
    ? (((lastVal - prevVal) / prevVal) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>New customer registrations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Only slice if it looks like a long month name
              tickFormatter={(value) =>
                value.length > 6 ? value.slice(0, 3) : value
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="users"
              type="monotone" // Smoother curve than "natural" for activity
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--chart-1)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Users className="h-5 w-5 text-accent" />
          {totalUsers.toLocaleString()} Users
        </div>
        <div
          className={cn(
            "flex items-center gap-1 font-medium",
            Number(change) >= 0 ? "text-green-600" : "text-red-600",
          )}
        >
          {Number(change) >= 0 ? "+" : ""}
          {change}% from previous period
          <TrendingUp
            className={cn("h-4 w-4", Number(change) < 0 && "rotate-180")}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
