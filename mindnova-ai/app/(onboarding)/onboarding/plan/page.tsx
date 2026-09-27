import type { Metadata } from "next";
import { PlanContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Lộ trình của bạn",
  description: "Lộ trình học tập do AI thiết kế theo mục tiêu và trình độ của bạn.",
};

export default function Page() {
  return <PlanContainer />;
}
