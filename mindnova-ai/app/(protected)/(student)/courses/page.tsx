import React from "react";
import type { Metadata } from "next";
import { StudentCoursesContainer } from "@/src/components/page/student/courses";

export const metadata: Metadata = {
  title: "Khóa học của tôi | MindNova AI",
  description:
    "Quản lý danh sách khóa học đã đăng ký, theo dõi tiến độ học tập và tối ưu hóa lộ trình bởi trợ lý AI MindNova.",
};

export default function MyCoursesPage() {
  return <StudentCoursesContainer />;
}
