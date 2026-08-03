"use client";

import { useCallback, useState } from "react";
import { useCreateCourseStore } from "@/src/features/instructor/create-course/stores/createCourseStore";
import type { DraftModule, DraftLesson, DraftLessonType } from "@/src/features/instructor/create-course/types";

export type CoursePublishStatus = "draft" | "review" | "published";
export type LessonType = "video" | "quiz" | "document";

export interface LessonNode {
  id: string;
  title: string;
  type: LessonType;
  durationSeconds?: number;
  videoUrl?: string;
  description?: string;
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
      id: l.id,
      title: l.title,
      type: l.type,
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
    const module = state.modules.find(m => m.id === chapterId);
    if (module && module.lessons.length > 0) {
      const newLesson = module.lessons[module.lessons.length - 1];
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
    // In our backend, moving lessons across modules might be complex.
    // For this simple UI draft, we can implement it by directly manipulating the store's state if we wanted,
    // but the store currently only supports `reorderLessons` inside a module.
    // Let's implement a quick cross-module move.
    const state = useCreateCourseStore.getState();
    const sourceChap = state.modules.find((c) => c.id === fromChapterId);
    if (!sourceChap) return;
    const lessonToMove = sourceChap.lessons.find((l) => l.id === lessonId);
    if (!lessonToMove) return;

    if (fromChapterId === toChapterId) {
      const filtered = sourceChap.lessons.filter((l) => l.id !== lessonId);
      const idx = targetIndex !== undefined ? targetIndex : filtered.length;
      const updated = [...filtered];
      updated.splice(idx, 0, lessonToMove);
      store.reorderLessons(fromChapterId, updated);
    } else {
      // Need to add to target and remove from source.
      // Since our store doesn't easily expose this, we can just delete from source and append to target.
      // For exact index insertion, we would need to manually map and reorder the target.
      // We'll update the target's lessons list via a custom Zustand action or a workaround:
      store.deleteLesson(fromChapterId, lessonId);
      store.addLesson(toChapterId, lessonToMove.type);
      // Hacky way to set properties on the newly added lesson:
      setTimeout(() => {
        const newState = useCreateCourseStore.getState();
        const targetChap = newState.modules.find((c) => c.id === toChapterId);
        if (targetChap && targetChap.lessons.length > 0) {
          const added = targetChap.lessons[targetChap.lessons.length - 1];
          store.updateLesson(toChapterId, added.id, { title: lessonToMove.title, content: lessonToMove.content });
          
          // Reorder if targetIndex is provided
          if (targetIndex !== undefined) {
             const finalState = useCreateCourseStore.getState();
             const tc = finalState.modules.find(c => c.id === toChapterId);
             if (tc) {
               const all = [...tc.lessons];
               const last = all.pop()!;
               all.splice(targetIndex, 0, last);
               store.reorderLessons(toChapterId, all);
             }
          }
        }
      }, 0);
    }
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
