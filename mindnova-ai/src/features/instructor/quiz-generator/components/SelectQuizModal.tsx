"use client";

import React, { useEffect, useState } from "react";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { QuizSummary } from "../types/quizGenerator.types";

interface SelectQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuiz: (quizDetails: any) => void;
  courseId?: number;
}

export function SelectQuizModal({
  isOpen,
  onClose,
  onSelectQuiz,
  courseId,
}: SelectQuizModalProps) {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingQuizId, setLoadingQuizId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    quizGeneratorApi
      .getQuizzes(courseId)
      .then((res) => {
        if (res?.data) {
          setQuizzes(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load instructor quizzes:", err);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchTerm.trim()) return true;
    return (
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleChoose = async (quiz: QuizSummary) => {
    setLoadingQuizId(quiz.id);
    try {
      const details = await quizGeneratorApi.getQuizById(quiz.id);
      if (details) {
        onSelectQuiz(details);
        onClose();
      }
    } catch (err) {
      console.error("Failed to fetch full quiz details:", err);
      alert("Không thể tải chi tiết bài thi. Vui lòng thử lại.");
    } finally {
      setLoadingQuizId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-50 bg-[#FAF8FF]">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#C0392B] text-white flex items-center justify-center text-lg font-black shadow-xs">
              📥
            </span>
            <div>
              <h3 className="text-sm font-black text-[#1A1A2E]">Chọn Đề Thi từ Ngân Hàng Quiz</h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Nhập bài thi đã tạo từ Bộ tạo bài kiểm tra AI vào bài học này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm đề thi theo tên hoặc mô tả..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#C0392B] focus:bg-white transition-all"
          />
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-full border-3 border-[#C0392B] border-t-transparent animate-spin" />
              <span className="text-xs font-bold text-gray-500">Đang tải danh sách bài thi...</span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-500 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📋</span>
              <p className="text-xs font-bold text-gray-700">Chưa tìm thấy đề thi nào phù hợp</p>
              <p className="text-[11px] text-gray-500">
                Hãy tạo bài thi mới trên giao diện Bộ tạo bài kiểm tra AI hoặc tạo trực tiếp câu hỏi ở đây.
              </p>
            </div>
          ) : (
            filteredQuizzes.map((q) => {
              const isSelectedLoading = loadingQuizId === q.id;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-[#C0392B] bg-white hover:bg-indigo-50/30 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-[#C0392B] border border-indigo-100">
                        Quiz #{q.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {q.questions_count || q.total_questions || 0} câu hỏi
                      </span>
                      <span className="text-[10px] font-medium text-gray-500">
                        ⏱️ {q.time_limit_minutes || 15} phút
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-[#1A1A2E] truncate group-hover:text-[#C0392B] transition-colors">
                      {q.title}
                    </h4>
                    {q.description && (
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                        {q.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSelectedLoading}
                    onClick={() => handleChoose(q)}
                    className="px-4 py-2 bg-[#C0392B] hover:bg-[#a02c20] disabled:bg-gray-300 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isSelectedLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <span>Chọn đề thi này</span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF8FF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
