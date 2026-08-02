import React from "react";
import { AIStudyPlanContainer } from "@/src/components/page/student/ai-study-plan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lộ trình & Gia sư AI | MindNova AI",
  description: "Trợ lý Trí tuệ Nhân tạo hỗ trợ lập lộ trình học tập 80/20 và trực tuyến giải đáp mã nguồn 24/7.",
};

export default function AIStudyPlanPage() {
  return <AIStudyPlanContainer />;
}
