import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { monthKey } from "@/lib/date";
import { getMonthlyBudget, getCategoryBudgets } from "@/lib/queries";
import { BudgetForm } from "@/components/budget/budget-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BudgetPage() {
  const user = await getCurrentUser();
  const currentMonth = monthKey();

  const [categories, monthlyBudget, categoryBudgets] = await Promise.all([
    db.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
    getMonthlyBudget(user.id, currentMonth),
    getCategoryBudgets(user.id, currentMonth),
  ]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Budget Configuration</h1>
        <p className="text-muted-foreground">
          Set your monthly budgets for {currentMonth}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Overall Monthly Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Monthly Budget</CardTitle>
            <CardDescription>
              Set your total monthly spending limit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm
              type="monthly"
              monthKey={currentMonth}
              currentAmount={
                monthlyBudget?.amount ? Number(monthlyBudget.amount) : 0
              }
            />
          </CardContent>
        </Card>

        {/* Category Budgets */}
        <Card>
          <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>
              Set spending limits for specific categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No categories found.</p>
                  <p className="text-sm">
                    Create categories first to set category budgets.
                  </p>
                </div>
              ) : (
                categories.map(
                  (category: {
                    id: string;
                    name: string;
                    colorHex: string | null;
                  }) => {
                    const categoryBudget = categoryBudgets.find(
                      (cb: { categoryId: string }) =>
                        cb.categoryId === category.id
                    );

                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor:
                                category.colorHex || "hsl(var(--muted))",
                            }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <BudgetForm
                          type="category"
                          monthKey={currentMonth}
                          categoryId={category.id}
                          currentAmount={
                            categoryBudget?.amount
                              ? Number(categoryBudget.amount)
                              : 0
                          }
                        />
                      </div>
                    );
                  }
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
