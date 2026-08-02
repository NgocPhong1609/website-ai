"use client";

import { useCallback, useState } from "react";
import { LessonContent } from "./LessonContent";
import { LessonFooter } from "./LessonFooter";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson, IModule } from "@/src/components/page/student/courses/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonViewProps {
  lessonId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findAdjacentLessons(lessonId: string): {
  lesson: ILesson | null;
  previousLessonId: number | null;
  nextLessonId: number | null;
} {
  const id = parseInt(lessonId, 10);
  const allLessons = COURSE_DETAIL.modules.flatMap((m: IModule) => m.lessons);
  const index = allLessons.findIndex((l) => l.id === id);

  if (index === -1) return { lesson: null, previousLessonId: null, nextLessonId: null };

  const lesson = allLessons[index];
  const previousLesson = allLessons[index - 1] ?? null;
  const nextLesson = allLessons[index + 1] ?? null;

  return {
    lesson,
    previousLessonId: previousLesson?.id ?? null,
    nextLessonId: nextLesson?.status !== "locked" ? (nextLesson?.id ?? null) : null,
  };
}

// ─── Main Coordinator Component ───────────────────────────────────────────────

/**
 * LessonView coordinates communication between LessonContent (video heartbeat state)
 * and LessonFooter (completion lock state) per RSC client leaf boundaries.
 */
export function LessonView({ lessonId }: LessonViewProps) {
  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);

  const { lesson, previousLessonId, nextLessonId } = findAdjacentLessons(lessonId);

  const handleCompletionChange = useCallback((completed: boolean) => {
    setCanMarkComplete(completed);
  }, []);

  const handleMarkComplete = useCallback(() => {
    setIsMarkedComplete(true);
  }, []);

  return (
    <div className="flex-1 relative flex flex-col min-h-screen bg-[#F4F4F8]">
      <LessonContent
        lessonId={lessonId}
        onCompletionChange={handleCompletionChange}
      />
      <LessonFooter
        canMarkComplete={canMarkComplete}
        isAlreadyCompleted={lesson?.status === "completed" || isMarkedComplete}
        previousLessonId={previousLessonId}
        nextLessonId={nextLessonId}
        courseId={COURSE_DETAIL.id}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
}
