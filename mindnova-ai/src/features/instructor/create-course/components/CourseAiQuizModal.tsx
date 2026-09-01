"use client";

import React, { useEffect } from "react";
import { QuizGeneratorWizard } from "@/src/features/instructor/quiz-generator/components/QuizGeneratorWizard";

interface CourseAiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  moduleId?: string;
  position?: "capability_assessment" | "end_of_course";
  onSuccessComplete: (savedQuiz?: any) => void;
}

export function CourseAiQuizModal({
  isOpen,
  onClose,
  courseId,
  moduleId,
  position,
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

  const isGeneral = position === "capability_assessment";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn [font-family:var(--font-admin-body)]">
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm ${
              isGeneral ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"
            }`}>
              {position ? (isGeneral ? "🏆" : "🏁") : "🤖"}
            </div>
            <div>
              <h3 className="text-base font-black truncate">
                {position
                  ? isGeneral
                    ? "TẠO BÀI KIỂM TRA TỔNG QUÁT TỰ ĐỘNG BẰNG AI"
                    : "TẠO BÀI KIỂM TRA CUỐI KHÓA HỌC TỰ ĐỘNG BẰNG AI"
                  : "TẠO BÀI KIỂM TRA AI CHO CHUYÊN ĐỀ"}
              </h3>
              <p className="text-xs font-semibold text-slate-300">
                {position
                  ? "AI tự động đọc tất cả bài học trong khóa học để sinh câu hỏi & đính kèm trực tiếp"
                  : "Tự động sinh câu hỏi từ nội dung chuyên đề"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
            title="Đóng modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Full Quiz Generator Wizard */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <QuizGeneratorWizard
            key={`${courseId}-${position || moduleId}`}
            onSuccessComplete={onSuccessComplete}
            initialCourseId={courseId ? Number(courseId) : undefined}
            initialModuleId={moduleId ? Number(moduleId) : undefined}
            initialPosition={position}
            embeddedMode={true}
          />
        </div>
      </div>
    </div>
  );
}
