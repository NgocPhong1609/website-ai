import type { Metadata } from "next";
import { QuizQuestionScreen } from "@/src/components/page/student/quiz";

export const metadata: Metadata = {
  title: "Quiz Question | MindNova AI",
  description: "Answer quiz questions.",
};

export default function QuizQuestionPage() {
  return <QuizQuestionScreen />;
}
