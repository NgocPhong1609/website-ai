"use client";

import React, { useState, useCallback, useEffect, useMemo, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { NoData } from "@/src/shared/components/ui/NoData";
import { useCourseStructure, type LessonType, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { CreateLessonEditModal } from "./CreateLessonEditModal";
import { useCourseModules } from "@/src/features/instructor/management/api/courses";
import {
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useCreateQuiz,
  useReorderModuleItems,
} from "@/src/features/instructor/lesson-management/api";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";

import { CourseAiQuizModal } from "./CourseAiQuizModal";
import { CourseManualQuizModal } from "./CourseManualQuizModal";
import { SelectCourseLevelQuizModal } from "./SelectCourseLevelQuizModal";
import { useCreateCourseStore } from "../stores/createCourseStore";

function GripIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1"/>
      <circle cx="9" cy="5" r="1"/>
      <circle cx="9" cy="19" r="1"/>
      <circle cx="15" cy="12" r="1"/>
      <circle cx="15" cy="5" r="1"/>
      <circle cx="15" cy="19" r="1"/>
    </svg>
  );
}

function VideoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
}

function QuizIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );
}

function DocIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

function resolveLessonType(lesson: any): "quiz" | "video" | "document" {
  const typeStr = (lesson?.type || lesson?.item_type || "").toString().toLowerCase();
  if (typeStr === "quiz" || typeStr === "quiz_module" || lesson?.item_type === "quiz") {
    return "quiz";
  }
  if (typeStr === "video" || typeStr === "video_lesson") {
    return "video";
  }
  return "document";
}

function getLessonIcon(kind: "quiz" | "video" | "document") {
  if (kind === "quiz") return <QuizIcon size={16} />;
  if (kind === "video") return <VideoIcon size={16} />;
  return <DocIcon size={16} />;
}

function getLessonColor(kind: "quiz" | "video" | "document") {
  if (kind === "quiz") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (kind === "video") return "bg-indigo-100 text-indigo-800 border border-indigo-300";
  return "bg-amber-100 text-amber-800 border border-amber-300";
}

function LessonRow({
  lesson,
  chapterId,
  index,
  onUpdate,
  onDelete,
  onDetachQuiz,
  onDragStart,
  onDrop,
  onDragOver,
  onEdit,
}: {
  lesson: LessonNode;
  chapterId: string;
  index: number;
  onUpdate: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  onDelete?: (chapterId: string, lessonId: string) => void;
  onDetachQuiz?: (quizId: number) => void;
  onDragStart?: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDrop?: (e: DragEvent, targetChapterId: string, targetLessonId: string) => void;
  onDragOver?: (e: DragEvent) => void;
  onEdit?: (chapterId: string, lesson: LessonNode) => void;
}) {
  const kind = resolveLessonType(lesson);
  const isQuiz = kind === "quiz";
  const isVideo = kind === "video";

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, chapterId, lesson.id)}
      className={twMerge(
        "group flex items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 shadow-2xs hover:shadow-md",
        lesson.status === "draft"
          ? "border-amber-200 bg-amber-50/20 hover:bg-amber-50/50"
          : isQuiz
          ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/50"
          : isVideo
          ? "border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/50"
          : "border-amber-200 bg-amber-50/20 hover:bg-amber-50/50"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            onDragStart && onDragStart(e, chapterId, lesson.id);
          }}
          className="text-gray-300 group-hover:text-[#8A8478] cursor-grab active:cursor-grabbing transition-colors shrink-0 p-1 rounded hover:bg-gray-100"
          title="Giữ và kéo để sắp xếp vị trí bài học"
        >
          <GripIcon size={16} />
        </span>

        <span className={twMerge("shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-2xs", getLessonColor(kind))}>
          {getLessonIcon(kind)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className={twMerge(
              "text-xs font-bold truncate",
              isQuiz ? "text-emerald-950 font-black" : isVideo ? "text-indigo-950 font-black" : "text-amber-950 font-black"
            )}>
              {index + 1}. {lesson.title}
            </span>

            <span className={twMerge(
              "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border shrink-0",
              isQuiz
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : isVideo
                ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                : "bg-amber-100 text-amber-800 border-amber-200"
            )}>
              {isQuiz ? "📝 Bài thi Trắc nghiệm / AI Quiz" : isVideo ? "🎥 Video" : "📄 Tài liệu"}
            </span>

            {isQuiz && lesson.position && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-white text-emerald-700 rounded border border-emerald-200 shrink-0">
                {lesson.position === "after_lesson" ? "Sau bài học" : lesson.position === "in_module" ? "Trong Module" : "Cuối khóa"}
              </span>
            )}
          </div>

          {isQuiz && (
            <div className="flex items-center gap-3 text-[11px] font-medium text-emerald-700 mt-0.5">
              <span>⏱️ Thời lượng: {lesson.time_limit_minutes || 15} phút</span>
              <span>🎯 Đạt: {lesson.passing_score || 70}%</span>
              {Boolean(lesson.total_questions && lesson.total_questions > 0) && <span>❓ {lesson.total_questions} câu hỏi</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onEdit && (
          <button
            type="button"
            onClick={() => {
              if (isQuiz) {
                onEdit(chapterId, {
                  ...lesson,
                  type: "quiz",
                  quiz_id: lesson.quiz_id || (typeof lesson.id === "string" && lesson.id.startsWith("quiz-") ? Number(lesson.id.replace("quiz-", "")) : typeof lesson.id === "number" ? lesson.id : undefined)
                });
              } else {
                onEdit(chapterId, lesson);
              }
            }}
            className={twMerge(
              "px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs",
              isQuiz
                ? "text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
                : isVideo
                ? "text-indigo-800 bg-indigo-100 hover:bg-indigo-200 border-indigo-300"
                : "text-amber-800 bg-amber-100 hover:bg-amber-200 border-amber-300"
            )}
            title="Xem & Chỉnh sửa chi tiết"
          >
            <span>👁 Xem &amp; Sửa</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            const quizId = lesson.quiz_id || (typeof lesson.id === "string" && lesson.id.startsWith("quiz-") ? Number(lesson.id.replace("quiz-", "")) : null);
            if (isQuiz && quizId && onDetachQuiz) {
              onDetachQuiz(quizId);
            } else if (onDelete) {
              onDelete(chapterId, lesson.id);
            }
          }}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title={isQuiz ? "Gỡ bài thi khỏi khóa học" : "Xóa bài học"}
        >
          <TrashIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export function Step2CourseStructure({ courseId }: { courseId?: string }) {
  const router = useRouter();

  // API Hooks for existing course edit
  const { data: apiModules, isLoading: isLoadingModules, refetch: refetchModules } = useCourseModules(courseId || "");
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const createQuizMutation = useCreateQuiz();
  const reorderModuleItemsMutation = useReorderModuleItems();

  // Local state for instant reorder & module editing
  const [localChapters, setLocalChapters] = useState<any[]>([]);
  const [courseLevelQuizzes, setCourseLevelQuizzes] = useState<any[]>([]);

  // Collapse / Expand state for Modules
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  const refetchCourseQuizzes = useCallback(() => {
    if (courseId) {
      quizGeneratorApi
        .getQuizzes(Number(courseId))
        .then((res) => {
          if (res?.data && Array.isArray(res.data)) {
            setCourseLevelQuizzes(res.data);
          }
        })
        .catch(() => setCourseLevelQuizzes([]));
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId && apiModules) {
      setLocalChapters(
        apiModules.map((m: any) => ({
          id: String(m.id),
          title: m.title,
          lessons: [...(m.items || m.lessons || [])],
        }))
      );
    }
    refetchCourseQuizzes();
  }, [courseId, apiModules, refetchCourseQuizzes]);

  // Mode B: Creating new course draft via Zustand
  const {
    chapters: draftChapters,
    validationError,
    addChapter: addDraftChapter,
    updateChapterTitle: updateDraftChapterTitle,
    deleteChapter: deleteDraftChapter,
    addLesson: addDraftLesson,
    updateLesson: updateDraftLesson,
    deleteLesson: deleteDraftLesson,
    moveLesson: moveDraftLesson,
  } = useCourseStructure("draft");

  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: LessonNode } | null>(null);
  const [dragSource, setDragSource] = useState<{ chapterId: string; lessonId: string } | null>(null);

  // Embedded Quiz Modals State
  const [aiQuizModal, setAiQuizModal] = useState<{
    isOpen: boolean;
    moduleId?: string;
    position?: "capability_assessment" | "end_of_course";
  }>({ isOpen: false });
  const [manualQuizModal, setManualQuizModal] = useState<{ isOpen: boolean; moduleId?: string }>({ isOpen: false });
  
  // Select Quiz Popup Modal State for Course-Level Quizzes
  const [selectQuizModal, setSelectQuizModal] = useState<{
    isOpen: boolean;
    position: "capability_assessment" | "end_of_course";
  }>({
    isOpen: false,
    position: "capability_assessment",
  });

  const handleDetachQuiz = async (quizId: number) => {
    if (!confirm("Bạn có chắc chắn muốn gỡ bài kiểm tra này khỏi khóa học?")) return;
    try {
      await quizGeneratorApi.deleteQuiz(quizId, true);
      alert("Đã gỡ bài kiểm tra khỏi khóa học thành công!");
      if (courseId) {
        refetchModules();
        refetchCourseQuizzes();
      }
    } catch (err: any) {
      alert("Không thể gỡ bài kiểm tra: " + (err?.response?.data?.message || err.message));
    }
  };

  const handleSetActiveQuiz = async (quizId: number, position: string) => {
    if (!courseId) return;
    try {
      await quizGeneratorApi.setActiveQuiz(quizId, Number(courseId), position);
      refetchCourseQuizzes();
      refetchModules();
    } catch (err: any) {
      alert("Không thể chọn bài thi chính: " + (err?.message || "Lỗi máy chủ"));
    }
  };

  const generalQuizzes = useMemo(() => {
    return courseLevelQuizzes.filter((q) => {
      const pos = q.position || q.attachments?.[0]?.position;
      return pos === "capability_assessment" || q.type === "capability_assessment";
    });
  }, [courseLevelQuizzes]);

  const finalQuizzes = useMemo(() => {
    return courseLevelQuizzes.filter((q) => {
      const pos = q.position || q.attachments?.[0]?.position;
      return pos === "end_of_course" && q.type !== "capability_assessment";
    });
  }, [courseLevelQuizzes]);

  // Determine active quizzes (ONLY display the active quiz in each section)
  const activeGeneralQuiz = useMemo(() => {
    return generalQuizzes.find((q) => q.is_active) || generalQuizzes[0] || null;
  }, [generalQuizzes]);

  const activeFinalQuiz = useMemo(() => {
    return finalQuizzes.find((q) => q.is_active) || finalQuizzes[0] || null;
  }, [finalQuizzes]);

  const handleAddChapter = async (defaultTitle?: string) => {
    const title = defaultTitle || `Chuyên đề ${displayChapters.length + 1}: Nội dung mới`;
    if (courseId) {
      try {
        await createModuleMutation.mutateAsync({
          courseId,
          title,
          order: displayChapters.length,
        });
        await refetchModules();
      } catch (err: any) {
        alert("Không thể tạo chuyên đề: " + (err?.message || "Lỗi máy chủ"));
      }
    } else {
      addDraftChapter(title);
    }
  };

  // 1. Instant local title change (prevents 404 on keystroke & provides 0ms latency)
  const handleLocalModuleTitleChange = (chapterId: string, newTitle: string) => {
    if (courseId) {
      setLocalChapters((prev) =>
        prev.map((chap) => (chap.id === chapterId ? { ...chap, title: newTitle } : chap))
      );
    } else {
      updateDraftChapterTitle(chapterId, newTitle);
    }
  };

  // 2. Safe API sync onBlur when user finishes editing
  const handleSaveModuleTitleOnBlur = async (chapterId: string, newTitle: string) => {
    if (!courseId) return;
    const numId = Number(chapterId);
    if (isNaN(numId) || numId <= 0) return; // Ignore virtual/string IDs like final-assessment-module

    try {
      await updateModuleMutation.mutateAsync({
        courseId,
        moduleId: numId,
        title: newTitle,
      });
    } catch (err: any) {
      console.error("Lỗi cập nhật tên chuyên đề:", err);
    }
  };

  const displayChapters = (courseId && apiModules) ? localChapters : draftChapters;

  // Collapse / Expand Toggles
  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const areAllCollapsed = useMemo(() => {
    return displayChapters.length > 0 && displayChapters.every((c: any) => collapsedModules[c.id]);
  }, [displayChapters, collapsedModules]);

  const toggleCollapseAll = () => {
    const targetState = !areAllCollapsed;
    const nextState: Record<string, boolean> = {};
    displayChapters.forEach((c: any) => {
      nextState[c.id] = targetState;
    });
    setCollapsedModules(nextState);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chuyên đề này và tất cả các bài học bên trong?")) return;
    if (courseId) {
      try {
        await deleteModuleMutation.mutateAsync({ courseId, moduleId: chapterId });
        await refetchModules();
      } catch (err: any) {
        alert("Không thể xóa chuyên đề: " + (err?.message || "Lỗi máy chủ"));
      }
    } else {
      deleteDraftChapter(chapterId);
    }
  };

  const handleAddVideoLesson = async (chapterId: string, currentCount: number) => {
    if (courseId) {
      try {
        const created = await createLessonMutation.mutateAsync({
          courseId,
          moduleId: chapterId,
          payload: {
            title: `Bài học ${currentCount + 1}: Video bài giảng mới`,
            type: "video",
            order: currentCount,
            status: "draft",
          },
        });
        await refetchModules();
        setEditingLesson({ chapterId, lesson: { ...created, type: "video" } });
      } catch (err: any) {
        alert("Không thể thêm bài học video: " + (err?.message || "Lỗi máy chủ"));
      }
    } else {
      addDraftLesson(chapterId, `Bài học ${currentCount + 1}: Video bài giảng mới`, "video");
      const state = useCreateCourseStore.getState();
      const targetMod = state.modules.find((m) => m.id === chapterId);
      if (targetMod && targetMod.lessons.length > 0) {
        const newlyCreatedLesson = targetMod.lessons[targetMod.lessons.length - 1];
        setEditingLesson({
          chapterId,
          lesson: newlyCreatedLesson as any,
        });
      }
    }
  };

  const handleAddQuizLesson = (chapterId: string, _currentCount: number, isAi: boolean = false) => {
    if (isAi) {
      setAiQuizModal({ isOpen: true, moduleId: String(chapterId) });
    } else {
      setManualQuizModal({ isOpen: true, moduleId: String(chapterId) });
    }
  };

  const handleAddDocLesson = async (chapterId: string, currentCount: number) => {
    if (courseId) {
      try {
        const created = await createLessonMutation.mutateAsync({
          courseId,
          moduleId: chapterId,
          payload: {
            title: `Tài liệu đọc #${currentCount + 1}`,
            type: "article",
            order: currentCount,
            status: "draft",
          },
        });
        await refetchModules();
        setEditingLesson({ chapterId, lesson: { ...created, type: "document" } });
      } catch (err: any) {
        alert("Không thể thêm tài liệu: " + (err?.message || "Lỗi máy chủ"));
      }
    } else {
      addDraftLesson(chapterId, `Tài liệu đọc #${currentCount + 1}`, "document");
      const state = useCreateCourseStore.getState();
      const targetMod = state.modules.find((m) => m.id === chapterId);
      if (targetMod && targetMod.lessons.length > 0) {
        const newlyCreatedLesson = targetMod.lessons[targetMod.lessons.length - 1];
        setEditingLesson({
          chapterId,
          lesson: newlyCreatedLesson as any,
        });
      }
    }
  };

  const handleDeleteLesson = async (chapterId: string, lessonId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài học này?")) return;
    if (courseId) {
      try {
        await deleteLessonMutation.mutateAsync({ courseId, lessonId });
        await refetchModules();
      } catch (err: any) {
        alert("Không thể xóa bài học: " + (err?.message || "Lỗi máy chủ"));
      }
    } else {
      deleteDraftLesson(chapterId, lessonId);
    }
  };

  const handleSaveLesson = async (lessonId: string, updates: any) => {
    if (courseId && editingLesson) {
      const isQuizItem =
        editingLesson.lesson.type === "quiz" ||
        (editingLesson.lesson as any).item_type === "quiz" ||
        (typeof lessonId === "string" && lessonId.startsWith("quiz-")) ||
        Boolean((editingLesson.lesson as any).quiz_id);

      try {
        if (!isQuizItem) {
          await updateLessonMutation.mutateAsync({
            courseId,
            lessonId,
            payload: updates,
          });
          if (updates.quizData) {
            await createQuizMutation.mutateAsync({
              lessonId,
              payload: updates.quizData,
            });
          }
        }
        await refetchModules();
        refetchCourseQuizzes();
        setEditingLesson(null);
      } catch (err: any) {
        alert("Có lỗi xảy ra khi lưu: " + (err?.response?.data?.message || err?.message || "Vui lòng thử lại"));
      }
    } else if (editingLesson) {
      updateDraftLesson(editingLesson.chapterId, lessonId, updates);
      setEditingLesson(null);
    }
  };

  const handleDragStart = useCallback((e: DragEvent, chapterId: string, lessonId: string) => {
    setDragSource({ chapterId, lessonId });
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent, targetChapterId: string, targetLessonId: string) => {
      e.preventDefault();
      if (!dragSource) return;
      const { chapterId: sourceChapterId, lessonId: sourceLessonId } = dragSource;
      setDragSource(null);

      if (courseId) {
        if (sourceChapterId !== targetChapterId) return;

        setLocalChapters((prevChapters) => {
          return prevChapters.map((chap) => {
            if (chap.id !== targetChapterId) return chap;

            const lessons = [...chap.lessons];
            const fromIndex = lessons.findIndex((l) => String(l.id) === String(sourceLessonId));
            const toIndex = lessons.findIndex((l) => String(l.id) === String(targetLessonId));

            if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return chap;

            const [moved] = lessons.splice(fromIndex, 1);
            lessons.splice(toIndex, 0, moved);

            const reorderedLessons = lessons.map((item, idx) => ({
              ...item,
              order: idx + 1,
            }));

            const itemsPayload = reorderedLessons.map((item, idx) => ({
              id: item.id,
              order: idx + 1,
            }));

            reorderModuleItemsMutation
              .mutateAsync({
                courseId,
                moduleId: targetChapterId,
                items: itemsPayload,
              })
              .then(() => {
                refetchModules();
              })
              .catch((err: any) => {
                alert("Không thể cập nhật thứ tự mới: " + (err?.message || "Lỗi máy chủ"));
                refetchModules();
              });

            return {
              ...chap,
              lessons: reorderedLessons,
            };
          });
        });
      } else {
        moveDraftLesson(sourceChapterId, targetChapterId, sourceLessonId);
      }
    },
    [dragSource, courseId, moveDraftLesson, reorderModuleItemsMutation, refetchModules]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  if (courseId && isLoadingModules) {
    return <div className="p-8 text-center text-[#8A8478] font-medium">Đang nạp cấu trúc giáo trình &amp; bài thi...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-3">
          <span className="text-base">⚠️</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* KHU VỰC 2 — QUẢN LÝ QUIZ CẤP KHÓA HỌC */}
      {courseId && (
        <div className="w-full p-6 rounded-3xl bg-gradient-to-b from-[#FAF8FF] to-white border-2 border-indigo-100 shadow-xs flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base font-black shadow-xs">
                🏆
              </span>
              <h3 className="text-base font-black text-[#1A1A2E]">
                QUẢN LÝ BÀI KIỂM TRA CẤP KHÓA HỌC
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Quản lý các bài kiểm tra Đánh giá năng lực tổng quát và bài kiểm tra Cuối khóa học. Chỉ bài thi được chọn chính mới được hiển thị cho học viên.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Sub-section A: 🏆 Kiểm tra tổng quát */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs flex flex-col justify-between gap-4 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-100 pb-3 gap-2 min-h-[58px]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl shrink-0">🏆</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider truncate">
                      A. Kiểm tra tổng quát
                    </h4>
                    <span className="text-[11px] text-amber-700 font-semibold block truncate">
                      Đánh giá kiến thức tổng quan toàn khóa học
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectQuizModal({ isOpen: true, position: "capability_assessment" })}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Mở popup chọn bài kiểm tra từ danh sách"
                  >
                    <span>📑 Chọn bài thi ({generalQuizzes.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiQuizModal({ isOpen: true, position: "capability_assessment" })}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>+ Tạo mới</span>
                  </button>
                </div>
              </div>

              {/* ONLY DISPLAY THE SELECTED/ACTIVE QUIZ CARD */}
              <div className="flex-1 flex flex-col justify-center">
                {!activeGeneralQuiz ? (
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-dashed border-amber-200 text-center flex flex-col items-center justify-center gap-2 h-full">
                    <span className="text-3xl">🏆</span>
                    <p className="text-xs font-bold text-amber-900">Chưa có bài kiểm tra tổng quát nào được chọn.</p>
                    <p className="text-[11px] text-amber-700 max-w-xs">
                      Bấm nút bên dưới để chọn bài thi chính từ danh sách hoặc tạo bài thi mới.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectQuizModal({ isOpen: true, position: "capability_assessment" })}
                      className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>📑 Chọn bài thi từ danh sách</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 shadow-xs flex flex-col justify-between gap-4 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg shrink-0">🏆</span>
                        <div>
                          <h5 className="text-xs font-black text-[#1A1A2E]">{activeGeneralQuiz.title}</h5>
                          <span className="text-[10px] font-bold text-emerald-800">
                            Bài thi đang được sử dụng chính thức
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase shadow-2xs flex items-center gap-1 shrink-0">
                        <span>✓</span>
                        <span>ĐANG SỬ DỤNG</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 border-t border-emerald-200/60 pt-2.5 mt-auto">
                      <div className="flex items-center gap-3 text-emerald-900">
                        <span>❓ {activeGeneralQuiz.total_questions || activeGeneralQuiz.questions_count || 0} câu</span>
                        <span>⏱️ {activeGeneralQuiz.time_limit_minutes || 15}p</span>
                        <span>🎯 {activeGeneralQuiz.passing_score || 70}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectQuizModal({ isOpen: true, position: "capability_assessment" })}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer"
                          title="Đổi sang bài kiểm tra khác"
                        >
                          🔄 Đổi bài thi
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingLesson({ chapterId: "", lesson: { id: `quiz-${activeGeneralQuiz.id}`, quiz_id: activeGeneralQuiz.id, title: activeGeneralQuiz.title, type: "quiz" } as any })}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-black rounded-lg border border-indigo-100 transition-all cursor-pointer"
                        >
                          👁 Xem &amp; Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDetachQuiz(activeGeneralQuiz.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Gỡ khỏi khóa học"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-section B: 🏁 Kiểm tra cuối khóa học */}
            <div className="p-5 rounded-2xl bg-white border border-indigo-200/80 shadow-2xs flex flex-col justify-between gap-4 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-100 pb-3 gap-2 min-h-[58px]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl shrink-0">🏁</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider truncate">
                      B. Kiểm tra cuối khóa học
                    </h4>
                    <span className="text-[11px] text-indigo-700 font-semibold block truncate">
                      Đánh giá hoàn thành toàn bộ khóa học
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectQuizModal({ isOpen: true, position: "end_of_course" })}
                    className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Mở popup chọn bài kiểm tra từ danh sách"
                  >
                    <span>📑 Chọn bài thi ({finalQuizzes.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiQuizModal({ isOpen: true, position: "end_of_course" })}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>+ Tạo mới</span>
                  </button>
                </div>
              </div>

              {/* ONLY DISPLAY THE SELECTED/ACTIVE QUIZ CARD */}
              <div className="flex-1 flex flex-col justify-center">
                {!activeFinalQuiz ? (
                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-dashed border-indigo-200 text-center flex flex-col items-center justify-center gap-2 h-full">
                    <span className="text-3xl">🏁</span>
                    <p className="text-xs font-bold text-indigo-900">Chưa có bài kiểm tra cuối khóa nào được chọn.</p>
                    <p className="text-[11px] text-indigo-700 max-w-xs">
                      Bấm nút bên dưới để chọn bài thi chính từ danh sách hoặc tạo bài thi mới.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectQuizModal({ isOpen: true, position: "end_of_course" })}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>📑 Chọn bài thi từ danh sách</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 shadow-xs flex flex-col justify-between gap-4 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg shrink-0">🏁</span>
                        <div>
                          <h5 className="text-xs font-black text-[#1A1A2E]">{activeFinalQuiz.title}</h5>
                          <span className="text-[10px] font-bold text-emerald-800">
                            Bài thi đang được sử dụng chính thức
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase shadow-2xs flex items-center gap-1 shrink-0">
                        <span>✓</span>
                        <span>ĐANG SỬ DỤNG</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 border-t border-emerald-200/60 pt-2.5 mt-auto">
                      <div className="flex items-center gap-3 text-emerald-900">
                        <span>❓ {activeFinalQuiz.total_questions || activeFinalQuiz.questions_count || 0} câu</span>
                        <span>⏱️ {activeFinalQuiz.time_limit_minutes || 15}p</span>
                        <span>🎯 {activeFinalQuiz.passing_score || 70}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectQuizModal({ isOpen: true, position: "end_of_course" })}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer"
                          title="Đổi sang bài kiểm tra khác"
                        >
                          🔄 Đổi bài thi
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingLesson({ chapterId: "", lesson: { id: `quiz-${activeFinalQuiz.id}`, quiz_id: activeFinalQuiz.id, title: activeFinalQuiz.title, type: "quiz" } as any })}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-black rounded-lg border border-indigo-100 transition-all cursor-pointer"
                        >
                          👁 Xem &amp; Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDetachQuiz(activeFinalQuiz.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Gỡ khỏi khóa học"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters & Lessons & Quizzes Visual Tree Builder */}
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-[#2C3039]">
              Danh Sách Chuyên Đề Bài Giảng &amp; Bài Thi ({displayChapters.length})
            </h4>
            <p className="text-xs text-[#8A8478]">
              Quản lý thứ tự bài giảng video, tài liệu và các bài kiểm tra đánh giá trong giáo trình.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {displayChapters.length > 0 && (
              <button
                type="button"
                onClick={toggleCollapseAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
                title="Thu gọn hoặc mở rộng tất cả các chuyên đề"
              >
                <span>{areAllCollapsed ? "📖 Mở rộng tất cả" : "📂 Thu gọn tất cả"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleAddChapter()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
            >
              <PlusIcon size={14} />
              <span>Thêm Chuyên Đề</span>
            </button>
          </div>
        </div>

        {displayChapters.length === 0 ? (
          <NoData
            icon={<span className="text-4xl">📚</span>}
            title="Giáo trình của bạn đang chưa có chuyên đề nào."
            description="Hãy tạo chuyên đề đầu tiên để bắt đầu thêm bài học video, trắc nghiệm hoặc tài liệu."
            action={
              <button
                type="button"
                onClick={() => handleAddChapter("Chuyên đề 1: Nền tảng Core Architecture")}
                className="mt-2 px-5 py-2.5 bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                + Tạo Chuyên Đề Đầu Tiên
              </button>
            }
            className="bg-white border border-dashed border-gray-300 shadow-2xs p-14 rounded-2xl"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {displayChapters.map((chap: any, cIndex: number) => {
              const isCollapsed = Boolean(collapsedModules[chap.id]);

              return (
                <div key={chap.id} className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs flex flex-col gap-4">
                  {/* Chapter Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3.5 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Collapse / Expand Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleModuleCollapse(chap.id)}
                        className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title={isCollapsed ? "Mở rộng chuyên đề" : "Thu gọn chuyên đề"}
                      >
                        <span className={`text-xs font-black transition-transform duration-200 ${isCollapsed ? "-rotate-90 text-gray-500" : "rotate-0 text-[#C0392B]"}`}>
                          ▼
                        </span>
                      </button>

                      <span className="w-8 h-8 rounded-xl bg-[#C0392B] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                        {cIndex + 1}
                      </span>

                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <input
                          type="text"
                          value={chap.title}
                          onChange={(e) => handleLocalModuleTitleChange(chap.id, e.target.value)}
                          onBlur={(e) => handleSaveModuleTitleOnBlur(chap.id, e.target.value)}
                          className="w-full text-sm font-black text-[#2C3039] bg-transparent focus:outline-none focus:border-b-2 focus:border-[#C0392B] transition-colors truncate"
                          placeholder="Tên chuyên đề..."
                        />

                        {isCollapsed && (
                          <span
                            onClick={() => toggleModuleCollapse(chap.id)}
                            className="text-[11px] font-bold text-[#C0392B] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 cursor-pointer shrink-0"
                          >
                            📂 {chap.lessons.length} bài học
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleAddVideoLesson(chap.id, chap.lessons.length)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#C0392B] border border-indigo-100 text-xs font-bold transition-all cursor-pointer"
                      >
                        + Video
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddQuizLesson(chap.id, chap.lessons.length, true)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>🤖 + Quiz AI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddQuizLesson(chap.id, chap.lessons.length, false)}
                        className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>✍️ + Manual Quiz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddDocLesson(chap.id, chap.lessons.length)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        + Doc
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteChapter(chap.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="Xóa chuyên đề"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Lessons & Quizzes List in Chapter (Hidden when Collapsed) */}
                  {!isCollapsed && (
                    <div className="flex flex-col gap-2.5 min-h-[50px] rounded-xl p-2 bg-[#FEFCF9]/70 border border-[#E8E2D9]">
                      {chap.lessons.length === 0 ? (
                        <NoData
                          title="Chưa có bài giảng hoặc bài thi"
                          description="Chuyên đề này chưa có nội dung. Chọn + Video, + Quiz AI hoặc + Manual Quiz để thêm nội dung."
                          className="py-6"
                        />
                      ) : (
                        chap.lessons.map((les: any, lIndex: number) => (
                          <LessonRow
                            key={les.id}
                            lesson={les}
                            chapterId={chap.id}
                            index={lIndex}
                            onUpdate={(cid, lid, up) => updateDraftLesson(cid, lid, up)}
                            onDelete={handleDeleteLesson}
                            onDetachQuiz={handleDetachQuiz}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onEdit={(cid, lNode) => setEditingLesson({ chapterId: cid, lesson: lNode })}
                          />
                        ))
                      )}
                    </div>
                  )}

                  {/* AI Co-Creator Quick Action Tag */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[11px] font-bold text-gray-400 gap-1">
                    <span className="flex items-center gap-1 text-[#C0392B]">
                      ⚡ AI Generator: Tạo bộ câu hỏi trắc nghiệm tự động theo ngữ cảnh bài học của chuyên đề này.
                    </span>
                    <span>Tổng {chap.lessons.length} bài học &amp; bài thi</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingLesson && (
        <CreateLessonEditModal
          lesson={editingLesson.lesson as any}
          courseId={courseId}
          onSave={(lessonId, updates) => handleSaveLesson(lessonId, updates)}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {/* Embedded In-Page AI Quiz Generator Modal */}
      <CourseAiQuizModal
        isOpen={aiQuizModal.isOpen}
        onClose={() => setAiQuizModal({ isOpen: false })}
        courseId={courseId}
        moduleId={aiQuizModal.moduleId}
        position={aiQuizModal.position}
        onSuccessComplete={(savedQuiz) => {
          const targetModId = aiQuizModal.moduleId;
          setAiQuizModal({ isOpen: false });
          if (courseId) {
            refetchModules();
            refetchCourseQuizzes();
          } else if (targetModId) {
            const quizTitle = savedQuiz?.title || "Bài kiểm tra AI mới";
            const questions = savedQuiz?.questions || savedQuiz?.quizData?.questions || [];
            const initialQuizData = {
              title: quizTitle,
              time_limit_minutes: savedQuiz?.time_limit_minutes || 15,
              passing_score: savedQuiz?.passing_score || 70,
              questions: questions,
            };
            addDraftLesson(targetModId, quizTitle, "quiz");
            setTimeout(() => {
              const state = useCreateCourseStore.getState();
              const targetChap = state.modules.find((c: any) => c.id === targetModId);
              if (targetChap && targetChap.lessons.length > 0) {
                const newLesson = targetChap.lessons[targetChap.lessons.length - 1];
                updateDraftLesson(targetModId, newLesson.id, { quizData: initialQuizData });
              }
            }, 50);
          }
        }}
      />

      {/* Embedded In-Page Manual Quiz Creator Modal */}
      <CourseManualQuizModal
        isOpen={manualQuizModal.isOpen}
        onClose={() => setManualQuizModal({ isOpen: false })}
        courseId={courseId}
        moduleId={manualQuizModal.moduleId}
        onSuccessComplete={(savedQuiz) => {
          const targetModId = manualQuizModal.moduleId;
          setManualQuizModal({ isOpen: false });
          if (courseId) {
            refetchModules();
            refetchCourseQuizzes();
          } else if (targetModId) {
            const quizTitle = savedQuiz?.title || "Bài kiểm tra trắc nghiệm mới";
            const questions = savedQuiz?.questions || savedQuiz?.quizData?.questions || [];
            const initialQuizData = {
              title: quizTitle,
              time_limit_minutes: savedQuiz?.time_limit_minutes || 15,
              passing_score: savedQuiz?.passing_score || 70,
              questions: questions,
            };
            addDraftLesson(targetModId, quizTitle, "quiz");
            setTimeout(() => {
              const state = useCreateCourseStore.getState();
              const targetChap = state.modules.find((c: any) => c.id === targetModId);
              if (targetChap && targetChap.lessons.length > 0) {
                const newLesson = targetChap.lessons[targetChap.lessons.length - 1];
                updateDraftLesson(targetModId, newLesson.id, { quizData: initialQuizData });
              }
            }, 50);
          }
        }}
      />

      {/* Course-Level Select Quiz Modal Popup */}
      <SelectCourseLevelQuizModal
        isOpen={selectQuizModal.isOpen}
        onClose={() => setSelectQuizModal({ ...selectQuizModal, isOpen: false })}
        position={selectQuizModal.position}
        positionTitle={
          selectQuizModal.position === "capability_assessment"
            ? "Kiểm tra tổng quát"
            : "Kiểm tra cuối khóa học"
        }
        quizzes={selectQuizModal.position === "capability_assessment" ? generalQuizzes : finalQuizzes}
        activeQuizId={
          selectQuizModal.position === "capability_assessment"
            ? activeGeneralQuiz?.id
            : activeFinalQuiz?.id
        }
        onSelectActiveQuiz={handleSetActiveQuiz}
        onCreateNewQuiz={() => setAiQuizModal({ isOpen: true, position: selectQuizModal.position })}
        onEditQuiz={(quiz) =>
          setEditingLesson({
            chapterId: "",
            lesson: { id: `quiz-${quiz.id}`, quiz_id: quiz.id, title: quiz.title, type: "quiz" } as any,
          })
        }
        onDetachQuiz={handleDetachQuiz}
      />
    </div>
  );
}