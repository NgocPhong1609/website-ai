"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

interface LessonFooterProps {
  canMarkComplete: boolean;
  isAlreadyCompleted?: boolean;
  previousLessonId?: number | null;
  nextLessonId?: number | null;
  courseId?: number;
  onMarkComplete?: () => void;
}

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
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

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

  const isMarkButtonActive = canMarkComplete && !markedDone && !isMarking;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0 z-20 shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Previous Lesson Action */}
        <button
          type="button"
          onClick={navigatePrevious}
          disabled={!previousLessonId}
          className="px-5 py-2.5 rounded-xl text-xs font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider flex items-center gap-2"
        >
          <span>⬅️</span>
          <span>Bài Trước</span>
        </button>

        {/* Center Completion Button */}
        <div className="relative group flex items-center gap-3">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={!isMarkButtonActive}
            className={`px-6 py-3 rounded-xl text-xs font-black transition-all shadow-2xs uppercase tracking-wider flex items-center gap-2 ${
              markedDone
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-default"
                : isMarkButtonActive
                ? "text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.99] cursor-pointer"
                : "text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed"
            }`}
          >
            {isMarking ? (
              <span>⌛ Đang ghi nhận...</span>
            ) : markedDone || canMarkComplete ? (
              <>
                <span>✅</span>
                <span>{markedDone ? "Đã Hoàn Thành Bài Giảng" : "Đánh Dấu Hoàn Thành"}</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Chưa Đạt Thời Lượng (Cần ≥80%)</span>
              </>
            )}
          </button>
        </div>

        {/* Next Lesson Action */}
        <button
          type="button"
          onClick={navigateNext}
          disabled={!nextLessonId}
          className="px-5 py-2.5 rounded-xl text-xs font-black text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider flex items-center gap-2"
        >
          <span>Bài Tiếp Theo</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
