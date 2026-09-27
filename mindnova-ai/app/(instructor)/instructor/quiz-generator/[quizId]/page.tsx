import { Metadata } from "next";
import { QuizDetailContainer } from "@/src/features/instructor/quiz-generator/components/QuizDetailContainer";

export const metadata: Metadata = {
  title: "Chi tiết bài kiểm tra — MindNova AI Instructor",
  description: "Xem và chỉnh sửa điểm các câu hỏi trong bài kiểm tra.",
};

export default async function QuizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  return <QuizDetailContainer quizId={Number(quizId)} />;
}
