import React from "react";
import { Metadata } from "next";
import { QuizManualWizard } from "@/src/features/instructor/quiz-generator/components/QuizManualWizard";

export const metadata: Metadata = {
  title: "Tạo Bài Kiểm Tra Thủ Công | MindNova AI",
  description: "Trình tạo bài kiểm tra thủ công cho giảng viên.",
};

export default function ManualQuizCreatePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black text-[#1A1A2E]">
            Tạo Bài Kiểm Tra Thủ Công
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Tự biên soạn câu hỏi và đáp án cho bài kiểm tra của bạn.
          </p>
        </div>
      </div>
      
      <div className="py-8">
        <QuizManualWizard />
      </div>
    </div>
  );
}
