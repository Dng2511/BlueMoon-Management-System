"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";

export const description = "An interactive area chart";

interface ChartAreaInteractiveProps {
  month: {
    time: string;
    revenue: number;
  }[];
  year: {
    time: string;
    revenue: number;
  }[];
}


type RevenueData = {
  time: string;
  revenue: number;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ month, year }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("3 months");
  const [data, setData] = React.useState<RevenueData[]>([]);

  React.useEffect(() => {
    if (timeRange == "3 months") setData(month.slice(-3))
    else if (timeRange == "1 year") setData(month);
    else if (timeRange == "years") setData(year);
  }, [timeRange, month, year])



  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Total for the last ${timeRange}`}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="3 months">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="1 year">Last 1 year</ToggleGroupItem>
            <ToggleGroupItem value="years">Years</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3 months" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="1 year" className="rounded-lg">
                Last 1 year
              </SelectItem>
              <SelectItem value="years" className="rounded-lg">
                Years
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84daff" stopOpacity={1.0} />
                <stop offset="95%" stopColor="#84daff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value;
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return value;
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="#84daff"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
