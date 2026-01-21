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
import { formatPrice } from "@/lib/utils";

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
  // Compute footer values
  const totalUsers = data.reduce((acc, d) => acc + d.users, 0);
  const lastMonthUsers = data[data.length - 1]?.users || 0;
  const prevMonthUsers = data[data.length - 2]?.users || 0;
  const change = prevMonthUsers
    ? (((lastMonthUsers - prevMonthUsers) / prevMonthUsers) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>
          Daily active users navigating your storefront
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="users"
              type="natural"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <Users className="h-4 w-4" />
          Total Users: {formatPrice(totalUsers)}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          Monthly change: {change}%{" "}
          {Number(change) >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
