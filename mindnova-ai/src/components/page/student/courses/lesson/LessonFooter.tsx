"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonFooterProps {
  /** Enabled only when user has watched >= 90% of the video per Core Rule */
  canMarkComplete: boolean;
  isAlreadyCompleted?: boolean;
  previousLessonId?: number | null;
  nextLessonId?: number | null;
  courseId?: number;
  onMarkComplete?: () => void;
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
    console.info(`[LessonFooter] Sending atomic progress completion update for course #${courseId}...`);

    // Simulate atomic completion update on server: PATCH /api/lessons/[lessonId]/complete
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    setMarkedDone(true);
    setIsMarking(false);
    onMarkComplete?.();
  }, [canMarkComplete, markedDone, isMarking, courseId, onMarkComplete]);

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

  const isMarkButtonActive = canMarkComplete && !markedDone && !isMarking;

  return (
    <div className="bg-white border-t border-[#F0F0F8] px-8 py-4 sticky bottom-0 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Previous Action */}
        <button
          type="button"
          onClick={navigatePrevious}
          disabled={!previousLessonId}
          className="flex items-center gap-2 text-sm font-semibold text-[#64647A] hover:text-[#1A1A2E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Previous
        </button>

        {/* Center: Mark as Completed (Gated by >=90% video heartbeat) */}
        <div className="relative group flex items-center gap-3">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={!isMarkButtonActive}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#6B6BFF] ${
              markedDone
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-default"
                : isMarkButtonActive
                ? "text-white bg-[#6B6BFF] hover:bg-[#5858E0] shadow-[0_4px_12px_rgba(107,107,255,0.35)] hover:-translate-y-0.5 cursor-pointer"
                : "text-[#A0A0C0] bg-[#F4F4FA] border border-[#EAEAF4] cursor-not-allowed"
            }`}
          >
            {isMarking ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : markedDone || canMarkComplete ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            <span>
              {isMarking
                ? "Recording Progress..."
                : markedDone
                ? "Lesson Completed"
                : "Mark as Completed"}
            </span>
          </button>

          {!canMarkComplete && !markedDone && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[#1A1A2E] text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-30">
              Watch 90% of video to unlock completion
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A2E]" />
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/practice")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF]/40 bg-white hover:bg-[#F8F8FC] transition-all focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/50"
          >
            Take Quiz
          </button>

          <button
            type="button"
            onClick={navigateNext}
            disabled={!nextLessonId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_12px_rgba(107,107,255,0.3)] hover:shadow-[0_6px_18px_rgba(107,107,255,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]"
          >
            <span>Next Lesson</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
