"use client";

import { useState } from "react";

interface ContactPickerProps {
  onPick: (phone: string, name?: string) => void;
  onClose: () => void;
}

export function ContactPicker({ onPick, onClose }: ContactPickerProps) {
  const [manualPhone, setManualPhone] = useState("");
  const [manualName, setManualName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pickFromContacts = async () => {
    try {
      // Check if Contacts API is available
      if (
        "contacts" in navigator &&
        "select" in
          (navigator as unknown as { contacts: { select: unknown } }).contacts
      ) {
        const contacts = await (
          navigator as unknown as {
            contacts: {
              select: (
                props: string[],
                options: { multiple: boolean }
              ) => Promise<unknown[]>;
            };
          }
        ).contacts.select(["name", "tel"], {
          multiple: false,
        });

        if (contacts && contacts.length > 0) {
          const contact = contacts[0] as { tel?: string[]; name?: string[] };
          const phone = contact.tel?.[0];
          const name = contact.name?.[0];

          if (phone) {
            onPick(phone, name);
            onClose();
            return;
          }
        }
      }

      setError("Contacts API not supported or no contact selected");
    } catch {
      setError("Failed to access contacts");
    }
  };

  const handleManualSubmit = () => {
    if (manualPhone.trim()) {
      onPick(manualPhone.trim(), manualName.trim() || undefined);
      onClose();
    } else {
      setError("Phone number is required");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Select Contact</h3>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <div className="space-y-4">
          <button
            onClick={pickFromContacts}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Pick from Contacts
          </button>

          <div className="text-center text-gray-500">or</div>

          <div className="space-y-2">
            <input
              type="tel"
              placeholder="Phone number"
              value={manualPhone}
              onChange={(e) => setManualPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Use Manual Entry
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
