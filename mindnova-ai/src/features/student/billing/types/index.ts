// ─── Billing Feature — Types ──────────────────────────────────────────────────

export type TransactionStatus = "Paid" | "Refunded" | "Pending" | "Failed";

export type FilterPeriod = "6 Tháng qua" | "3 Tháng qua" | "1 Năm qua" | "Tất cả thời gian";

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
  amount: number | string;
  status: TransactionStatus;
  canRefund: boolean;
}
