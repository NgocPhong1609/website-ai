"use client";

import React, { useEffect } from "react";
import { QuizGeneratorWizard } from "@/src/features/instructor/quiz-generator/components/QuizGeneratorWizard";

interface CourseAiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  moduleId?: string;
  onSuccessComplete: (savedQuiz?: any) => void;
}

export function CourseAiQuizModal({
  isOpen,
  onClose,
  courseId,
  moduleId,
  onSuccessComplete,
}: CourseAiQuizModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden my-8 border border-gray-200 max-h-[92vh] flex flex-col">
        {/* Modal Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C0392B] to-[#F368E0] text-white flex items-center justify-center text-lg font-black shadow-sm">
              🤖
            </div>
            <div>
              <h3 className="text-base font-black text-[#1A1A2E]">Tạo Bài Kiểm Tra AI Cho Chuyên Đề</h3>
              <p className="text-xs font-semibold text-gray-500">
                Tự động sinh câu hỏi và thêm thẳng vào chuyên đề của khóa học hiện tại
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
            title="Đóng modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Wizard Container */}
        <div className="flex-1 overflow-y-auto p-2">
          <QuizGeneratorWizard
            onSuccessComplete={onSuccessComplete}
            initialCourseId={courseId ? Number(courseId) : undefined}
            initialModuleId={moduleId ? Number(moduleId) : undefined}
            embeddedMode={true}
          />
        </div>
      </div>
    </div>
  );
}
