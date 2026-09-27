import { SalesReportContainer } from "@features/instructor/revenue";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Báo cáo Bán hàng",
 description: "Phân tích chi tiết doanh số bán hàng.",
};

export default function SalesReportPage() {
 return <SalesReportContainer />;
}
