import React from "react";
import { StudentDashboardContainer } from "@/src/components/page/student/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng thông tin học tập & Gia sư AI | MindNova AI",
  description: "Trở lại ngay lộ trình học tập đang tiếp diễn, xem khuyến nghị chuyên gia từ Trợ lý AI và khám phá công nghệ mới.",
};

export default function DashboardPage() {
  return <StudentDashboardContainer />;
}
