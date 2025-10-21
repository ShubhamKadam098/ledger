import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { monthKey } from "@/lib/date";
import {
  getMonthlySpending,
  getCategorySpending,
  getLastPhoneTransactions,
  getMonthlyBudget,
} from "@/lib/queries";
import { NewEntryDialog } from "@/components/transactions/new-entry-dialog";
import { BudgetDonut } from "@/components/charts/budget-donut";
import { CategoryPie } from "@/components/charts/category-pie";
import { TransactionList } from "@/components/transactions/transaction-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const user = await getCurrentUser();
  const currentMonth = monthKey();

  // Fetch all data in parallel
  const [
    categories,
    monthlySpending,
    categorySpending,
    lastPhoneTransactions,
    monthlyBudget,
  ] = await Promise.all([
    db.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    }),
    getMonthlySpending(user.id, currentMonth),
    getCategorySpending(user.id, currentMonth),
    getLastPhoneTransactions(user.id),
    getMonthlyBudget(user.id, currentMonth),
  ]);

  // Transform category spending data
  const categorySpendingWithNames = await Promise.all(
    categorySpending.map(async (item) => {
      const category = item.categoryId
        ? await db.category.findUnique({ where: { id: item.categoryId } })
        : null;

      return {
        categoryId: item.categoryId,
        categoryName: category?.name || "Uncategorized",
        amount: item.amount,
        colorHex: category?.colorHex,
      };
    })
  );

  const budgetAmount = monthlyBudget?.amount ? Number(monthlyBudget.amount) : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.email}
          </p>
        </div>
        <NewEntryDialog categories={categories} />
      </div>

      {/* Current Month Total */}
      <Card>
        <CardHeader>
          <CardTitle>Current Month Spending</CardTitle>
          <CardDescription>{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{monthlySpending.toLocaleString()}
          </div>
          {budgetAmount > 0 && (
            <div className="text-sm text-muted-foreground mt-1">
              Budget: ₹{budgetAmount.toLocaleString()}
              {monthlySpending > budgetAmount && (
                <span className="text-destructive ml-2">
                  (Overspent by ₹
                  {(monthlySpending - budgetAmount).toLocaleString()})
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Budget Status */}
        <BudgetDonut spent={monthlySpending} budget={budgetAmount} />

        {/* Category Spending */}
        <CategoryPie data={categorySpendingWithNames} />
      </div>

      {/* Recent Transactions */}
      <TransactionList transactions={lastPhoneTransactions} />
    </div>
  );
}
