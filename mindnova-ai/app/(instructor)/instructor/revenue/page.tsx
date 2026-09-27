import { RevenueContainer } from "@features/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Quản lý Doanh thu",
 description: "Theo dõi thu nhập và quản lý các giao dịch của bạn.",
};

export default function RevenuePage() {
 return <RevenueContainer />;
}
