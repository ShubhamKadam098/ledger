"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactionSchema } from "@/lib/validations";
import { z } from "zod";

export async function createTransaction(
  input: z.infer<typeof transactionSchema>
) {
  const user = await getCurrentUser();
  const data = transactionSchema.parse(input);

  return db.transaction.create({
    data: { ...data, userId: user.id },
  });
}

export async function updateTransaction(
  id: string,
  input: Partial<z.infer<typeof transactionSchema>>
) {
  const user = await getCurrentUser();

  return db.transaction.updateMany({
    where: { id, userId: user.id },
    data: input,
  });
}

export async function deleteTransaction(id: string) {
  const user = await getCurrentUser();

  return db.transaction.deleteMany({
    where: { id, userId: user.id },
  });
}

export async function createCategory(input: {
  name: string;
  colorHex?: string;
}) {
  const user = await getCurrentUser();

  return db.category.create({
    data: {
      name: input.name,
      colorHex: input.colorHex,
      userId: user.id,
    },
  });
}

export async function updateCategory(
  id: string,
  input: { name?: string; colorHex?: string }
) {
  const user = await getCurrentUser();

  return db.category.updateMany({
    where: { id, userId: user.id },
    data: input,
  });
}

export async function deleteCategory(id: string) {
  const user = await getCurrentUser();

  return db.category.deleteMany({
    where: { id, userId: user.id },
  });
}

export async function upsertMonthlyBudget(input: {
  monthKey: string;
  amount: number;
}) {
  const user = await getCurrentUser();

  return db.monthlyBudget.upsert({
    where: { userId_monthKey: { userId: user.id, monthKey: input.monthKey } },
    create: { userId: user.id, monthKey: input.monthKey, amount: input.amount },
    update: { amount: input.amount },
  });
}

export async function upsertCategoryBudget(input: {
  categoryId: string;
  monthKey: string;
  amount: number;
}) {
  const user = await getCurrentUser();

  return db.categoryMonthlyBudget.upsert({
    where: {
      userId_categoryId_monthKey: {
        userId: user.id,
        categoryId: input.categoryId,
        monthKey: input.monthKey,
      },
    },
    create: {
      userId: user.id,
      categoryId: input.categoryId,
      monthKey: input.monthKey,
      amount: input.amount,
    },
    update: { amount: input.amount },
  });
}
