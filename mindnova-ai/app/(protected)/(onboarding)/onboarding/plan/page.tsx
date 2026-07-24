import type { Metadata } from "next";
import { PlanContainer } from "@/src/components/page/student/onboarding";

export const metadata: Metadata = {
  title: "Your Learning Plan — MindNova AI",
  description: "Your personalized AI-crafted learning path, built around your goals and skill level.",
};

export default function PlanPage() {
  return <PlanContainer />;
}
