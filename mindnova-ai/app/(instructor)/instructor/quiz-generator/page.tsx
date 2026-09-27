import { Suspense } from "react";
import { Metadata } from "next";
import { QuizListContainer, QuizListSkeleton } from "@/src/features/instructor/quiz-generator/components/QuizListContainer";

export const metadata: Metadata = {
  title: "Bài kiểm tra — MindNova AI Instructor",
  description: "Quản lý các bài kiểm tra trắc nghiệm và tự luận của bạn.",
};

export default function InstructorQuizListPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          <QuizListSkeleton />
        </div>
      }
    >
      <QuizListContainer />
    </Suspense>
  );
}
