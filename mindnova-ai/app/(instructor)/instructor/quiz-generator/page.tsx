"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import { Loader } from "@/src/shared/components/ui/Loader";

export default function InstructorQuizListPage() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams ? (searchParams.get("course_id") || searchParams.get("courseId")) : null;
  const courseIdNum = courseIdParam ? Number(courseIdParam) : undefined;

  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);

  // Deletion modal state
  const [quizToDelete, setQuizToDelete] = useState<QuizSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchQuizzes = (cId?: number) => {
    setLoading(true);
    quizGeneratorApi
      .getQuizzes(cId)
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
    fetchQuizzes(courseIdNum);

    if (courseIdNum) {
      quizGeneratorApi
        .getCourseDetails(courseIdNum)
        .then((res) => {
          const detail = res?.data || res;
          if (detail?.title) {
            setCourseTitle(detail.title);
          }
        })
        .catch(() => setCourseTitle(null));
    } else {
      setCourseTitle(null);
    }
  }, [courseIdNum]);

  const handleDeleteConfirm = async (force: boolean = false) => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await quizGeneratorApi.deleteQuiz(quizToDelete.id, force);
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

  const getAttachedCourseTitle = (q: QuizSummary): string | null => {
    if (Array.isArray(q.attachments) && q.attachments.length > 0) {
      const title = q.attachments[0]?.course?.title;
      if (title) return title;
    }
    if ((q as any).lesson?.module?.course?.title) {
      return (q as any).lesson.module.course.title;
    }
    if ((q as any).lesson?.course?.title) {
      return (q as any).lesson.course.title;
    }
    return null;
  };

  const createAiUrl = courseIdNum
    ? `/instructor/quiz-generator/create?course_id=${courseIdNum}`
    : "/instructor/quiz-generator/create";

  const createManualUrl = courseIdNum
    ? `/instructor/quiz-generator/manual-create?course_id=${courseIdNum}`
    : "/instructor/quiz-generator/manual-create";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 p-6 md:p-8">
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1E233E] via-[#2B2D62] to-[#121626] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C0392B] to-[#F368E0] flex items-center justify-center text-2xl font-black shadow-md">
              🪄
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">AI Quiz Generator Module</h1>
                {courseIdNum && (
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-mono font-black">
                    Course #{courseIdNum}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 font-semibold mt-0.5">
                {courseTitle
                  ? `Đang lọc danh sách bài kiểm tra dành riêng cho khóa học: ${courseTitle}`
                  : "Quản lý và khởi tạo bài kiểm tra độc lập với sự hỗ trợ từ AI"}
              </p>
            </div>
          </div>

          {courseIdNum && (
            <div className="mt-2 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-100 text-xs font-extrabold border border-indigo-400/30 flex items-center gap-1.5">
                <span>🎓</span>
                <span>Khóa học: {courseTitle || `ID #${courseIdNum}`}</span>
              </span>
              <Link
                href="/instructor/quiz-generator"
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 transition-all"
              >
                ✕ Hủy lọc
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={createAiUrl}
            className="px-6 py-3.5 bg-[#C0392B] hover:bg-[#a02c20] text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>✨ Tạo bằng AI</span>
          </Link>
          <Link
            href={createManualUrl}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2 border border-white/20"
          >
            <span>📝 Tạo thủ công</span>
          </Link>
        </div>
      </div>

      {/* Main Quizzes List Table / Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#1A1A2E]">
            {courseIdNum
              ? `Danh Sách Đề Kiểm Tra Thuộc Khóa Học ${courseTitle ? `"${courseTitle}"` : `#${courseIdNum}`}`
              : "Danh Sách Tất Cả Bài Kiểm Tra Của Bạn"}
          </h2>
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
              <p className="text-sm font-extrabold text-[#1A1A2E]">
                {courseIdNum
                  ? `Khóa học ${courseTitle ? `"${courseTitle}"` : `#${courseIdNum}`} chưa có đề kiểm tra nào.`
                  : "Chưa có đề kiểm tra nào."}
              </p>
              <p className="text-xs font-medium text-gray-500">
                Hãy sử dụng AI Quiz Generator để tạo đề kiểm tra đầu tiên cho khóa học này.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link
                href={createAiUrl}
                className="px-6 py-3 bg-[#C0392B] hover:bg-[#a02c20] text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <span>✨ Tạo Quiz bằng AI</span>
              </Link>
              <Link
                href={createManualUrl}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold rounded-2xl transition-all flex items-center gap-2"
              >
                <span>✍️ Tạo Quiz thủ công</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q) => {
              const attachedTitle = getAttachedCourseTitle(q);
              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-white border border-[#EAEAF4] hover:border-[#C0392B] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-indigo-50 text-[#C0392B] border border-indigo-100">
                        {q.source_type === "course"
                          ? "Từ khóa học"
                          : q.source_type === "content"
                          ? "Từ tài liệu"
                          : "Từ chủ đề"}
                      </span>

                      {attachedTitle ? (
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 line-clamp-1 max-w-[220px]"
                          title={`Gắn vào khóa học: ${attachedTitle}`}
                        >
                          <span>🎓</span>
                          <span className="truncate">
                            Khóa: <strong className="font-extrabold">{attachedTitle}</strong>
                          </span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-1">
                          <span>📌</span>
                          <span>Chưa gắn</span>
                        </span>
                      )}

                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                          q.status === "published"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {q.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1A1A2E] line-clamp-1">{q.title}</h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2">{q.description || "Không có mô tả"}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>❓ {q.questions_count || q.total_questions} câu</span>
                      <span>⏱️ {q.time_limit_minutes}p</span>
                      <span>🎯 {q.total_points || 100} đ</span>
                    </div>

                    {/* Action Buttons: Xem đề & Xóa */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/instructor/quiz-generator/${q.id}`}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#C0392B] text-[11px] font-extrabold rounded-xl transition-all flex items-center gap-1 border border-indigo-100"
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
              );
            })}
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
              <span className="font-bold text-[#C0392B]">Đề: {quizToDelete.title}</span>
              {quizToDelete.attachments && quizToDelete.attachments.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium">
                  ⚠️ Bài kiểm tra này hiện đang được gắn vào một hoặc nhiều khóa học.
                </span>
              )}
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-2">
                <div>⚠️ {deleteError}</div>
                {deleteError.includes("gắn vào khóa học") && (
                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="mt-2 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🗑 Gỡ khỏi khóa học &amp; Xóa ngay</span>
                  </button>
                )}
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
                onClick={() => handleDeleteConfirm()}
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
