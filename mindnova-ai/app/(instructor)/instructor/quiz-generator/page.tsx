"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import { Loader } from "@/src/shared/components/ui/Loader";

export default function InstructorQuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [quizToDelete, setQuizToDelete] = useState<QuizSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchQuizzes = () => {
    setLoading(true);
    quizGeneratorApi
      .getQuizzes()
      .then((res) => {
        if (res?.data) {
          setQuizzes(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load quizzes:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await quizGeneratorApi.deleteQuiz(quizToDelete.id);
      // Remove quiz from state immediately without full page reload
      setQuizzes((prev) => prev.filter((item) => item.id !== quizToDelete.id));
      setToastMessage(`Đã xóa thành công bài kiểm tra "${quizToDelete.title}".`);
      setQuizToDelete(null);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Delete quiz error:", err);
      const apiMsg = err.response?.data?.message || err.message;
      if (apiMsg && typeof apiMsg === "string") {
        setDeleteError(apiMsg);
      } else {
        setDeleteError("Không thể xóa đề kiểm tra. Vui lòng thử lại.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 p-6 md:p-8">
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6B6BFF] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
              🪄
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">AI Quiz Generator Module</h1>
              <p className="text-xs text-indigo-200 font-semibold mt-0.5">
                Quản lý và khởi tạo bài kiểm tra độc lập với sự hỗ trợ từ AI
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/instructor/quiz-generator/create"
          className="px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
        >
          <span>⚡ + Tạo bài kiểm tra AI mới</span>
        </Link>
      </div>

      {/* Main Quizzes List Table / Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#1A1A2E]">Danh Sách Bài Kiểm Tra Của Bạn</h2>
          <span className="text-xs font-bold text-gray-500">Tổng số: {quizzes.length} bài</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader size="md" />
            <span className="text-xs font-bold text-gray-500">Đang tải danh sách bài kiểm tra...</span>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-500">
            <span className="text-5xl">📋</span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-extrabold text-[#1A1A2E]">Chưa có đề kiểm tra nào.</p>
              <p className="text-xs font-medium text-gray-500">
                Hãy sử dụng AI Quiz Generator để tạo đề kiểm tra đầu tiên.
              </p>
            </div>
            <Link
              href="/instructor/quiz-generator/create"
              className="mt-2 px-6 py-3 bg-[#4F46E5] text-white text-xs font-black rounded-2xl shadow-md hover:bg-[#4338CA] transition-all"
            >
              + Tạo đề kiểm tra
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-white border border-[#EAEAF4] hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] border border-indigo-100">
                      {q.source_type === "course"
                        ? "📚 Từ khóa học"
                        : q.source_type === "content"
                        ? "📜 Từ tài liệu"
                        : "💡 Từ chủ đề"}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        q.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {q.status === "published" ? "✓ Đã xuất bản" : "✎ Bản nháp"}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1A1A2E] line-clamp-1">{q.title}</h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2">{q.description || "Không có mô tả"}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>❓ {q.questions_count || q.total_questions} câu</span>
                    <span>⏱️ {q.time_limit_minutes}p</span>
                    <span>🎯 {q.total_points} đ</span>
                  </div>

                  {/* Action Buttons: Xem đề & Xóa */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/instructor/quiz-generator/${q.id}`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-[11px] font-extrabold rounded-xl transition-all flex items-center gap-1 border border-indigo-100"
                    >
                      <span>👁</span>
                      <span>Xem đề</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizToDelete(q);
                        setDeleteError(null);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-extrabold rounded-xl transition-all flex items-center gap-1 border border-rose-100 cursor-pointer"
                    >
                      <span>🗑</span>
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {quizToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-xl font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-black text-[#1A1A2E]">Xác nhận xóa đề kiểm tra</h3>
                <p className="text-xs text-gray-500 font-medium">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs flex flex-col gap-1.5">
              <span className="font-extrabold text-[#1A1A2E]">Bạn có chắc muốn xóa đề kiểm tra này?</span>
              <span className="font-bold text-indigo-700">Đề: {quizToDelete.title}</span>
              {quizToDelete.attachments && quizToDelete.attachments.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium">
                  ⚠️ Bài kiểm tra này hiện đang được gắn vào một hoặc nhiều khóa học.
                </span>
              )}
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                ⚠️ {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setQuizToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>⏳ Đang xóa...</span>
                ) : (
                  <>
                    <span>🗑</span>
                    <span>Xóa đề</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
