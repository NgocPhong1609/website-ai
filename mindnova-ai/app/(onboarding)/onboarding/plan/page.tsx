import type { Metadata } from "next";
import { PlanContainer } from "@/src/features/student/onboarding/components/plan";

export const metadata: Metadata = {
 title: "Lộ trình học tập — MindNova AI",
 description: "Lộ trình học tập do AI thiết kế theo mục tiêu và trình độ của bạn.",
};

export default function PlanPage() {
 return <PlanContainer />;
}
