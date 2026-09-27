"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { CheckCircle2, MessageSquare, Eye, GraduationCap, X, Check, Lock, ChevronsUpDown, ArrowLeft, ChevronRight, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Skeleton, SkeletonList } from "@/src/shared/components/ui/Skeleton";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { LessonStatusIcon, lessonDisplayTitle } from "../LessonStatusIcon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCourseDetail, useGetInstructorCoursePreview, useInvalidateCourseDetail, completeLesson, startLesson, useGetDiscussions, useCreateDiscussion, useUpdateDiscussion, useDeleteDiscussion } from "../../api";
import type { CourseDetailData } from "../../types";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import { NoDataAvailable } from "@/src/shared/components/ui";
import toast from "react-hot-toast";
import type { LessonData, ModuleData } from "./types";
import { getLessonTypeLabel, getLessonTypeColor } from "./lessonTypeLabels";
import { ArticleRenderer } from "./ArticleRenderer";
import { QuizRenderer } from "./QuizRenderer";

export type { LessonData } from "./types";

// ─── Inner Workspace Content ─────────────────────────────────────────────────
function LessonWorkspaceContent() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams ? (searchParams.get("courseId") || searchParams.get("course_id")) : null;
  const initialLessonParam = searchParams ? (searchParams.get("lessonId") || searchParams.get("lesson_id")) : null;
  const isPreview = searchParams ? searchParams.get("preview") === "true" : false;

  const parsedCourseId = courseIdParam ? Number(courseIdParam) : 0;
  const studentDetail = useGetCourseDetail(parsedCourseId, !isPreview);
  const previewDetail = useGetInstructorCoursePreview(parsedCourseId, isPreview);
  const apiDetail = studentDetail.data;
  const { isLoading, error } = isPreview ? previewDetail : studentDetail;
  const invalidateCourseDetail = useInvalidateCourseDetail();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (error && (error as any).response?.status === 403 && !isPreview) {
      window.location.href = `/courses/detail?courseId=${parsedCourseId}`;
    }
  }, [error, parsedCourseId, isPreview]);

  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Compute curriculum directly from API response or instructor preview fallback
  const curriculum: ModuleData[] = React.useMemo(() => {
    const modulesSource = isPreview ? previewDetail.data?.modules : apiDetail?.modules;
    if (!modulesSource || !Array.isArray(modulesSource)) return [];

    return modulesSource.map((mod: any) => ({
      id: String(mod.id),
      title: mod.title,
      subtitle: mod.duration || "",
      lessons: (mod.lessons || []).map((l: any) => ({
        id: String(l.id),
        title: l.title,
        type: l.type || 'video',
        duration: l.duration || "05:00",
        durationSeconds: l.duration_seconds || 300,
        completed: l.status === "completed",
        videoUrl: l.video_url || l.videoUrl || "",
        hasUploadedVideo: Boolean(l.has_uploaded_video || l.video_url || l.videoUrl),
        content: l.content || "",
        quiz_id: l.quiz_id || l.quizId || null,
        quizData: l.quizData || l.quiz || null,
        questions: l.questions || l.quiz_questions || null,
        attachments: l.attachments || [],
      })),
    }));
  }, [apiDetail, previewDetail.data, isPreview]);

 const hasInitialized = useRef(false);
 useEffect(() => {
 if (curriculum.length > 0 && !hasInitialized.current) {
 const initialExpanded: Record<string, boolean> = {};
 curriculum.forEach((mod) => {
 initialExpanded[mod.id] = true;
 });
 setExpandedModules(initialExpanded);

 const allL = curriculum.flatMap((m) => m.lessons);
 if (initialLessonParam) {
 const match = allL.find((l) => l.id === initialLessonParam || l.id.endsWith(initialLessonParam));
 if (match) setActiveLessonId(match.id);
 } else {
 const firstIncomplete = allL.find((l) => !l.completed);
 setActiveLessonId(firstIncomplete ? firstIncomplete.id : allL[0]?.id || "");
 }
 hasInitialized.current = true;
 }
 }, [curriculum, initialLessonParam]);

 const allLessons = React.useMemo(() => curriculum.flatMap((m) => m.lessons), [curriculum]);

 const activeLesson: LessonData | undefined = React.useMemo(
 () => allLessons.find((l) => l.id === activeLessonId) || allLessons[0],
 [allLessons, activeLessonId]
 );

 // Tab & comment states
 const [activeTab, setActiveTab] = useState<"content" | "ai_tips" | "discussion">("content");
 const { data: apiDiscussions, isLoading: isDiscussionsLoading } = useGetDiscussions(isPreview ? "" : activeLessonId);
 const { mutate: submitDiscussion, isPending: isSubmittingDiscussion } = useCreateDiscussion();
 const { mutate: updateDiscussion, isPending: isUpdatingDiscussion } = useUpdateDiscussion();
 const { mutate: deleteDiscussion, isPending: isDeletingDiscussion } = useDeleteDiscussion();
 const [newCommentText, setNewCommentText] = useState("");
 const [editingDiscussionId, setEditingDiscussionId] = useState<string | number | null>(null);
 const [editDiscussionText, setEditDiscussionText] = useState("");

 const toggleModule = (modId: string) => {
 setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
 };

 // Progress
 const totalLessonCount = allLessons.length;
 const completedCount = allLessons.filter((l) => l.completed).length;
 const computedProgressPercentage = Math.round((completedCount / (totalLessonCount || 1)) * 100);

 const handleSelectLesson = (lessonId: string) => {
 setActiveLessonId(lessonId);
 setActiveTab("content");
 };

 // Record the server-side start time whenever a lesson is opened (completion is validated against it).
 const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 useEffect(() => {
 if (isPreview || !activeLesson?.id || activeLesson.completed) return;
 startLesson(activeLesson.id).catch(() => {});
 return () => {
 if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
 };
 }, [activeLesson?.id, activeLesson?.completed, isPreview]);

 // Handle lesson completion
 const handleLessonComplete = useCallback(async () => {
 if (isPreview || !activeLesson || activeLesson.completed) return;

 const payload: { playback_position?: number; time_spent_seconds?: number } = {};
 if (activeLesson.type === 'video') {
 payload.playback_position = activeLesson.durationSeconds; // Video reached end
 } else if (activeLesson.type === 'article') {
 payload.time_spent_seconds = Math.ceil(activeLesson.durationSeconds * 1 / 3);
 }
 // For quiz, the backend auto-completes via quiz submit

 try {
 const response = await completeLesson(activeLesson.id, payload);

 // Instant UI Update: Modify the TanStack Query Cache directly!
 queryClient.setQueryData(["student", "courses", "detail", String(parsedCourseId)], (oldData: CourseDetailData | undefined) => {
 if (!oldData) return oldData;
 return {
 ...oldData,
 modules: oldData.modules.map(mod => ({
 ...mod,
 lessons: mod.lessons.map(les => ({
 ...les,
 status: les.id.toString() === activeLesson.id ? 'completed' : les.status
 }))
 })),
 progress_card: oldData.progress_card ? {
 ...oldData.progress_card,
 progress_percentage: response.progress_percentage,
 completed_lessons_count: response.completed_lessons_count,
 total_lessons_count: response.total_lessons_count,
 } : undefined
 };
 });

 // Background refetch to guarantee synchronization
 invalidateCourseDetail(parsedCourseId);
 } catch (err: any) {
 // The server measures real study time; if it is not enough yet, retry once it is.
 const remaining = Number(err?.response?.data?.errors?.remaining_seconds);
 if (err?.response?.status === 422 && remaining > 0) {
 if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
 retryTimerRef.current = setTimeout(() => { void handleLessonCompleteRef.current?.(); }, (remaining + 1) * 1000);
 return;
 }
 console.warn("Completion API error:", err);
 }
 }, [activeLesson, invalidateCourseDetail, parsedCourseId, isPreview, queryClient]);
 const handleLessonCompleteRef = useRef(handleLessonComplete);
 useEffect(() => { handleLessonCompleteRef.current = handleLessonComplete; }, [handleLessonComplete]);

 // Post comment
 const [confirmDeleteId, setConfirmDeleteId] = useState<string | number | null>(null);

 const handlePostComment = (e: React.FormEvent) => {
 e.preventDefault();
 if (isPreview || !newCommentText.trim() || isSubmittingDiscussion) return;
 submitDiscussion(
 { lessonId: activeLessonId, content: newCommentText.trim() },
 {
 onSuccess: () => {
 setNewCommentText("");
 toast.success("Gửi thảo luận thành công!");
 }
 }
 );
 };

 const handleEditDiscussion = (discussionId: string | number, content: string) => {
 setEditingDiscussionId(discussionId);
 setEditDiscussionText(content);
 };

 const handleEditDiscussionSubmit = (e: React.FormEvent, discussionId: string | number) => {
 e.preventDefault();
 if (!editDiscussionText.trim()) return;

 updateDiscussion(
 { lessonId: activeLessonId, discussionId, content: editDiscussionText.trim() },
 {
 onSuccess: () => {
 setEditingDiscussionId(null);
 toast.success("Cập nhật thảo luận thành công!");
 }
 }
 );
 };

 const handleDeleteDiscussion = (discussionId: string | number) => {
 setConfirmDeleteId(discussionId);
 };

 const confirmDelete = () => {
 if (!confirmDeleteId) return;
 deleteDiscussion(
 { lessonId: activeLessonId, discussionId: confirmDeleteId },
 { onSuccess: () => { toast.success("Xóa thảo luận thành công!"); } }
 );
 setConfirmDeleteId(null);
 };

 // Navigation
 const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
 const hasPrevious = currentIndex > 0;
 const hasNext = currentIndex < allLessons.length - 1;

 const handleGoPrevious = () => {
 if (hasPrevious) handleSelectLesson(allLessons[currentIndex - 1].id);
 };
 const handleGoNext = () => {
 if (hasNext) handleSelectLesson(allLessons[currentIndex + 1].id);
 };

 if (!parsedCourseId || parsedCourseId <= 0 || (error && (error as any).response?.status === 404)) {
 return (
 <div className="w-full h-screen flex flex-col items-center justify-center bg-blue-50/50 p-6">
 <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-blue-100">
 <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy khóa học</h2>
 <p className="text-sm text-slate-500 mb-6">Vui lòng chọn một khóa học để bắt đầu học.</p>
 <a href="/courses" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all shadow-sm">
 Xem danh sách khóa học
 </a>
 </div>
 </div>
 );
 }

 // Lesson material is only for enrolled learners (the API also strips it for everyone else).
 if (!isPreview && apiDetail && apiDetail.header_info?.is_enrolled === false) {
 return (
 <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6">
 <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-slate-200">
 <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
 <Lock size={22} aria-hidden />
 </div>
 <h2 className="text-lg font-bold text-slate-900 mb-2">Bạn chưa đăng ký khóa học này</h2>
 <p className="text-sm text-slate-500 mb-6">Đăng ký khóa học để xem bài giảng, tài liệu và làm bài kiểm tra.</p>
 <Link href={`/courses/detail?courseId=${parsedCourseId}`} className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm">
 Xem thông tin khóa học
 </Link>
 </div>
 </div>
 );
 }

 if (isPreview && (error || (!isLoading && !activeLesson))) {
 const status = (error as any)?.response?.status;
 const message = status === 403 ? "Bạn không có quyền xem trước khóa học này."
 : error ? "Không thể tải bản xem trước. Vui lòng thử lại."
 : "Khóa học chưa có bài học để xem trước.";
 return (
 <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-50/50 p-6">
 <p role="alert" className="font-semibold text-slate-700">{message}</p>
 <Link href={`/instructor/courses/${parsedCourseId}/edit`} className="text-blue-600 underline">Quay lại chỉnh sửa khóa học</Link>
 </div>
 );
 }

 if (isLoading || !activeLesson) {
 return (
 <div role="status" aria-busy="true" aria-label="Đang tải bài học" className="w-full min-h-screen bg-slate-50/50">
 <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
 <div className="space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-5 w-64" /></div>
 <Skeleton className="h-2 w-40 rounded-full" />
 </div>
 <div className="max-w-[1400px] mx-auto p-6 flex flex-col lg:flex-row gap-8">
 <div className="flex-1 space-y-6">
 <Skeleton className="aspect-video w-full rounded-xl" />
 <Skeleton className="h-12 w-full rounded-xl" />
 <Skeleton className="h-40 w-full rounded-xl" />
 </div>
 <div className="w-full lg:w-[340px] space-y-4">
 <Skeleton className="h-24 w-full rounded-xl" />
 {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
 </div>
 </div>
 </div>
 );
 }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 relative font-sans">
      <style>{`main { padding-bottom: 0 !important; }`}</style>
      {/* ─── Instructor Preview Mode Sticky Banner ─── */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Eye size={14} className="inline mr-1" /> XEM TRƯỚC
            </span>
            <span className="text-xs font-semibold text-slate-200">
              <GraduationCap size={14} className="inline mr-1 text-slate-400" /> Giao diện Học viên - Giảng viên trải nghiệm Video, Bài đọc & Thi thử Quiz (Dữ liệu tiến độ không lưu vào hệ thống)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.close();
              }
              window.location.href = `/instructor/courses/${parsedCourseId}/edit`;
            }}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
          >
            <X size={16} />
            <span>Thoát</span>
          </button>
        </div>
      )}

      {/* ─── Top Header & Breadcrumb ─── */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 transition-all">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={isPreview ? `/instructor/courses/${parsedCourseId}/edit` : `/courses/detail?courseId=${parsedCourseId}`}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all shrink-0 shadow-sm"
              title="Quay lại chi tiết Khóa học"
              aria-label="Quay lại chi tiết Khóa học"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>
            <div className="min-w-0">
              <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 truncate">
                <Link href="/courses" className="hover:text-slate-900 transition-colors">Khoá học</Link>
                <ChevronRight size={12} className="text-slate-300 shrink-0" aria-hidden />
                <span className="text-slate-700 truncate">{(isPreview ? previewDetail.data?.title : apiDetail?.header_info?.title) || "Khóa học"}</span>
              </nav>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate tracking-tight">{activeLesson.title}</h1>
            </div>
          </div>

          {/* Progress Bar - Right side */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiến độ khoá học</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${computedProgressPercentage}%` }} />
            </div>
            <span className="text-sm font-bold text-slate-900">{computedProgressPercentage}%</span>
          </div>
        </div>
      </header>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ─── Left Column (8 cols): Lesson Content ─── */}
        <main className="lg:col-span-8 flex flex-col gap-6 w-full min-w-0">

          {/* AI Notice */}
          <div className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 border border-sky-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 min-w-0 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                <Sparkles size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-slate-900 mb-0.5 tracking-tight flex items-center gap-2">
                  MindNova AI
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium truncate" title="Bạn có thể sử dụng khu vực Thảo luận bên dưới để đặt câu hỏi trực tiếp cho AI trong quá trình học">
                  Bạn có thể sử dụng khu vực Thảo luận bên dưới để đặt câu hỏi trực tiếp cho AI trong quá trình học
                </p>
              </div>
            </div>
          </div>

          {/* ─── Content by Type ─── */}
          <div className="rounded-[24px] overflow-hidden border border-slate-200/80 bg-black shadow-sm ring-4 ring-slate-50/50">
            {activeLesson.type === 'video' && (
              <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} isPreview={isPreview} />
            )}

            {activeLesson.type === 'article' && (
              <div className="bg-white"><ArticleRenderer lesson={activeLesson} onComplete={handleLessonComplete} /></div>
            )}

            {(activeLesson.type === 'quiz_module' || activeLesson.type === 'quiz') && (
              <div className="bg-white"><QuizRenderer lesson={activeLesson} onComplete={handleLessonComplete} isPreview={isPreview} /></div>
            )}

            {/* Fallback for unknown type — show as video */}
            {!['video', 'article', 'quiz_module', 'quiz'].includes(activeLesson.type) && (
              <CustomVideoPlayer lesson={activeLesson} onComplete={handleLessonComplete} isPreview={isPreview} />
            )}
          </div>

  {/* ─── Tabs: Content Info / AI / Discussion ─── */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col">
    <div className="p-4 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab("content")}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap focus:outline-none flex-1 text-center",
            activeTab === "content" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          Nội dung học
        </button>
        <button
          onClick={() => setActiveTab("ai_tips")}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 focus:outline-none flex-1",
            activeTab === "ai_tips" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          <span>Cố vấn AI Nova</span>
          <span className={twMerge("px-2 py-0.5 rounded-md text-[10px] font-bold", activeTab === "ai_tips" ? "bg-blue-100 text-blue-700" : "bg-slate-300 text-slate-600")}>0</span>
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          disabled={isPreview}
          title={isPreview ? "Thảo luận không khả dụng trong chế độ xem trước" : undefined}
          className={twMerge(
            "px-5 py-2.5 font-bold text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 focus:outline-none flex-1",
            activeTab === "discussion" ? "bg-white text-blue-700 shadow-sm ring-1 ring-black/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          <span>Thảo luận & Ghi chú</span>
          <span className={twMerge("px-2 py-0.5 rounded-md text-[10px] font-bold", activeTab === "discussion" ? "bg-blue-100 text-blue-700" : "bg-slate-300 text-slate-600")}>{apiDiscussions?.length || 0}</span>
        </button>
      </div>
    </div>

    <div className="p-6 sm:p-8 bg-white min-h-[300px]">
      {/* Tab 1: Content Info */}
      {activeTab === "content" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            <span className={twMerge("inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-sm", getLessonTypeColor(activeLesson.type))}>
              {getLessonTypeLabel(activeLesson.type)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 shadow-sm">
              <span>Thời lượng:</span> {activeLesson.duration}
            </span>
            {activeLesson.completed ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm uppercase tracking-wide">
                <CheckCircle2 size={12} strokeWidth={3} /> HOÀN THÀNH
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 shadow-sm uppercase tracking-wide">
                Đang học
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: AI Tips */}
      {activeTab === "ai_tips" && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">Phân tích chuyên sâu từ MindNova</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">Các lưu ý chuyên môn được đúc kết từ thực tiễn. Tính năng đang trong quá trình thử nghiệm và sớm ra mắt.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Discussion */}
      {activeTab === "discussion" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Discussion Input */}
          <form onSubmit={handlePostComment} className="flex flex-col gap-3 p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-[0_4px_20px_rgb(37,99,235,0.08)]">
            <h4 className="font-semibold text-[14px] text-slate-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              Gửi câu hỏi hoặc ghi chú học tập
            </h4>
            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Bạn có thắc mắc gì về bài học này không? Nhập nội dung vào đây..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-sm"
            />
            <div className="flex justify-end mt-1">
              <button disabled={isSubmittingDiscussion} type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[13px] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2">
                <MessageSquare size={16} />
                {isSubmittingDiscussion ? "Đang gửi..." : "Gửi thảo luận"}
              </button>
            </div>
          </form>

          {/* Discussion List */}
          <div className="flex flex-col gap-6">
            {isDiscussionsLoading ? (
              <SkeletonList items={3} />
            ) : apiDiscussions?.length === 0 ? (
              <div className="py-8">
                <NoDataAvailable
                  icon={MessageSquare}
                  title="Chưa có thảo luận"
                  description="Chưa có thảo luận nào cho bài học này. Hãy để lại câu hỏi để tương tác cùng AI hoặc giảng viên!"
                  variant="compact"
                />
              </div>
            ) : (
              apiDiscussions?.map((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  {/* Student Question */}
                  {editingDiscussionId === item.id ? (
                    <form onSubmit={(e) => handleEditDiscussionSubmit(e, item.id)} className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-3 shadow-sm">
                      <textarea
                        value={editDiscussionText}
                        onChange={(e) => setEditDiscussionText(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-[13px] text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                      />
                      <div className="flex justify-end gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setEditingDiscussionId(null)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingDiscussion}
                          className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm disabled:opacity-60"
                        >
                          {isUpdatingDiscussion ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-5 rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                      <Avatar src={item.student.avatar} fallback={item.student.name.slice(0, 2)} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-[13px] text-slate-900">{item.student.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-slate-400">{new Date(item.created_at).toLocaleString('vi-VN')}</span>
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                              <button
                                onClick={() => handleEditDiscussion(item.id, item.content)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title="Sửa"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteDiscussion(item.id)}
                                disabled={isDeletingDiscussion}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-60"
                                title="Xóa"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                      </div>
                    </div>
                  )}

                  {/* Teacher Replies */}
                  {item.replies.map((reply) => (
                    <div key={reply.id} className="ml-10 p-5 rounded-xl border border-slate-200/60 bg-slate-50/80 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-600 text-white font-bold shrink-0 shadow-sm text-sm">
                        GV
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-[13px] text-slate-900 flex items-center gap-1.5">
                            <span>{reply.user.name}</span>
                            <VerifiedTeacherBadge isVerified={(reply.user as any).is_verified ?? true} size="xs" />
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-700 bg-emerald-100 uppercase tracking-wider">Giảng viên</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">{new Date(reply.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  </div>
 </main>

  {/* ─── Right Column (4 cols): Sidebar ─── */}
  <aside className="lg:col-span-4 w-full flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto pr-1">

    {/* Progress Header */}
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-slate-900 flex items-center gap-2">
            <span>Lộ trình Học tập</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Tiến trình hoàn thành toàn khóa</p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl shrink-0 shadow-sm">
          {completedCount}/{totalLessonCount} Bài học
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200/50">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${computedProgressPercentage}%` }} />
      </div>
    </div>

    {/* Module Accordion */}
    <div className="flex flex-col gap-4">
      {curriculum.map((mod, moduleIndex) => {
        const isExpanded = expandedModules[mod.id] ?? true;
        const modCompletedCount = mod.lessons.filter((l) => l.completed).length;
        const isModuleCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;
        const isModuleCurrent = mod.lessons.some((l) => l.id === activeLessonId);

        return (
          <div
            key={mod.id}
            className={twMerge(
              "rounded-xl border transition-all duration-200 overflow-hidden shadow-sm",
              isModuleCurrent ? "bg-white border-blue-200 ring-4 ring-blue-50/50" : "bg-white border-slate-200/60 hover:border-slate-300"
            )}
          >
            {/* Module Header */}
            <div
              onClick={() => toggleModule(mod.id)}
              className="flex items-start justify-between p-5 cursor-pointer hover:bg-slate-50/80 transition-colors group select-none"
            >
              <div className="flex items-start gap-4 min-w-0 pr-2">
                <div className={twMerge(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5 transition-all shadow-sm",
                  isModuleCompleted ? "bg-emerald-500 text-white border border-emerald-600" :
                  isModuleCurrent ? "bg-blue-50 border-2 border-blue-500 text-blue-700" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                )}>
                  {isModuleCompleted ? <Check size={14} strokeWidth={3} aria-hidden /> : moduleIndex + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">{mod.title}</p>
                  <h3 className="text-[15px] font-semibold text-slate-900 mt-1 leading-snug">Nhiều bài học</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {modCompletedCount}/{mod.lessons.length} bài đã học
                    </span>
                    {isModuleCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />}
                  </div>
                </div>
              </div>
              <button className="text-slate-400 group-hover:text-slate-700 transition-colors p-1 shrink-0 bg-slate-50 rounded-lg group-hover:bg-slate-200/50" type="button" aria-label="Thu gọn hoặc mở rộng học phần">
                <ChevronsUpDown size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Lessons */}
            {isExpanded && (
              <div className="flex flex-col border-t border-slate-200/60 p-2 gap-1.5 bg-slate-50/50">
                {mod.lessons.map((lesson) => {
                  const isCurrent = lesson.id === activeLessonId;
                  const isCompleted = lesson.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      className={twMerge(
                        "flex items-center justify-between py-3 px-3.5 rounded-xl relative cursor-pointer transition-all duration-200 border",
                        isCurrent ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100" : "bg-transparent border-transparent hover:border-blue-500/60 hover:bg-white hover:shadow-md"
                      )}
                    >
                      {isCurrent && <div className="absolute left-0 top-3 bottom-3 w-[4px] bg-blue-600 rounded-r-full shadow-sm" />}

                      <div className="flex items-center gap-3 min-w-0 pl-1 pr-2">
                        <div className={twMerge(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm",
                          isCompleted ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                          isCurrent ? "bg-blue-50 border-2 border-blue-500 text-blue-700" :
                          "border border-slate-200 text-slate-400 bg-white"
                        )}>
                          <LessonStatusIcon
                            lesson={{
                              type: lesson.type,
                              title: lesson.title,
                              status: isCompleted ? "completed" : isCurrent ? "current" : undefined,
                              completed: isCompleted,
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className={twMerge(
                            "text-[13px] leading-snug truncate",
                            isCurrent ? "text-slate-900 font-semibold" : "text-slate-700 font-bold"
                          )}>
                            {lessonDisplayTitle(lesson.title)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {/* Lesson Type Label */}
                            <span className={twMerge(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm",
                              getLessonTypeColor(lesson.type)
                            )}>
                              {getLessonTypeLabel(lesson.type)}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400"> {lesson.duration}</span>
                            {/* Status Badge */}
                            {isCurrent && !isCompleted && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 uppercase tracking-wider shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                ĐANG HỌC
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-wider shadow-sm">
                                HOÀN THÀNH
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400">
                        <ChevronRight size={16} className={isCurrent ? "text-blue-600" : "text-slate-300"} aria-hidden />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </aside>
 </div>

  {/* ─── Bottom Toolbar ─── */}
  <footer className="w-full bg-white border-t border-slate-200 px-4 md:px-8 py-3.5 mt-auto sticky bottom-0 z-40 shadow-[0_-4px_20px_rgb(0,0,0,0.02)]">
    <div className="max-w-[1400px] mx-auto w-full flex items-center justify-center">
      {/* Navigation Buttons - Centered & Evenly Spaced */}
      <div className="w-full flex items-center justify-center gap-3 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={handleGoPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[13px] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow whitespace-nowrap"
        >
          <ArrowLeft size={16} strokeWidth={2.5} aria-hidden />
          <span className="hidden sm:inline">Bài trước</span>
        </button>

        {/* Completion status indicator */}
        {activeLesson.completed ? (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[12px] border border-emerald-200 uppercase tracking-wider shadow-sm whitespace-nowrap">
            <CheckCircle2 size={16} strokeWidth={2.5} aria-hidden />
            <span className="hidden md:inline">Hoàn thành</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-[12px] border border-slate-200/60 shadow-sm whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            <span className="hidden md:inline">Đang học tự động ghi nhận</span>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleGoNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] uppercase tracking-wide whitespace-nowrap"
        >
          <span>Bài tiếp theo</span>
          <ChevronRight size={16} strokeWidth={3} aria-hidden />
        </button>
      </div>
    </div>
  </footer>

  {/* ─── Confirm Delete Dialog ─── */}
  {confirmDeleteId !== null && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <Trash2 size={20} className="text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Xác nhận xóa</h3>
            <p className="text-[13px] text-slate-500">Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )}

  </div>
  );
}

// ─── Exported Master Component ────────────────────────────────────────────────
export function LessonWorkspace() {
 return (
 <Suspense fallback={<div role="status" aria-busy="true" aria-label="Đang tải bài học" className="max-w-[1400px] mx-auto p-6 space-y-6"><Skeleton className="aspect-video w-full rounded-xl" /><Skeleton className="h-40 w-full rounded-xl" /></div>}>
 <LessonWorkspaceContent />
 </Suspense>
 );
}
