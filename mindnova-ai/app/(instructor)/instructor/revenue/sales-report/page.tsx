import { SalesReportContainer } from "@/src/features/instructor/revenue/components/SalesReportContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detailed Sales Analytics — MindNova AI",
  description: "Detailed sales reports and analytics.",
};

export default function SalesReportPage() {
  return <SalesReportContainer />;
}
