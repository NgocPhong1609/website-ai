"use client";

import React, { useState } from "react";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import { Check, ClipboardList, Eye, FileQuestion, Flag, Search, Target, Timer, Trophy, X, Loader2 } from "lucide-react";

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
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm">
              {isGeneral ? <Trophy className="h-5 w-5 text-amber-600" aria-hidden /> : <Flag className="h-5 w-5 text-blue-600" aria-hidden />}
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Chọn Bài Thi: {positionTitle}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Chọn bài kiểm tra chính sẽ được sử dụng cho học viên trong khóa học
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Search Toolbar & Create New Action */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bài kiểm tra theo tên..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateNewQuiz();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>+ Tạo bài thi mới</span>
          </button>
        </div>

        {/* List of Quizzes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredQuizzes.length === 0 ? (
            <div className="py-12 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-500 flex flex-col items-center justify-center gap-2">
              <ClipboardList className="h-8 w-8 text-slate-400" aria-hidden />
              <p className="text-sm font-semibold text-slate-700">Chưa có bài thi nào khả dụng trong danh sách</p>
              <p className="text-xs text-slate-500 max-w-sm">
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
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/20"
                  }`}
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {quiz.title}
                      </span>
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" aria-hidden />
                          <span>Đang dùng</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-xs font-medium border border-slate-200">
                          Chưa chọn
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 mt-0.5">
                      <span className="inline-flex items-center gap-1"><FileQuestion className="h-3 w-3" aria-hidden /> {quiz.total_questions || quiz.questions_count || 0} câu</span>
                      <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" aria-hidden /> {quiz.time_limit_minutes || 15} phút</span>
                      <span className="inline-flex items-center gap-1"><Target className="h-3 w-3" aria-hidden /> {quiz.passing_score || 70}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditQuiz(quiz);
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold rounded-lg border border-blue-200 transition-all cursor-pointer"
                      title="Xem và chỉnh sửa bài thi"
                    >
                      <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" aria-hidden /> Xem</span>
                    </button>

                    {isActive ? (
                      <span className="px-4 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300">
                        Đang làm bài chính
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleSelect(quiz.id)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isLoadingThis ? (
                          <span><Loader2 className="inline h-4 w-4 mr-1 align-text-bottom animate-spin" aria-hidden />Đang xử lý...</span>
                        ) : (
                          <span><Check className="inline h-4 w-4 mr-1 align-text-bottom" aria-hidden />Chọn bài này</span>
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
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
