import type { Metadata } from "next";
import { TopicsContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Choose Topics",
  description: "Select topics to personalize your AI-powered learning path.",
};

export default function TopicsPage() {
  return <TopicsContainer />;
}
