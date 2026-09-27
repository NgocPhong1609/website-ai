"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { QuizSummary } from "../types/quizGenerator.types";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import {
  AlertTriangle, BookOpen, Bot, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Clock, Eye, Flag, FolderOpen,
  GraduationCap, HelpCircle, Layers, Loader2, PenLine, Search, Sparkles, Target, Trash2, Trophy, Wand2, X,
} from "lucide-react";
import { CreateLessonEditModal } from "@/src/features/instructor/create-course/components/CreateLessonEditModal";
import { QuizThumbnail } from "./QuizThumbnail";

const ITEMS_PER_PAGE = 10;

export function QuizListSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Đang tải danh sách bài kiểm tra" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuizListContainer() {
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
      const apiMsg = getErrorMessage(err, "Không thể cập nhật bài kiểm tra. Vui lòng thử lại.");
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
    const result = quizzes.filter((q) => {
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
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Đóng thông báo"
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-xl bg-white text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Wand2 className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Trợ Lý Tạo Bài Kiểm Tra AI</h1>
                {courseIdNum && (
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                    Course #{courseIdNum}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Quản lý và tổng hợp tất cả các bài kiểm tra trắc nghiệm &amp; tự luận của bạn
              </p>
            </div>
          </div>

          {courseIdNum && (
            <div className="mt-2 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                <span>Khóa học: {courseTitle || `ID #${courseIdNum}`}</span>
              </span>
              <Link
                href="/instructor/quiz-generator"
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Hủy lọc
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={createAiUrl}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors text-center flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Tạo bằng AI</span>
          </Link>
          <Link
            href={createManualUrl}
            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg shadow-sm transition-colors text-center flex items-center justify-center gap-2 border border-slate-200"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            <span>Tạo thủ công</span>
          </Link>
        </div>
      </div>

      {/* Filter Controls & Search Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" aria-hidden />
            <span>Danh Sách Tất Cả Bài Kiểm Tra Của Bạn</span>
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
              Tổng số: {quizzes.length} bài
            </span>
            {hasActiveFilters && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                Hiển thị: {filteredQuizzes.length} bài
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên Quiz, Khóa học..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Position / Scope Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm truncate"
          >
            <option value="all">Tất cả Vị trí Quiz</option>
            <option value="capability_assessment">Kiểm tra tổng quát</option>
            <option value="end_of_course">Cuối khóa học</option>
            <option value="in_module">Trong Module</option>
            <option value="after_lesson">Sau bài học</option>
          </select>

          {/* Source Type Filter (AI vs Manual) */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="all">Tất cả nguồn (AI / Manual)</option>
            <option value="ai">AI Quiz</option>
            <option value="manual">Manual Quiz</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setModuleFilter("all");
            }}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm truncate"
          >
            <option value="all">Tất cả khóa học</option>
            {coursesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
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
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}

        {/* Quizzes Grid List */}
        {loading ? (
          <QuizListSkeleton />
        ) : quizzes.length === 0 ? (
          /* Empty State 1: Instructor has 0 quizzes total */
          <div className="py-16 text-center rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-500">
            <span className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
              <ClipboardList className="h-7 w-7" aria-hidden />
            </span>
            <div className="flex flex-col gap-1 max-w-md">
              <p className="text-sm font-semibold text-slate-900">Chưa có đề kiểm tra nào.</p>
              <p className="text-xs font-medium text-slate-500">
                Hãy sử dụng bộ tạo bài kiểm tra AI hoặc tạo thủ công để xây dựng bộ đề đầu tiên cho học viên.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link
                href={createAiUrl}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                <span>Tạo Quiz bằng AI</span>
              </Link>
              <Link
                href={createManualUrl}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-2"
              >
                <PenLine className="h-4 w-4" aria-hidden />
                <span>Tạo Quiz thủ công</span>
              </Link>
            </div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          /* Empty State 2: Active filters returned 0 results */
          <div className="py-16 text-center rounded-xl bg-amber-50/50 border border-amber-200 flex flex-col items-center justify-center gap-3 text-amber-900">
            <Search className="h-8 w-8 text-amber-500" aria-hidden />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Không tìm thấy Quiz nào phù hợp với bộ lọc.</p>
              <p className="text-xs font-medium text-amber-700">
                Vui lòng điều chỉnh hoặc xóa bộ lọc tìm kiếm để xem các đề kiểm tra khác.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Xóa bộ lọc tìm kiếm
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
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group"
                  >
                    <QuizThumbnail title={q.title} src={q.thumbnail_url} />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch">
                      <div className="flex flex-col gap-3">
                      {/* Badges Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Position Badge */}
                        <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 bg-amber-50 text-amber-950 border-amber-200">
                          {qPos === "capability_assessment" || q.type === "capability_assessment" ? (
                            <><Trophy className="h-3 w-3" aria-hidden /><span>Kiểm tra tổng quát</span></>
                          ) : qPos === "end_of_course" ? (
                            <><Flag className="h-3 w-3" aria-hidden /><span>Cuối khóa học</span></>
                          ) : qPos === "in_module" ? (
                            <><Layers className="h-3 w-3" aria-hidden /><span>Trong Module</span></>
                          ) : (
                            <><BookOpen className="h-3 w-3" aria-hidden /><span>Sau bài học</span></>
                          )}
                        </span>

                        {/* Source Type Badge */}
                        <span
                          className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            isManual
                              ? "bg-sky-50 text-sky-800 border-sky-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {isManual ? <PenLine className="h-3 w-3" aria-hidden /> : <Bot className="h-3 w-3" aria-hidden />}
                          <span>{isManual ? "Manual Quiz" : "AI Quiz"}</span>
                        </span>

                        {/* Active Badge */}
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" aria-hidden />
                            Đang sử dụng
                          </span>
                        )}

                        {attachedCourseTitle && (
                          <span
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1 truncate max-w-[180px]"
                            title={`Khóa học: ${attachedCourseTitle}`}
                          >
                            <GraduationCap className="h-3 w-3 shrink-0" aria-hidden />
                            <span className="truncate">{attachedCourseTitle}</span>
                          </span>
                        )}
                      </div>

                      {/* Quiz Title & Module info */}
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {q.title}
                        </h3>
                        {attachedModuleTitle && (
                          <p className="text-[11px] font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                            <FolderOpen className="h-3 w-3 shrink-0" aria-hidden />
                            <span>Module:</span>
                            <span className="truncate">{attachedModuleTitle}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                          {q.description || "Không có mô tả chi tiết."}
                        </p>
                      </div>
                      </div>

                    {/* Metadata Specs & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                      <div className="flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" aria-hidden />{q.questions_count || q.total_questions || 0} câu</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{q.time_limit_minutes || 15}p</span>
                        <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" aria-hidden />{q.passing_score || 70}%</span>
                      </div>

                      {/* Action Buttons: Xem & Sửa (Modal reuse) & Xóa */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingQuiz(q)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg transition-colors border border-blue-100 flex items-center gap-1 cursor-pointer"
                          title="Xem & Chỉnh sửa Quiz"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          <span>Xem &amp; Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setQuizToDelete(q);
                            setDeleteError(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                          title="Xóa đề kiểm tra"
                          aria-label="Xóa đề kiểm tra"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar */}
            {filteredQuizzes.length > 0 && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2">
                <span className="text-xs font-bold text-slate-500">
                  Hiển thị {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredQuizzes.length)} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredQuizzes.length)} trên tổng số {filteredQuizzes.length} bài kiểm tra
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4 inline -mt-0.5" aria-hidden /> Trang trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
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
                    className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  >
                    Trang sau <ChevronRight className="h-4 w-4 inline -mt-0.5" aria-hidden />
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
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-5">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận xóa đề kiểm tra</h3>
                <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1.5">
              <span className="font-semibold text-slate-900">Bạn có chắc muốn xóa đề kiểm tra này?</span>
              <span className="font-bold text-blue-500">Đề: {quizToDelete.title}</span>
              {quizToDelete.attachments && quizToDelete.attachments.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Bài kiểm tra này hiện đang được gắn vào một hoặc nhiều khóa học.
                </span>
              )}
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-2">
                <div className="flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" aria-hidden /><span>{deleteError}</span></div>
                {deleteError.includes("gắn vào khóa học") && (
                  <button
                    type="button"
                    onClick={() => handleDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="mt-2 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    <span>Gỡ khỏi khóa học &amp; Xóa ngay</span>
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
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm()}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" aria-hidden />
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
