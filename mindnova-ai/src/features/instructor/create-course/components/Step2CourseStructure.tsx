"use client";

import React, { useState, useCallback, useRef, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { NoData } from "@/src/shared/components/ui/NoData";
import { useCourseStructure, type CoursePublishStatus, type LessonType, type ChapterNode, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { useVideoProcessing } from "@/src/hooks/instructor/useVideoProcessing";
import { CreateLessonEditModal } from "./CreateLessonEditModal";
import { useCourseModules } from "@/src/features/instructor/management/api/courses";
import { quizGeneratorApi } from "@/src/features/instructor/quiz-generator/api/quizGeneratorApi";

import { CourseAiQuizModal } from "./CourseAiQuizModal";
import { CourseManualQuizModal } from "./CourseManualQuizModal";

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

function SparklesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function getLessonIcon(type: LessonType | string) {
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz") return <QuizIcon size={14} />;
  return <DocIcon size={14} />;
}

function getLessonColor(type: LessonType | string) {
  if (type === "video") return "text-[#C0392B] bg-indigo-50 border border-indigo-100";
  if (type === "quiz") return "text-emerald-700 bg-emerald-50 border border-emerald-200";
  return "text-amber-700 bg-amber-50 border border-amber-200";
}

interface LessonRowProps {
  lesson: any;
  chapterId: string;
  index: number;
  onUpdate?: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  onDelete?: (chapterId: string, lessonId: string) => void;
  onDetachQuiz?: (quizId: number) => void;
  onDragStart?: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDrop?: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDragOver?: (e: DragEvent) => void;
  onEdit?: (chapterId: string, lesson: LessonNode) => void;
}

function LessonRow({ lesson, chapterId, index, onUpdate, onDelete, onDetachQuiz, onDragStart, onDrop, onDragOver, onEdit }: LessonRowProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isQuiz = lesson.type === "quiz" || lesson.item_type === "quiz";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, chapterId, lesson.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop && onDrop(e, chapterId, lesson.id);
      }}
      onDragOver={(e) => {
        onDragOver && onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={twMerge(
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-150 select-none",
        isDragOver
          ? "border-[#C0392B] bg-indigo-50 shadow-2xs"
          : isQuiz
          ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80"
          : "border-[#E8E2D9] bg-white hover:border-gray-300 hover:bg-[#FEFCF9]/70"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-300 group-hover:text-[#8A8478] cursor-grab active:cursor-grabbing transition-colors shrink-0" title="Kéo thả để sắp xếp">
          <GripIcon size={16} />
        </span>

        <span className={twMerge("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-2xs", getLessonColor(lesson.type))}>
          {getLessonIcon(lesson.type)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className={twMerge("text-xs font-bold truncate", isQuiz ? "text-emerald-950 font-black" : "text-[#2C3039]")}>
              {index + 1}. {lesson.title}
            </span>
            <span className={twMerge("text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border shrink-0", isQuiz ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-[#8A8478] border-[#E8E2D9]")}>
              {isQuiz ? "📝 Bài thi Trắc nghiệm / AI Quiz" : lesson.type === "video" ? "Video" : "Tài liệu"}
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
              {lesson.total_questions > 0 && <span>❓ {lesson.total_questions} câu hỏi</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isQuiz ? (
          <>
            <button
              type="button"
              onClick={() => {
                const realQuizId = lesson.quiz_id || (typeof lesson.id === "string" && lesson.id.startsWith("quiz-") ? Number(lesson.id.replace("quiz-", "")) : null);
                if (realQuizId) {
                  window.open(`/instructor/quiz-generator?quiz_id=${realQuizId}`, '_blank');
                }
              }}
              className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-all cursor-pointer border border-emerald-300 flex items-center gap-1"
              title="Xem & Chỉnh sửa Quiz"
            >
              <span>👁 Xem &amp; Sửa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const quizId = lesson.quiz_id || (typeof lesson.id === "string" && lesson.id.startsWith("quiz-") ? Number(lesson.id.replace("quiz-", "")) : null);
                if (quizId && onDetachQuiz) {
                  onDetachQuiz(quizId);
                }
              }}
              className="px-2.5 py-1 text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-all cursor-pointer border border-rose-200 flex items-center gap-1"
              title="Gỡ bài thi khỏi khóa học"
            >
              <span>🗑 Gỡ</span>
            </button>
          </>
        ) : (
          <>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(chapterId, lesson)}
                className="px-2.5 py-1 text-xs font-extrabold text-[#C0392B] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all cursor-pointer border border-indigo-100"
              >
                Chỉnh sửa
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(chapterId, lesson.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                title="Xóa bài học"
              >
                <TrashIcon size={15} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Step2CourseStructure({ courseId }: { courseId?: string }) {
  const router = useRouter();

  // Mode A: Editing existing course via API
  const { data: apiModules, isLoading: isLoadingModules, refetch: refetchModules } = useCourseModules(courseId || "");

  // Mode B: Creating new course draft via Zustand
  const {
    chapters: draftChapters,
    validationError,
    addChapter,
    updateChapterTitle,
    deleteChapter,
    addLesson,
    updateLesson,
    deleteLesson,
    moveLesson,
  } = useCourseStructure("draft");

  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: LessonNode } | null>(null);
  const [dragSource, setDragSource] = useState<{ chapterId: string; lessonId: string } | null>(null);

  // Embedded Quiz Modals State
  const [aiQuizModal, setAiQuizModal] = useState<{ isOpen: boolean; moduleId?: string }>({ isOpen: false });
  const [manualQuizModal, setManualQuizModal] = useState<{ isOpen: boolean; moduleId?: string }>({ isOpen: false });

  const handleDetachQuiz = async (quizId: number) => {
    if (!confirm("Bạn có chắc chắn muốn gỡ bài kiểm tra này khỏi khóa học?")) return;
    try {
      await quizGeneratorApi.deleteQuiz(quizId, true);
      alert("Đã gỡ bài kiểm tra khỏi khóa học thành công!");
      if (courseId) {
        refetchModules();
      }
    } catch (err: any) {
      alert("Không thể gỡ bài kiểm tra: " + (err?.response?.data?.message || err.message));
    }
  };

  const handleDragStart = useCallback((e: DragEvent, chapterId: string, lessonId: string) => {
    setDragSource({ chapterId, lessonId });
  }, []);

  const handleDrop = useCallback((e: DragEvent, targetChapterId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!dragSource) return;
    moveLesson(dragSource.chapterId, targetChapterId, dragSource.lessonId);
    setDragSource(null);
  }, [dragSource, moveLesson]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  // Determine active chapters data (from API if edit mode, or from draft store)
  const displayChapters = (courseId && apiModules)
    ? apiModules.map((m: any) => ({
        id: String(m.id),
        title: m.title,
        lessons: m.items || m.lessons || [],
      }))
    : draftChapters;

  if (courseId && isLoadingModules) {
    return <div className="p-8 text-center text-[#8A8478] font-medium">Đang nạp cấu trúc giáo trình & bài thi...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-3">
          <span className="text-base">⚠️</span>
          <span>{validationError}</span>
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAiQuizModal({ isOpen: true, moduleId: displayChapters[0]?.id })}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
            >
              <SparklesIcon size={14} />
              <span>Tạo Quiz AI / Manual</span>
            </button>

            <button
              type="button"
              onClick={() => addChapter(`Chuyên đề ${displayChapters.length + 1}: Bổ trợ thực hành nâng cao`)}
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
                onClick={() => addChapter("Chuyên đề 1: Nền tảng Core Architecture")}
                className="mt-2 px-5 py-2.5 bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                + Tạo Chuyên Đề Đầu Tiên
              </button>
            }
            className="bg-white border border-dashed border-gray-300 shadow-2xs p-14 rounded-2xl"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {displayChapters.map((chap: any, cIndex: number) => (
              <div key={chap.id} className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs flex flex-col gap-4">
                {/* Chapter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3.5 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-[#C0392B] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {cIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => updateChapterTitle(chap.id, e.target.value)}
                        className="w-full text-sm font-black text-[#2C3039] bg-transparent focus:outline-none focus:border-b-2 focus:border-[#C0392B] transition-colors truncate"
                        placeholder="Tên chuyên đề..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Bài học ${chap.lessons.length + 1}: Phân tích & Thực hành`, "video")}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#C0392B] border border-indigo-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Video
                    </button>

                    <button
                      type="button"
                      onClick={() => setAiQuizModal({ isOpen: true, moduleId: String(chap.id) })}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>🤖 + Quiz AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setManualQuizModal({ isOpen: true, moduleId: String(chap.id) })}
                      className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>✍️ + Manual Quiz</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Tài liệu đọc #${chap.lessons.length + 1}`, "document")}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Doc
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteChapter(chap.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Xóa chuyên đề"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Lessons & Quizzes List in Chapter */}
                <div className="flex flex-col gap-2.5 min-h-[50px] rounded-xl p-2 bg-[#FEFCF9]/70 border border-[#E8E2D9]">
                  {chap.lessons.length === 0 ? (
                    <NoData
                      title="Chưa có bài giảng hoặc bài thi"
                      description="Chuyên đề này chưa có nội dung. Chọn + Video hoặc + Quiz AI để thêm nội dung."
                      className="py-6"
                    />
                  ) : (
                    chap.lessons.map((les: any, lIndex: number) => (
                      <LessonRow
                        key={les.id}
                        lesson={les}
                        chapterId={chap.id}
                        index={lIndex}
                        onUpdate={updateLesson}
                        onDelete={deleteLesson}
                        onDetachQuiz={handleDetachQuiz}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onEdit={(cid, lNode) => setEditingLesson({ chapterId: cid, lesson: lNode })}
                      />
                    ))
                  )}
                </div>

                {/* AI Co-Creator Quick Action Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[11px] font-bold text-gray-400 gap-1">
                  <span className="flex items-center gap-1 text-[#C0392B]">
                    ⚡ AI Generator: Tạo bộ câu hỏi trắc nghiệm tự động theo ngữ cảnh bài học của chuyên đề này.
                  </span>
                  <span>Tổng {chap.lessons.length} bài học &amp; bài thi</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingLesson && (
        <CreateLessonEditModal
          lesson={editingLesson.lesson as any}
          onSave={(lessonId, updates) => {
            updateLesson(editingLesson.chapterId, lessonId, updates);
            setEditingLesson(null);
          }}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {/* Embedded In-Page AI Quiz Generator Modal */}
      <CourseAiQuizModal
        isOpen={aiQuizModal.isOpen}
        onClose={() => setAiQuizModal({ isOpen: false })}
        courseId={courseId}
        moduleId={aiQuizModal.moduleId}
        onSuccessComplete={(savedQuiz) => {
          const targetModId = aiQuizModal.moduleId;
          setAiQuizModal({ isOpen: false });
          if (courseId) {
            refetchModules();
          } else if (targetModId) {
            addLesson(targetModId, savedQuiz?.title || "Bài kiểm tra mới", "quiz");
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
          } else if (targetModId) {
            addLesson(targetModId, savedQuiz?.title || "Bài kiểm tra mới", "quiz");
          }
        }}
      />
    </div>
  );
}