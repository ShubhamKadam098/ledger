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

interface CategorySpending {
  categoryId: string | null;
  categoryName: string;
  amount: number;
  colorHex?: string | null;
}

interface CategoryPieProps {
  data: CategorySpending[];
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

export function CategoryPie({ data }: CategoryPieProps) {
  if (data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-lg">Spending by Category</CardTitle>
          <CardDescription>Current Month</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center py-8 text-muted-foreground">
            No spending data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    category: item.categoryName || "Uncategorized",
    amount: item.amount,
    fill: item.colorHex || `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg">Spending by Category</CardTitle>
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
              innerRadius={40}
              outerRadius={80}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>

        <div className="text-center mt-4">
          <div className="text-2xl font-bold">₹{total.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total spent</div>
        </div>

        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span>{item.category}</span>
              </div>
              <span className="font-medium">
                ₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
