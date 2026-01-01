"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

interface ChartAreaDefaultProps {
  revenueData: { month: string; revenue: number }[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaDefault({ revenueData }: ChartAreaDefaultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Growth</CardTitle>
        <CardDescription>
          Total revenue generated over the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={revenueData}
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* Revenue change */}
            {revenueData.length >= 2 &&
              (() => {
                const first = revenueData[revenueData.length - 2].revenue;
                const last = revenueData[revenueData.length - 1].revenue;
                const change = first
                  ? (((last - first) / first) * 100).toFixed(1)
                  : "0";
                const isPositive = Number(change) >= 0;

                return (
                  <div className="flex items-center gap-2 leading-none font-medium">
                    Revenue {isPositive ? "up" : "down"} {change}% this month
                    <TrendingUp
                      className={`h-4 w-4 ${
                        isPositive
                          ? "text-green-500"
                          : "rotate-180 text-red-500"
                      }`}
                    />
                  </div>
                );
              })()}

            {/* Month range */}
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {revenueData[0]?.month} -{" "}
              {revenueData[revenueData.length - 1]?.month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
