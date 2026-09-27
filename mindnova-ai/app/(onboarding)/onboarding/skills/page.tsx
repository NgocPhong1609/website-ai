import type { Metadata } from "next";
import { SkillContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Chọn trình độ",
  description: "Cho MindNova AI biết trình độ hiện tại của bạn.",
};

export default function Page() {
  return <SkillContainer />;
}
