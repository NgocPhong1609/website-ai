import React from "react";
import { StudentProgressContainer } from "@/src/components/page/student/progress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiến độ học thuật & Kỹ năng | MindNova AI",
  description: "Theo dõi chuỗi ngày học tập, điểm thi trung bình và lộ trình phân giải kỹ thuật được giám sát bởi Gia sư AI.",
};

export default function ProgressPage() {
  return <StudentProgressContainer />;
}
