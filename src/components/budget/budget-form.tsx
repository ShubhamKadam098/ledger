"use client";

import { useState, useTransition } from "react";
import {
  upsertMonthlyBudget,
  upsertCategoryBudget,
} from "@/app/(private)/transactions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BudgetFormProps {
  type: "monthly" | "category";
  monthKey: string;
  categoryId?: string;
  currentAmount: number;
}

export function BudgetForm({
  type,
  monthKey,
  categoryId,
  currentAmount,
}: BudgetFormProps) {
  const [amount, setAmount] = useState(currentAmount.toString());
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 0) {
      return;
    }

    startTransition(async () => {
      try {
        if (type === "monthly") {
          await upsertMonthlyBudget({ monthKey, amount: amountValue });
        } else if (type === "category" && categoryId) {
          await upsertCategoryBudget({
            categoryId,
            monthKey,
            amount: amountValue,
          });
        }

        // Show success message
        console.log("Budget updated successfully!");

        // Refresh the page to show updated data
        window.location.reload();
      } catch (error) {
        console.error("Failed to update budget:", error);
      }
    });
  };

  const handleClear = () => {
    setAmount("0");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Budget Amount (₹)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Budget"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isPending}
        >
          Clear
        </Button>
      </div>

      {currentAmount > 0 && (
        <div className="text-sm text-muted-foreground">
          Current budget: ₹{currentAmount.toLocaleString()}
        </div>
      )}
    </form>
  );
}
