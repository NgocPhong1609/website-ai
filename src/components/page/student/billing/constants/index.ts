import type { PaymentCard, Transaction } from "../types";

// ─── Payment Cards ────────────────────────────────────────────────────────────

export const PAYMENT_CARDS: PaymentCard[] = [
  {
    id: "card-1",
    brand: "visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "card-2",
    brand: "mastercard",
    last4: "8812",
    expiry: "04/25",
    isDefault: false,
  },
];

// ─── Upcoming Payment ─────────────────────────────────────────────────────────

export const UPCOMING_PAYMENT = {
  amount: 29.0,
  dueDate: "Oct 14, 2024",
  plan: "MindNova Pro – Monthly Plan",
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoiceId: "#MN-90234",
    date: "Sep 14, 2024",
    service: "Advanced Neural Networks",
    serviceIcon: "course",
    amount: 149.0,
    status: "Paid",
    canRefund: true,
  },
  {
    id: "tx-2",
    invoiceId: "#MN-89112",
    date: "Aug 14, 2024",
    service: "MindNova Pro Monthly",
    serviceIcon: "subscription",
    amount: 29.0,
    status: "Paid",
    canRefund: true,
  },
  {
    id: "tx-3",
    invoiceId: "#MN-88540",
    date: "Jul 28, 2024",
    service: "Python for Data Science",
    serviceIcon: "python",
    amount: 89.0,
    status: "Refunded",
    canRefund: false,
  },
  {
    id: "tx-4",
    invoiceId: "#MN-87002",
    date: "Jul 14, 2024",
    service: "MindNova Pro Monthly",
    serviceIcon: "subscription",
    amount: 29.0,
    status: "Paid",
    canRefund: false,
  },
];

export const FILTER_PERIODS = [
  "Last 6 Months",
  "Last 3 Months",
  "Last Year",
  "All Time",
] as const;
