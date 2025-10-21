import { db } from "@/lib/db";
import { getMonthRange } from "./date";

export async function getMonthlySpending(userId: string, monthKey: string) {
  const { start, end } = getMonthRange(monthKey);
  const result = await db.transaction.aggregate({
    where: {
      userId,
      spendingDate: { gte: start, lte: end },
    },
    _sum: { amount: true },
  });
  return Number(result._sum.amount || 0);
}

export async function getCategorySpending(userId: string, monthKey: string) {
  const { start, end } = getMonthRange(monthKey);
  const result = await db.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      spendingDate: { gte: start, lte: end },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 10,
  });

  return result.map((item) => ({
    categoryId: item.categoryId,
    amount: Number(item._sum.amount || 0),
  }));
}

export async function getLastPhoneTransactions(userId: string, limit = 10) {
  return db.transaction.findMany({
    where: {
      userId,
      paymentMethod: "UPI_PHONE",
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getMonthlyBudget(userId: string, monthKey: string) {
  return db.monthlyBudget.findUnique({
    where: { userId_monthKey: { userId, monthKey } },
  });
}

export async function getCategoryBudgets(userId: string, monthKey: string) {
  return db.categoryMonthlyBudget.findMany({
    where: { userId, monthKey },
    include: { category: true },
  });
}
