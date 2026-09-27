import type { Metadata } from "next";
import { GoalContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Chọn mục tiêu",
  description: "Chọn mục tiêu học tập để MindNova AI cá nhân hóa lộ trình.",
};

export default function Page() {
  return <GoalContainer />;
}
