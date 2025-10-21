"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/app/(private)/transactions/actions";
import { QrScanner } from "./qr-scanner";
import { ContactPicker } from "./contact-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";

interface NewEntryDialogProps {
  categories: Array<{ id: string; name: string; colorHex?: string | null }>;
}

function upiLink(vpa: string, amount: number) {
  const u = new URL("upi://pay");
  u.searchParams.set("pa", vpa);
  u.searchParams.set("am", amount.toFixed(2));
  u.searchParams.set("cu", "INR");
  return u.toString();
}

export function NewEntryDialog({ categories }: NewEntryDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    description: "",
    paymentMethod: "CASH" as "UPI_PHONE" | "UPI_QR" | "CASH",
    spendingDate: new Date().toISOString().split("T")[0],
    contactIdentifier: "",
    recipientName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const transactionData = {
          amount: parseFloat(formData.amount),
          categoryId: formData.categoryId || undefined,
          description: formData.description || undefined,
          paymentMethod: formData.paymentMethod,
          spendingDate: new Date(formData.spendingDate),
          contactIdentifier: formData.contactIdentifier,
          recipientName: formData.recipientName || undefined,
        };

        await createTransaction(transactionData);

        // Show success toast
        showToast("Entry logged successfully!", "success");

        // If UPI payment, redirect to UPI app
        if (
          formData.paymentMethod === "UPI_PHONE" ||
          formData.paymentMethod === "UPI_QR"
        ) {
          const uri = upiLink(
            formData.contactIdentifier,
            transactionData.amount
          );
          window.location.href = uri;
        }

        // Reset form and close dialog
        setFormData({
          amount: "",
          categoryId: "",
          description: "",
          paymentMethod: "CASH",
          spendingDate: new Date().toISOString().split("T")[0],
          contactIdentifier: "",
          recipientName: "",
        });
        setIsOpen(false);

        // Refresh the page to show updated data
        router.refresh();
      } catch (error) {
        console.error("Failed to create transaction:", error);
        showToast("Failed to create transaction. Please try again.", "error");
      }
    });
  };

  const handleQRResult = (vpa: string) => {
    setFormData((prev) => ({ ...prev, contactIdentifier: vpa }));
    setShowQRScanner(false);
  };

  const handleContactPick = (phone: string, name?: string) => {
    setFormData((prev) => ({
      ...prev,
      contactIdentifier: phone,
      recipientName: name || "",
    }));
    setShowContactPicker(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">Add New Entry</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value as
                      | "UPI_PHONE"
                      | "UPI_QR"
                      | "CASH",
                    contactIdentifier: "",
                    recipientName: "",
                  }))
                }
              >
                <option value="CASH">Cash</option>
                <option value="UPI_PHONE">UPI (Phone)</option>
                <option value="UPI_QR">UPI (QR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Spending Date
              </label>
              <Input
                type="date"
                value={formData.spendingDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    spendingDate: e.target.value,
                  }))
                }
              />
            </div>

            {formData.paymentMethod === "UPI_QR" && (
              <div>
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.contactIdentifier}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactIdentifier: e.target.value,
                      }))
                    }
                    placeholder="Scan QR or enter UPI ID"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowQRScanner(true)}
                  >
                    Scan QR
                  </Button>
                </div>
              </div>
            )}

            {formData.paymentMethod === "UPI_PHONE" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.contactIdentifier}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactIdentifier: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactPicker(true)}
                  >
                    Pick Contact
                  </Button>
                </div>
                <Input
                  className="mt-2"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recipientName: e.target.value,
                    }))
                  }
                  placeholder="Recipient name (optional)"
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Saving..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showQRScanner && (
        <QrScanner
          onResult={handleQRResult}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {showContactPicker && (
        <ContactPicker
          onPick={handleContactPick}
          onClose={() => setShowContactPicker(false)}
        />
      )}
    </>
  );
}
