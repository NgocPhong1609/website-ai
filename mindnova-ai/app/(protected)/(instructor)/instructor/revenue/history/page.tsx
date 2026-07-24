import { TransactionHistoryContainer } from "@/src/components/page/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử Giao dịch — MindNova AI",
  description: "Theo dõi và quản lý mọi dòng tiền từ hoạt động giảng dạy.",
};

export default function TransactionHistoryPage() {
  return <TransactionHistoryContainer />;
}
