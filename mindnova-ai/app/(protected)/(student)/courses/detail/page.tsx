import type { Metadata } from "next";
import React from "react";
import { CourseDetailContainer } from "@/src/components/page/student/courses";

export const metadata: Metadata = {
  title: "Chi tiết chuyên đề & Lộ trình đào tạo | MindNova AI",
  description: "Xem cấu trúc học thuật, đánh giá chuyên sâu và nhận chứng chỉ tốt nghiệp được hậu thuẫn bởi Trí tuệ Nhân tạo MindNova.",
};

export default function CourseDetailPage() {
  return <CourseDetailContainer />;
}
