import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  paymentMethod: z.enum(["UPI_PHONE", "UPI_QR", "CASH"]),
  spendingDate: z.date(),
  contactIdentifier: z.string().min(1),
  recipientName: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  colorHex: z.string().optional(),
});

export const monthlyBudgetSchema = z.object({
  monthKey: z.string(),
  amount: z.number().positive(),
});

export const categoryBudgetSchema = z.object({
  categoryId: z.string(),
  monthKey: z.string(),
  amount: z.number().positive(),
});
