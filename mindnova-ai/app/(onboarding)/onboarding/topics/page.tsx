import type { Metadata } from "next";
import { TopicsContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Chủ đề và thời gian",
  description: "Chọn chủ đề quan tâm và thời gian học mỗi ngày.",
};

export default function Page() {
  return <TopicsContainer />;
}
