"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  updateTransaction,
  deleteTransaction,
} from "@/app/(private)/transactions/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  amount: number;
  description?: string | null;
  paymentMethod: "UPI_PHONE" | "UPI_QR" | "CASH";
  spendingDate: Date;
  contactIdentifier: string;
  recipientName?: string | null;
  category?: {
    id: string;
    name: string;
    colorHex?: string | null;
  } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    spendingDate: "",
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      description: transaction.description || "",
      spendingDate: format(transaction.spendingDate, "yyyy-MM-dd"),
    });
  };

  const handleUpdate = () => {
    if (!editingTransaction) return;

    startTransition(async () => {
      try {
        await updateTransaction(editingTransaction.id, {
          amount: parseFloat(editForm.amount),
          description: editForm.description || undefined,
          spendingDate: new Date(editForm.spendingDate),
        });

        setEditingTransaction(null);
        // Refresh the page to show updated data
        window.location.reload();
      } catch (error) {
        console.error("Failed to update transaction:", error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    startTransition(async () => {
      try {
        await deleteTransaction(id);
        // Refresh the page to show updated data
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "UPI_PHONE":
        return "UPI (Phone)";
      case "UPI_QR":
        return "UPI (QR)";
      case "CASH":
        return "Cash";
      default:
        return method;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Phone Transactions</CardTitle>
        <CardDescription>Last 10 UPI phone payments</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No phone transactions found
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ₹{transaction.amount.toLocaleString()}
                    </span>
                    {transaction.category && (
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            transaction.category.colorHex ||
                            "hsl(var(--muted))",
                          color: "white",
                        }}
                      >
                        {transaction.category.name}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.description && (
                      <span>{transaction.description} • </span>
                    )}
                    {getPaymentMethodLabel(transaction.paymentMethod)} •
                    {transaction.recipientName &&
                      ` ${transaction.recipientName} • `}
                    {transaction.contactIdentifier}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(transaction.spendingDate, "MMM dd, yyyy")}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Amount
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                amount: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <Input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Spending Date
                          </label>
                          <Input
                            type="date"
                            value={editForm.spendingDate}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                spendingDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdate}
                            disabled={isPending}
                            className="flex-1"
                          >
                            {isPending ? "Updating..." : "Update"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingTransaction(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
