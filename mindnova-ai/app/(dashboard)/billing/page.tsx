import type { Metadata } from "next";
import { BillingContainer } from "@/src/features/student/billing";

export const metadata: Metadata = {
  title: "Billing & Payments",
  description:
    "Manage your MindNova AI subscriptions, payment methods, and transaction history.",
};

export default function BillingPage() {
  return <BillingContainer />;
}
