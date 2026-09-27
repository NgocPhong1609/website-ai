"use client";

import { useEffect, useId, useRef } from "react";
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles, X } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { getErrorMessage } from "@/src/shared/lib/user-error";
import { useLessonAnalysis } from "../../api";
import { RecommendedCourseCard } from "./RecommendedCourseCard";

interface LessonDetailModalProps {
  lessonTitle: string | null;
  goal: string;
  onClose: () => void;
}

export function LessonDetailModal({ lessonTitle, goal, onClose }: LessonDetailModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, isLoading, isError, error, refetch, isFetching } = useLessonAnalysis(lessonTitle, goal);
  const isOpen = lessonTitle !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Phân tích bài học
            </p>
            <h2 id={titleId} className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{lessonTitle}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <AlertCircle className="h-8 w-8 text-rose-600" aria-hidden />
              <p role="alert" className="max-w-md text-sm text-rose-700">
                {getErrorMessage(error, "Chưa thể phân tích bài học này. Vui lòng thử lại.")}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Thử lại
              </button>
            </div>
          ) : isLoading || !data ? (
            <div role="status" aria-busy="true" className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <span className="sr-only">AI đang phân tích bài học</span>
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <section>
                  <h3 className="text-sm font-semibold text-slate-900">Tổng quan</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{data.overview}</p>
                </section>
                <section>
                  <h3 className="text-sm font-semibold text-slate-900">Bạn sẽ học được</h3>
                  <ul className="mt-2 space-y-2">
                    {data.key_takeaways.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <section>
                <h3 className="text-sm font-semibold text-slate-900">Khóa học liên quan</h3>
                {data.recommended_courses.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {data.recommended_courses.map((course) => (
                      <RecommendedCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Chưa có khóa học phù hợp trong thư viện. Hãy thử tìm ở trang Khám phá.
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
