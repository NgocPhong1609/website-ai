import type { Metadata } from "next";
import { QuizStartContent } from "@/src/features/student/quiz";

export const metadata: Metadata = {
  title: "Quiz Start | MindNova AI",
  description: "Start your quiz and test your knowledge.",
};

export default function QuizStartPage() {
  return <QuizStartContent />;
}
