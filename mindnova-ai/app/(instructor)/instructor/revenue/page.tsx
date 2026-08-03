import { RevenueContainer } from "@/src/features/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doanh thu & Tài chính — MindNova AI",
  description: "Theo dõi thu nhập và quản lý các giao dịch của bạn.",
};

export default function RevenuePage() {
  return <RevenueContainer />;
}
