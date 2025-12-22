"use client";

import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Orders",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  processing: {
    label: "Processing",
    color: "var(--chart-1)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface OrderPieProps {
  data: { status: string; count: number; fill: string }[];
}

export function ChartPieLabelList({ data }: OrderPieProps) {
  return (
    <Card className="flex flex-col  shadow-none ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Current breakdown of all store orders</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={50}
              strokeWidth={1}
            >
              {/* This LabelList displays the status name (e.g. Completed) outside/on edge */}
              <LabelList
                dataKey="status"
                className="fill-foreground capitalize"
                stroke="none"
                fontSize={12}
                offset={15}
                position="outside"
              />
              {/* This LabelList displays the actual NUMBER inside the slice */}
              <LabelList
                dataKey="count"
                className="fill-background font-bold"
                stroke="none"
                fontSize={14}
                position="inside"
              />
            </Pie>
            {/* The Legend component adds the color key at the bottom */}
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
