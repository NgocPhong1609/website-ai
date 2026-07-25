"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonFooterProps {
  /** Enabled only when user has watched >= 90% of the video */
  canMarkComplete: boolean;
  isAlreadyCompleted?: boolean;
  previousLessonId?: number | null;
  nextLessonId?: number | null;
  courseId?: number;
  onMarkComplete?: () => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonFooter({
  canMarkComplete,
  isAlreadyCompleted = false,
  previousLessonId,
  nextLessonId,
  courseId = 1,
  onMarkComplete,
}: LessonFooterProps) {
  const router = useRouter();
  const [isMarking, setIsMarking] = useState(false);
  const [markedDone, setMarkedDone] = useState(isAlreadyCompleted);

  const handleMarkComplete = useCallback(async () => {
    if (!canMarkComplete || markedDone || isMarking) return;

    setIsMarking(true);

    // Simulate API call: PATCH /api/lessons/[lessonId]/complete
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    setMarkedDone(true);
    setIsMarking(false);
    onMarkComplete?.();
  }, [canMarkComplete, markedDone, isMarking, onMarkComplete]);

  const navigatePrevious = useCallback(() => {
    if (previousLessonId) {
      router.push(`/courses/${previousLessonId}`);
    }
  }, [previousLessonId, router]);

  const navigateNext = useCallback(() => {
    if (nextLessonId) {
      router.push(`/courses/${nextLessonId}`);
    }
  }, [nextLessonId, router]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const isMarkButtonActive = canMarkComplete && !markedDone && !isMarking;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F8] px-8 py-4 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

        {/* Previous */}
        <button
          onClick={navigatePrevious}
          disabled={!previousLessonId}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon />
          Previous
        </button>

        {/* Center: Mark as Completed */}
        <div className="relative group">
          <button
            onClick={handleMarkComplete}
            disabled={!isMarkButtonActive}
            className={[
              "flex items-center gap-2 text-sm font-semibold transition-all ml-4 mr-auto border-l border-gray-200 pl-4",
              markedDone
                ? "text-emerald-600 cursor-default"
                : isMarkButtonActive
                  ? "text-[#6B6BFF] hover:text-[#4648D4] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {isMarking ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : markedDone ? (
              <CheckCircleIcon />
            ) : canMarkComplete ? (
              <CheckCircleIcon />
            ) : (
              <LockIcon />
            )}
            {isMarking
              ? "Saving..."
              : markedDone
                ? "Completed!"
                : "Mark as Completed"}
          </button>

          {/* Tooltip — only shown when button is locked */}
          {!canMarkComplete && !markedDone && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20">
              Watch 90% of the video to unlock
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
            onClick={() => router.push("/practice")}
          >
            Take Quiz
          </button>

          <button
            onClick={navigateNext}
            disabled={!nextLessonId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_12px_rgba(107,107,255,0.3)] hover:shadow-[0_6px_16px_rgba(107,107,255,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Next Lesson
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
