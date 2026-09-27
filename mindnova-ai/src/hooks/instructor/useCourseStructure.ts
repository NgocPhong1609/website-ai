"use client";

import { useCallback, useState } from "react";
import { useCreateCourseStore } from "@/src/features/instructor/create-course/stores/createCourseStore";
import type { DraftModule, DraftLesson } from "@/src/features/instructor/create-course/types";

export type CoursePublishStatus = "draft" | "review" | "published";
export type LessonType = "video" | "quiz" | "document";

export interface LessonNode {
  id: string;
  title: string;
  type: LessonType;
  durationSeconds?: number;
  videoUrl?: string;
  description?: string;
  content?: string;
  video_url?: string;
  temp_media_ids?: number[];
  quizData?: unknown;
  status?: string;
  position?: string;
  time_limit_minutes?: number;
  passing_score?: number;
  total_questions?: number;
  quiz_id?: number;
}

export interface ChapterNode {
  id: string;
  title: string;
  description?: string;
  lessons: LessonNode[];
  showAiSuggestion?: boolean;
}

export interface CourseVersionMeta {
  version: string;
  lastUpdated: string;
  isLockedForStudents: boolean;
}

export interface UseCourseStructureReturn {
  chapters: ChapterNode[];
  status: CoursePublishStatus;
  versionMeta: CourseVersionMeta;
  canSubmitForReview: boolean;
  validationError: string | null;
  setStatus: (newStatus: CoursePublishStatus) => void;
  addChapter: (title?: string) => void;
  updateChapterTitle: (chapterId: string, title: string) => void;
  deleteChapter: (chapterId: string) => void;
  addLesson: (chapterId: string, title?: string, type?: LessonType) => void;
  updateLesson: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  deleteLesson: (chapterId: string, lessonId: string) => void;
  moveLesson: (fromChapterId: string, toChapterId: string, lessonId: string, targetIndex?: number) => void;
  handleSubmitForReview: () => boolean;
  createVersionSnapshot: () => void;
}

export function useCourseStructure(initialStatus: CoursePublishStatus = "draft"): UseCourseStructureReturn {
  const store = useCreateCourseStore();
  
  const [status, setStatusState] = useState<CoursePublishStatus>(initialStatus);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [versionMeta, setVersionMeta] = useState<CourseVersionMeta>({
    version: "v1.0.0-draft",
    lastUpdated: new Date().toISOString(),
    isLockedForStudents: false,
  });

  const chapters: ChapterNode[] = store.modules.map((m: DraftModule) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    showAiSuggestion: m.showAiSuggestion,
    lessons: m.lessons.map((l: DraftLesson) => ({
      ...l
    }))
  }));

  const totalLessonsCount = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const canSubmitForReview = chapters.length >= 1 && totalLessonsCount >= 1;

  const setStatus = useCallback((newStatus: CoursePublishStatus) => {
    if (newStatus === "review" && !canSubmitForReview) {
      setValidationError("Cannot submit for review: A course must contain at least 1 chapter and 1 lesson.");
      return;
    }
    setValidationError(null);
    setStatusState(newStatus);
  }, [canSubmitForReview]);

  const addChapter = useCallback((title = "New Curriculum Module") => {
    store.addModule(title, "Click to edit chapter overview...");
    setValidationError(null);
  }, [store]);

  const updateChapterTitle = useCallback((chapterId: string, title: string) => {
    store.updateModule(chapterId, { title });
  }, [store]);

  const deleteChapter = useCallback((chapterId: string) => {
    store.deleteModule(chapterId);
  }, [store]);

  const addLesson = useCallback((chapterId: string, title = "New Interactive Lesson", type: LessonType = "video") => {
    // We add it first
    store.addLesson(chapterId, type);
    // Then we update the title
    const state = useCreateCourseStore.getState();
    const courseModule = state.modules.find(m => m.id === chapterId);
    if (courseModule && courseModule.lessons.length > 0) {
      const newLesson = courseModule.lessons[courseModule.lessons.length - 1];
      store.updateLesson(chapterId, newLesson.id, { title });
    }
    setValidationError(null);
  }, [store]);

  const updateLesson = useCallback((chapterId: string, lessonId: string, updates: Partial<LessonNode>) => {
    store.updateLesson(chapterId, lessonId, updates as Partial<DraftLesson>);
  }, [store]);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    store.deleteLesson(chapterId, lessonId);
  }, [store]);

  const moveLesson = useCallback((fromChapterId: string, toChapterId: string, lessonId: string, targetIndex?: number) => {
    const state = useCreateCourseStore.getState();
    const source = state.modules.find((chapter) => chapter.id === fromChapterId);
    const target = state.modules.find((chapter) => chapter.id === toChapterId);
    const lesson = source?.lessons.find((item) => item.id === lessonId);
    if (!source || !target || !lesson) return;

    const targetLessons = target.lessons.filter((item) => item.id !== lessonId);
    const index = Math.max(0, Math.min(targetIndex ?? targetLessons.length, targetLessons.length));
    targetLessons.splice(index, 0, lesson);

    // Update both chapters together, preserving the original lesson and all its media/quiz data.
    state.setModules(state.modules.map((chapter) => {
      if (chapter.id === toChapterId) {
        return { ...chapter, lessons: targetLessons.map((item, i) => ({ ...item, order: i + 1 })) };
      }
      if (chapter.id === fromChapterId) {
        return { ...chapter, lessons: chapter.lessons.filter((item) => item.id !== lessonId)
          .map((item, i) => ({ ...item, order: i + 1 })) };
      }
      return chapter;
    }));
  }, [store]);

  const handleSubmitForReview = useCallback((): boolean => {
    if (!canSubmitForReview) {
      setValidationError("Submission Blocked: You must add at least 1 chapter and 1 lesson before submitting for review.");
      return false;
    }
    setValidationError(null);
    setStatusState("review");
    return true;
  }, [canSubmitForReview]);

  const createVersionSnapshot = useCallback(() => {
    setVersionMeta((prev) => {
      const parts = prev.version.replace("v", "").split(".");
      const major = Number(parts[0]) || 1;
      const minor = (Number(parts[1]) || 0) + 1;
      return {
        version: `v${major}.${minor}.0`,
        lastUpdated: new Date().toISOString(),
        isLockedForStudents: true,
      };
    });
  }, []);

  return {
    chapters,
    status,
    versionMeta,
    canSubmitForReview,
    validationError,
    setStatus,
    addChapter,
    updateChapterTitle,
    deleteChapter,
    addLesson,
    updateLesson,
    deleteLesson,
    moveLesson,
    handleSubmitForReview,
    createVersionSnapshot,
  };
}
