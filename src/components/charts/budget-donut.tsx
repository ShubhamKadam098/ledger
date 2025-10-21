"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
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

interface BudgetDonutProps {
  spent: number;
  budget: number;
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--destructive))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function BudgetDonut({ spent, budget }: BudgetDonutProps) {
  const remaining = Math.max(budget - spent, 0);
  const overspent = Math.max(spent - budget, 0);

  const chartData = [
    {
      category: "spent",
      amount: spent,
      fill: "var(--color-spent)",
    },
    {
      category: "remaining",
      amount: remaining,
      fill: "var(--color-remaining)",
    },
  ];

  const total = spent + remaining;
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg">Budget Status</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>

        <div className="text-center mt-4">
          <div className="text-2xl font-bold">₹{spent.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">
            of ₹{budget.toLocaleString()} ({percentage}%)
          </div>
          {overspent > 0 && (
            <div className="text-sm text-destructive font-medium">
              Overspent by ₹{overspent.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
