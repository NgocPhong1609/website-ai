"use client";

import React, { useState } from "react";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";

interface SelectCourseLevelQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: "capability_assessment" | "end_of_course";
  positionTitle: string;
  quizzes: QuizSummary[];
  activeQuizId?: number | null;
  onSelectActiveQuiz: (quizId: number, position: string) => Promise<void>;
  onCreateNewQuiz: () => void;
  onEditQuiz: (quiz: QuizSummary) => void;
  onDetachQuiz: (quizId: number) => void;
}

export function SelectCourseLevelQuizModal({
  isOpen,
  onClose,
  position,
  positionTitle,
  quizzes,
  activeQuizId,
  onSelectActiveQuiz,
  onCreateNewQuiz,
  onEditQuiz,
  onDetachQuiz,
}: SelectCourseLevelQuizModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingQuizId, setLoadingQuizId] = useState<number | null>(null);

  if (!isOpen) return null;

  const isGeneral = position === "capability_assessment";
  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      q.title.toLowerCase().includes(term) ||
      (q.description && q.description.toLowerCase().includes(term))
    );
  });

  const handleSelect = async (quizId: number) => {
    setLoadingQuizId(quizId);
    try {
      await onSelectActiveQuiz(quizId, position);
      onClose();
    } catch (err) {
      console.error("Lỗi chọn bài thi chính:", err);
    } finally {
      setLoadingQuizId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-indigo-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-50 bg-[#FAF8FF] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-xs">
              {isGeneral ? "🏆" : "🏁"}
            </span>
            <div>
              <h3 className="text-base font-black text-[#1A1A2E]">
                Chọn Bài Thi: {positionTitle}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Chọn bài kiểm tra chính sẽ được sử dụng cho học viên trong khóa học
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Search Toolbar & Create New Action */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bài kiểm tra theo tên..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateNewQuiz();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>+ Tạo bài thi mới</span>
          </button>
        </div>

        {/* List of Quizzes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredQuizzes.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-gray-500 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📋</span>
              <p className="text-xs font-bold text-gray-700">Chưa có bài thi nào khả dụng trong danh sách</p>
              <p className="text-[11px] text-gray-500 max-w-sm">
                Hãy bấm nút <b>+ Tạo bài thi mới</b> để soạn bài thi bằng AI hoặc biên soạn thủ công.
              </p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const isActive = Boolean(
                quiz.id === activeQuizId ||
                quiz.is_active ||
                (quiz.attachments && quiz.attachments.some((att: any) => att.position === position && att.is_active))
              );
              const isLoadingThis = loadingQuizId === quiz.id;

              return (
                <div
                  key={quiz.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/40 shadow-2xs"
                      : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20"
                  }`}
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-black text-[#1A1A2E] truncate">
                        {quiz.title}
                      </span>
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase shadow-2xs flex items-center gap-1">
                          <span>✓</span>
                          <span>ĐANG SỬ DỤNG</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
                          Chưa chọn
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 mt-0.5">
                      <span>❓ {quiz.total_questions || quiz.questions_count || 0} câu</span>
                      <span>⏱️ {quiz.time_limit_minutes || 15} phút</span>
                      <span>🎯 {quiz.passing_score || 70}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditQuiz(quiz);
                      }}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-extrabold rounded-xl border border-indigo-200 transition-all cursor-pointer"
                      title="Xem và chỉnh sửa bài thi"
                    >
                      👁 Xem
                    </button>

                    {isActive ? (
                      <span className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300">
                        Đang làm bài chính
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleSelect(quiz.id)}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isLoadingThis ? (
                          <span>⏳ Đang xử lý...</span>
                        ) : (
                          <span>✓ Chọn bài này</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF8FF] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
