import type { Metadata } from "next";
import { QuizResultContent } from "@/src/features/student/quiz";

export const metadata: Metadata = {
  title: "Quiz Result | MindNova AI",
  description: "View your quiz results.",
};

export default function QuizResultPage() {
  return <QuizResultContent />;
}
