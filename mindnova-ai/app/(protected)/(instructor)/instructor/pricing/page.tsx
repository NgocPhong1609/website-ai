import { PricingContainer } from "@/src/components/page/instructor/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Giá & Kiếm tiền — MindNova AI",
  description:
    "Cấu hình mô hình doanh thu, định giá và quản lý chương trình khuyến mãi cho khóa học của bạn.",
};

export default function PricingPage() {
  return <PricingContainer />;
}
