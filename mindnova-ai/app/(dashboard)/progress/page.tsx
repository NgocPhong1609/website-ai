import { Metadata } from "next";
import { ProgressContent } from "@/src/features/student/progress/components/ProgressContent";

export const metadata: Metadata = {
  title: "Learning Progress",
  description: "Track your course progress, study time, and skill mastery.",
};

export default function ProgressPage() {
  return <ProgressContent />;
}
