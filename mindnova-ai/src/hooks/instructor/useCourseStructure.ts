"use client";

import { useState, useCallback } from "react";

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

const INITIAL_CHAPTERS: ChapterNode[] = [
  {
    id: "chap-1",
    title: "Module 1: Architecture Foundations & Server Components",
    description: "Understanding RSC paradigms and modern Next.js caching models.",
    lessons: [
      { id: "les-101", title: "Why React Server Components? (80/20 Practice)", type: "video", durationSeconds: 620 },
      { id: "les-102", title: "Configuring App Router Routing Architectures", type: "document" },
      { id: "les-103", title: "Module 1 Practical Understanding Check", type: "quiz" },
    ],
  },
  {
    id: "chap-2",
    title: "Module 2: Edge Data Fetching & Cache Revalidation",
    description: "Mastering fetch tag invalidation and Server Actions.",
    showAiSuggestion: true,
    lessons: [
      { id: "les-201", title: "Building Type-Safe Server Actions", type: "video", durationSeconds: 890 },
      { id: "les-202", title: "Optimistic UI Updates & Error Boundary Defense", type: "video", durationSeconds: 540 },
    ],
  },
];

export function useCourseStructure(initialStatus: CoursePublishStatus = "draft"): UseCourseStructureReturn {
  const [chapters, setChapters] = useState<ChapterNode[]>(INITIAL_CHAPTERS);
  const [status, setStatusState] = useState<CoursePublishStatus>(initialStatus);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [versionMeta, setVersionMeta] = useState<CourseVersionMeta>({
    version: "v1.0.0-draft",
    lastUpdated: new Date().toISOString(),
    isLockedForStudents: false,
  });

  // Rule: Course must have >= 1 chapter and >= 1 lesson overall to be submitted for review
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
    const newChap: ChapterNode = {
      id: `chap-${Date.now()}`,
      title,
      description: "Click to edit chapter overview...",
      lessons: [],
    };
    setChapters((prev) => [...prev, newChap]);
    setValidationError(null);
  }, []);

  const updateChapterTitle = useCallback((chapterId: string, title: string) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, title } : ch))
    );
  }, []);

  const deleteChapter = useCallback((chapterId: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  }, []);

  const addLesson = useCallback((chapterId: string, title = "New Interactive Lesson", type: LessonType = "video") => {
    const newLesson: LessonNode = {
      id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      type,
      durationSeconds: type === "video" ? 360 : undefined,
    };
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch))
    );
    setValidationError(null);
  }, []);

  const updateLesson = useCallback((chapterId: string, lessonId: string, updates: Partial<LessonNode>) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch;
        return {
          ...ch,
          lessons: ch.lessons.map((ls) => (ls.id === lessonId ? { ...ls, ...updates } : ls)),
        };
      })
    );
  }, []);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch;
        return {
          ...ch,
          lessons: ch.lessons.filter((ls) => ls.id !== lessonId),
        };
      })
    );
  }, []);

  // Effortlessly move lesson across chapters (Drag-and-drop support)
  const moveLesson = useCallback((fromChapterId: string, toChapterId: string, lessonId: string, targetIndex?: number) => {
    setChapters((prev) => {
      const sourceChap = prev.find((c) => c.id === fromChapterId);
      if (!sourceChap) return prev;
      const lessonToMove = sourceChap.lessons.find((l) => l.id === lessonId);
      if (!lessonToMove) return prev;

      return prev.map((ch) => {
        if (ch.id === fromChapterId && ch.id === toChapterId) {
          // Reordering within same chapter
          const filtered = ch.lessons.filter((l) => l.id !== lessonId);
          const idx = targetIndex !== undefined ? targetIndex : filtered.length;
          const updated = [...filtered];
          updated.splice(idx, 0, lessonToMove);
          return { ...ch, lessons: updated };
        }
        if (ch.id === fromChapterId) {
          return { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) };
        }
        if (ch.id === toChapterId) {
          const filtered = ch.lessons;
          const idx = targetIndex !== undefined ? targetIndex : filtered.length;
          const updated = [...filtered];
          updated.splice(idx, 0, lessonToMove);
          return { ...ch, lessons: updated };
        }
        return ch;
      });
    });
  }, []);

  // Rule: Submit for review gate enforcement
  const handleSubmitForReview = useCallback((): boolean => {
    if (!canSubmitForReview) {
      setValidationError("Submission Blocked: You must add at least 1 chapter and 1 lesson before submitting for review.");
      return false;
    }
    setValidationError(null);
    setStatusState("review");
    return true;
  }, [canSubmitForReview]);

  // Rule: Changes to published courses must be version-controlled so students are not disrupted mid-lesson
  const createVersionSnapshot = useCallback(() => {
    setVersionMeta((prev) => {
      const parts = prev.version.replace("v", "").split(".");
      const major = Number(parts[0]) || 1;
      const minor = (Number(parts[1]) || 0) + 1;
      return {
        version: `v${major}.${minor}.0`,
        lastUpdated: new Date().toISOString(),
        isLockedForStudents: true, // Seamless mid-lesson lock for active students
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
