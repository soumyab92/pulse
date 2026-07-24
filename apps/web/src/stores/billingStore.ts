import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  billingCycle: "monthly" | "yearly";
  amount: string;
  status: "Paid" | "Pending" | "Refunded";
  paymentMethod: string;
}

interface BillingStore {
  orderHistory: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "id" | "date">) => Invoice;
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-0042",
    date: "2026-06-01",
    planName: "Free Plan",
    billingCycle: "monthly",
    amount: "$0.00",
    status: "Paid",
    paymentMethod: "Free Tier",
  },
  {
    id: "INV-2026-0189",
    date: "2026-07-01",
    planName: "Free Plan",
    billingCycle: "monthly",
    amount: "$0.00",
    status: "Paid",
    paymentMethod: "Free Tier",
  },
];

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      orderHistory: INITIAL_INVOICES,
      addInvoice: (newInvoiceData) => {
        const id = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const date = new Date().toISOString().split("T")[0];
        const fullInvoice: Invoice = {
          ...newInvoiceData,
          id,
          date,
        };
        set({ orderHistory: [fullInvoice, ...get().orderHistory] });
        return fullInvoice;
      },
    }),
    {
      name: "pulse-billing-store",
    }
  )
);
