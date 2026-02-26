"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { useMemo } from "react";
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

export const description = "A bar chart with an active bar";

const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;
type TopProduct = {
  name: string;
  quantity: number;
};

interface ChartBarActiveProps {
  data: TopProduct[];
}

export function ChartBarActive({ data }: ChartBarActiveProps) {
  // 1. Transform data for Recharts
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        product: item.name,
        sales: item.quantity,
        fill: `var(--chart-${(index % 5) + 1})`,
      })),
    [data],
  );

  // 2. Dynamic Config (Important: the key must match the dataKey "sales")
  const chartConfig = {
    sales: {
      label: "Quantity Sold",
    },
    // We add product specific labels for the tooltip to find
    ...data.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return acc;
    }, {} as ChartConfig),
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
        <CardDescription>Most popular items by sales volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="product"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // Simplified: Just use the product name directly
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales" // This MUST match the key in chartData
              strokeWidth={2}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* Footer logic remains the same */}
    </Card>
  );
}
