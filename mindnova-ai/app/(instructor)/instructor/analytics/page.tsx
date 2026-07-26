import { StudentAnalyticsContainer } from "@/src/features/instructor/analytic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Analytics — MindNova AI",
  description:
    "Phân tích chuyên sâu về lộ trình học tập và tương tác của từng cá nhân.",
};

export default function AnalyticsPage() {
  return <StudentAnalyticsContainer />;
}
