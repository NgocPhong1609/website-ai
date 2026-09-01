"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";
import { QuizSummary } from "@/src/features/instructor/quiz-generator/types/quizGenerator.types";
import { Loader } from "@/src/shared/components/ui/Loader";
import { CreateLessonEditModal } from "@/src/features/instructor/create-course/components/CreateLessonEditModal";

const ITEMS_PER_PAGE = 10;

export default function InstructorQuizListPage() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams ? (searchParams.get("course_id") || searchParams.get("courseId")) : null;
  const courseIdNum = courseIdParam ? Number(courseIdParam) : undefined;

  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [courseModulesList, setCourseModulesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "ai" | "manual">("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>(courseIdParam ? String(courseIdParam) : "all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title_asc" | "title_desc">("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Quiz Editing Modal State (reusing CreateLessonEditModal / QuizEditor)
  const [editingQuiz, setEditingQuiz] = useState<QuizSummary | null>(null);

  // Deletion modal state
  const [quizToDelete, setQuizToDelete] = useState<QuizSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch all quizzes and instructor's courses
  const fetchQuizzes = (cId?: number) => {
    setLoading(true);
    quizGeneratorApi
      .getQuizzes(cId)
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
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

    // Load instructor courses list for filter dropdown
    quizGeneratorApi
      .getInstructorCourses()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setCoursesList(res.data);
        }
      })
      .catch(() => {});

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

  // Reset pagination to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, positionFilter, courseFilter, moduleFilter, statusFilter, sortBy]);

  // Load modules list whenever courseFilter changes
  useEffect(() => {
    if (courseFilter !== "all") {
      quizGeneratorApi
        .getCourseDetails(Number(courseFilter))
        .then((res) => {
          const detail = res?.data || res;
          const mods = detail?.modules || detail?.items || [];
          setCourseModulesList(Array.isArray(mods) ? mods : []);
        })
        .catch(() => setCourseModulesList([]));
    } else {
      setCourseModulesList([]);
      setModuleFilter("all");
    }
  }, [courseFilter]);

  const handleDeleteConfirm = async (force: boolean = false) => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await quizGeneratorApi.deleteQuiz(quizToDelete.id, force);
      setQuizzes((prev) => prev.filter((item) => item.id !== quizToDelete.id));
      setToastMessage(`Đã xóa thành công bài kiểm tra "${quizToDelete.title}".`);
      setQuizToDelete(null);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error("Delete quiz error:", err);
      const apiMsg = err.response?.data?.message || err.message;
      setDeleteError(typeof apiMsg === "string" ? apiMsg : "Không thể xóa đề kiểm tra. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAttachedCourseTitle = (q: QuizSummary): string | null => {
    if (q.course?.title) return q.course.title;
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

  const getAttachedModuleTitle = (q: QuizSummary): string | null => {
    if (q.module?.title) return q.module.title;
    if (Array.isArray(q.attachments) && q.attachments.length > 0) {
      const title = q.attachments[0]?.module?.title;
      if (title) return title;
    }
    if ((q as any).lesson?.module?.title) {
      return (q as any).lesson.module.title;
    }
    return null;
  };

  // Filter & Sort Logic
  const filteredQuizzes = useMemo(() => {
    let result = quizzes.filter((q) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase().trim();
        const titleMatch = q.title?.toLowerCase().includes(term);
        const descMatch = q.description?.toLowerCase().includes(term);
        const courseMatch = getAttachedCourseTitle(q)?.toLowerCase().includes(term);
        const moduleMatch = getAttachedModuleTitle(q)?.toLowerCase().includes(term);
        if (!titleMatch && !descMatch && !courseMatch && !moduleMatch) return false;
      }

      // 2. Source Type Filter (AI vs Manual)
      if (typeFilter === "ai") {
        if (q.source_type === "manual") return false;
      } else if (typeFilter === "manual") {
        if (q.source_type !== "manual") return false;
      }

      // 3. Quiz Position Scope Filter (General, Final, Module, After Lesson)
      if (positionFilter !== "all") {
        const qPos = (q as any).position || q.attachments?.[0]?.position || (q.type === "capability_assessment" ? "capability_assessment" : "end_of_course");
        if (positionFilter === "capability_assessment" && qPos !== "capability_assessment" && q.type !== "capability_assessment") return false;
        if (positionFilter === "end_of_course" && qPos !== "end_of_course") return false;
        if (positionFilter === "in_module" && qPos !== "in_module") return false;
        if (positionFilter === "after_lesson" && qPos !== "after_lesson") return false;
      }

      // 4. Course Filter
      if (courseFilter !== "all") {
        const targetCourseId = Number(courseFilter);
        const qCourseId = q.course?.id || q.course_id || q.attachments?.[0]?.course_id || (q as any).lesson?.module?.course_id;
        if (Number(qCourseId) !== targetCourseId) return false;
      }

      // 5. Module Filter
      if (moduleFilter !== "all") {
        const targetModuleId = Number(moduleFilter);
        const qModuleId = q.module?.id || q.attachments?.[0]?.module_id || (q as any).lesson?.module_id;
        if (Number(qModuleId) !== targetModuleId) return false;
      }

      // 6. Status Filter
      if (statusFilter !== "all") {
        if (q.status !== statusFilter) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      // newest
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return result;
  }, [quizzes, searchQuery, typeFilter, positionFilter, courseFilter, moduleFilter, statusFilter, sortBy]);

  // Paginated Quiz Items (10 items per page)
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredQuizzes, currentPage]);

  const hasActiveFilters = searchQuery.trim() !== "" || typeFilter !== "all" || positionFilter !== "all" || courseFilter !== "all" || moduleFilter !== "all" || statusFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setPositionFilter("all");
    setCourseFilter("all");
    setModuleFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const createAiUrl = courseIdNum
    ? `/instructor/quiz-generator/create?course_id=${courseIdNum}`
    : "/instructor/quiz-generator/create";

  const createManualUrl = courseIdNum
    ? `/instructor/quiz-generator/manual-create?course_id=${courseIdNum}`
    : "/instructor/quiz-generator/manual-create";

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 p-6 md:p-8 animate-fadeIn">
      {/* Toast Notification */}
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
                Quản lý và tổng hợp tất cả các bài kiểm tra trắc nghiệm &amp; tự luận của bạn
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

      {/* Filter Controls & Search Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-base font-black text-[#1A1A2E] flex items-center gap-2">
            <span>📋</span>
            <span>Danh Sách Tất Cả Bài Kiểm Tra Của Bạn</span>
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-[#C0392B] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl">
              Tổng số: {quizzes.length} bài
            </span>
            {hasActiveFilters && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                Hiển thị: {filteredQuizzes.length} bài
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên Quiz, Khóa học..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] transition-all"
            />
          </div>

          {/* Position / Scope Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-2xs truncate"
          >
            <option value="all">Tất cả Vị trí Quiz</option>
            <option value="capability_assessment">🏆 Kiểm tra tổng quát</option>
            <option value="end_of_course">🏁 Cuối khóa học</option>
            <option value="in_module">📦 Trong Module</option>
            <option value="after_lesson">📖 Sau bài học</option>
          </select>

          {/* Source Type Filter (AI vs Manual) */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-2xs"
          >
            <option value="all">Tất cả nguồn (AI / Manual)</option>
            <option value="ai">🤖 AI Quiz</option>
            <option value="manual">✍️ Manual Quiz</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setModuleFilter("all");
            }}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-2xs truncate"
          >
            <option value="all">Tất cả khóa học</option>
            {coursesList.map((c) => (
              <option key={c.id} value={c.id}>
                📚 {c.title}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-2xs"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="title_asc">Tên A → Z</option>
            <option value="title_desc">Tên Z → A</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>✕ Xóa bộ lọc</span>
            </button>
          </div>
        )}

        {/* Quizzes Grid List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader size="md" />
            <span className="text-xs font-bold text-gray-500">Đang tải danh sách bài kiểm tra...</span>
          </div>
        ) : quizzes.length === 0 ? (
          /* Empty State 1: Instructor has 0 quizzes total */
          <div className="py-16 text-center rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-500">
            <span className="text-5xl">📋</span>
            <div className="flex flex-col gap-1 max-w-md">
              <p className="text-sm font-extrabold text-[#1A1A2E]">Chưa có đề kiểm tra nào.</p>
              <p className="text-xs font-medium text-gray-500">
                Hãy sử dụng AI Quiz Generator hoặc tạo thủ công để xây dựng bộ đề đầu tiên cho sinh viên.
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
        ) : filteredQuizzes.length === 0 ? (
          /* Empty State 2: Active filters returned 0 results */
          <div className="py-16 text-center rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col items-center justify-center gap-3 text-amber-900">
            <span className="text-4xl">🔍</span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-extrabold">Không tìm thấy Quiz nào phù hợp với bộ lọc.</p>
              <p className="text-xs font-medium text-amber-700">
                Vui lòng điều chỉnh hoặc xóa bộ lọc tìm kiếm để xem các đề kiểm tra khác.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              ✕ Xóa bộ lọc tìm kiếm
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedQuizzes.map((q) => {
                const attachedCourseTitle = getAttachedCourseTitle(q);
                const attachedModuleTitle = getAttachedModuleTitle(q);
                const isManual = q.source_type === "manual";
                const qPos = (q as any).position || q.attachments?.[0]?.position || (q.type === "capability_assessment" ? "capability_assessment" : "end_of_course");
                const isActive = (q as any).is_active || q.attachments?.[0]?.is_active;

                return (
                  <div
                    key={q.id}
                    className="p-6 rounded-2xl bg-white border border-[#EAEAF4] hover:border-emerald-500/50 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Badges Row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Position Badge */}
                        <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 bg-amber-50 text-amber-950 border-amber-200">
                          {qPos === "capability_assessment" || q.type === "capability_assessment" ? (
                            <><span>🏆</span><span>Kiểm tra tổng quát</span></>
                          ) : qPos === "end_of_course" ? (
                            <><span>🏁</span><span>Cuối khóa học</span></>
                          ) : qPos === "in_module" ? (
                            <><span>📦</span><span>Trong Module</span></>
                          ) : (
                            <><span>📖</span><span>Sau bài học</span></>
                          )}
                        </span>

                        {/* Source Type Badge */}
                        <span
                          className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            isManual
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          <span>{isManual ? "✍️" : "🤖"}</span>
                          <span>{isManual ? "Manual Quiz" : "AI Quiz"}</span>
                        </span>

                        {/* Active Badge */}
                        {isActive && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
                            ✓ Đang sử dụng
                          </span>
                        )}

                        {attachedCourseTitle && (
                          <span
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center gap-1 truncate max-w-[180px]"
                            title={`Khóa học: ${attachedCourseTitle}`}
                          >
                            <span>🎓</span>
                            <span className="truncate">{attachedCourseTitle}</span>
                          </span>
                        )}
                      </div>

                      {/* Quiz Title & Module info */}
                      <div>
                        <h3 className="text-base font-extrabold text-[#1A1A2E] group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {q.title}
                        </h3>
                        {attachedModuleTitle && (
                          <p className="text-[11px] font-bold text-indigo-600 mt-0.5 flex items-center gap-1">
                            <span>📂 Module:</span>
                            <span className="truncate">{attachedModuleTitle}</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1">
                          {q.description || "Không có mô tả chi tiết."}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Specs & Action Buttons */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>❓ {q.questions_count || q.total_questions || 0} câu</span>
                        <span>⏱️ {q.time_limit_minutes || 15}p</span>
                        <span>🎯 {q.passing_score || 70}%</span>
                      </div>

                      {/* Action Buttons: 👁 Xem & Sửa (Modal reuse) & 🗑 Xóa */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingQuiz(q)}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-black rounded-xl transition-all border border-emerald-300 flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Xem & Chỉnh sửa Quiz"
                        >
                          <span>👁 Xem &amp; Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setQuizToDelete(q);
                            setDeleteError(null);
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                          title="Xóa đề kiểm tra"
                        >
                          <span className="text-sm">🗑</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar */}
            {filteredQuizzes.length > 0 && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5 mt-2">
                <span className="text-xs font-bold text-gray-500">
                  Hiển thị {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredQuizzes.length)} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuizzes.length)} trên tổng số {filteredQuizzes.length} bài kiểm tra
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  >
                    ⬅️ Trang trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#C0392B] text-white shadow-xs"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  >
                    Trang sau ➡️
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Embedded Quiz Editor Modal Reuse */}
      {editingQuiz && (
        <CreateLessonEditModal
          lesson={{
            id: `quiz-${editingQuiz.id}`,
            quiz_id: editingQuiz.id,
            title: editingQuiz.title,
            type: "quiz",
          } as any}
          courseId={editingQuiz.course?.id ? String(editingQuiz.course.id) : undefined}
          onSave={async () => {
            setEditingQuiz(null);
            fetchQuizzes(courseIdNum);
          }}
          onClose={() => setEditingQuiz(null)}
        />
      )}

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
