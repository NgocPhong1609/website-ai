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
    expiry: "04/27",
    isDefault: false,
  },
];

// ─── Upcoming Payment ─────────────────────────────────────────────────────────

export const UPCOMING_PAYMENT = {
  amount: "599.000 VNĐ",
  dueDate: "14/10/2026",
  plan: "Gói MindNova AI Pro – Gia hạn theo tháng",
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoiceId: "#MN-90234",
    date: "14/09/2026",
    service: "Chuyên sâu Mạng Thần Kinh (Neural Networks)",
    serviceIcon: "course",
    amount: "1.490.000 VNĐ",
    status: "Paid",
    canRefund: true,
  },
  {
    id: "tx-2",
    invoiceId: "#MN-89112",
    date: "14/08/2026",
    service: "Gói MindNova Pro – Truy cập AI 24/7",
    serviceIcon: "subscription",
    amount: "599.000 VNĐ",
    status: "Paid",
    canRefund: true,
  },
  {
    id: "tx-3",
    invoiceId: "#MN-88540",
    date: "28/07/2026",
    service: "Lập trình Python cho Data Science & AI",
    serviceIcon: "python",
    amount: "890.000 VNĐ",
    status: "Refunded",
    canRefund: false,
  },
  {
    id: "tx-4",
    invoiceId: "#MN-87002",
    date: "14/07/2026",
    service: "Gói MindNova Pro – Truy cập AI 24/7",
    serviceIcon: "subscription",
    amount: "599.000 VNĐ",
    status: "Paid",
    canRefund: false,
  },
];

export const FILTER_PERIODS = [
  "6 Tháng qua",
  "3 Tháng qua",
  "1 Năm qua",
  "Tất cả thời gian",
] as const;
