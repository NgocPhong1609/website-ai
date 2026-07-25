// ─── Billing Feature — Types ──────────────────────────────────────────────────

export type TransactionStatus = "Paid" | "Refunded" | "Pending" | "Failed";

export type FilterPeriod = "Last 6 Months" | "Last 3 Months" | "Last Year" | "All Time";

export interface PaymentCard {
  id: string;
  brand: "visa" | "mastercard";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  date: string;
  service: string;
  serviceIcon: "course" | "subscription" | "python";
  amount: number;
  status: TransactionStatus;
  canRefund: boolean;
}
