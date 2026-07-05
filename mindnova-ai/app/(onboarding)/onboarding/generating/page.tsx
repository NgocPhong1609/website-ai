import type { Metadata } from "next";
import { GeneratingContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Generating Plan",
  description: "MindNova AI is generating your personalized study plan.",
};

export default function GeneratingPage() {
  return <GeneratingContainer />;
}
