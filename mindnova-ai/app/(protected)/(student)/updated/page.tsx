import React from "react";
import { StudentDashboardContainer } from "@/src/components/page/student/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng thông tin học tập cập nhật | MindNova AI",
  description: "Trở lại lộ trình cá nhân hóa được hỗ trợ bởi Trí tuệ Nhân tạo MindNova.",
};

export default function DashboardUpdatedPage() {
  return <StudentDashboardContainer />;
}
