"use client";

import React, { useState, useCallback, useRef, type DragEvent, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useCourseStructure, type CoursePublishStatus, type LessonType, type ChapterNode, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { useVideoProcessing, type VideoItem } from "@/src/hooks/instructor/useVideoProcessing";
import { CreateLessonEditModal } from "./CreateLessonEditModal";

function GripIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function VideoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function QuizIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="13" height="4" rx="1" />
      <rect x="9" y="10" width="13" height="4" rx="1" />
      <rect x="9" y="18" width="13" height="4" rx="1" />
      <line x1="2" y1="4" x2="7" y2="4" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="2" y1="20" x2="7" y2="20" />
    </svg>
  );
}

function DocIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function UploadCloudIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-.5C16.3 5.3 14.3 3.6 12 3.6c-3 0-5.5 2.5-5.5 5.5v.5C4.5 9.7 3 11.6 3 13.7c0 2.5 2 4.5 4.5 4.5h13.7" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

function getLessonIcon(type: LessonType) {
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz") return <QuizIcon size={14} />;
  return <DocIcon size={14} />;
}

function getLessonColor(type: LessonType) {
  if (type === "video") return "text-[#4F46E5] bg-indigo-50 border border-indigo-100";
  if (type === "quiz") return "text-emerald-700 bg-emerald-50 border border-emerald-200";
  return "text-amber-700 bg-amber-50 border border-amber-200";
}

function CourseStatusBadge({ status, onStatusChange }: { status: CoursePublishStatus; onStatusChange: (s: CoursePublishStatus) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Trang Thái:</span>
      <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
        <button
          type="button"
          onClick={() => onStatusChange("draft")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "draft" ? "bg-gray-800 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Draft
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("review")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "review" ? "bg-amber-500 text-white shadow-2xs" : "text-amber-700 hover:bg-amber-50"
          )}
        >
          Under Review
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("published")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer",
            status === "published" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-700 hover:bg-emerald-50"
          )}
        >
          Published ✓
        </button>
      </div>
    </div>
  );
}

interface LessonRowProps {
  lesson: LessonNode;
  chapterId: string;
  index: number;
  onUpdate: (chapterId: string, lessonId: string, updates: Partial<LessonNode>) => void;
  onDelete: (chapterId: string, lessonId: string) => void;
  onDragStart: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDrop: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDragOver: (e: DragEvent) => void;
  onEdit: (chapterId: string, lesson: LessonNode) => void;
}

function LessonRow({ lesson, chapterId, index, onUpdate, onDelete, onDragStart, onDrop, onDragOver, onEdit }: LessonRowProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, chapterId, lesson.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, chapterId, lesson.id);
      }}
      onDragOver={(e) => {
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={twMerge(
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-150 select-none",
        isDragOver
          ? "border-[#4F46E5] bg-indigo-50 shadow-2xs"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-300 group-hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors shrink-0" title="Kéo thả để sắp xếp">
          <GripIcon size={16} />
        </span>

        <span className={twMerge("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-2xs", getLessonColor(lesson.type))}>
          {getLessonIcon(lesson.type)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-bold text-gray-900 truncate">
              {index + 1}. {lesson.title}
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
              {lesson.type === "video" ? "Video" : lesson.type === "quiz" ? "Trắc nghiệm" : "Tài liệu"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(chapterId, lesson)}
          className="px-2.5 py-1 text-xs font-extrabold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all cursor-pointer border border-indigo-200"
        >
          Chỉnh sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(chapterId, lesson.id)}
          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
          title="Xóa bài học"
        >
          <TrashIcon size={15} />
        </button>
      </div>
    </div>
  );
}

export function Step2CourseStructure() {
  const {
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
    createVersionSnapshot,
  } = useCourseStructure("draft");

  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: LessonNode } | null>(null);
  const { videos, isProcessingAny, uploadError, handleDropFiles, removeVideo } = useVideoProcessing();
  const [dragSource, setDragSource] = useState<{ chapterId: string; lessonId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onDropZone = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleDropFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">


      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-3">
          <span className="text-base">🛑</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Chapters & Lessons Visual Tree Builder */}
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-gray-900">Danh Sách Chuyên Đề Bài Giảng ({chapters.length})</h4>
            <p className="text-xs text-gray-500">Mỗi chuyên đề đánh dấu một giai đoạn kiến thức trong giáo trình của bạn.</p>
          </div>
          <button
            type="button"
            onClick={() => addChapter(`Chuyên đề ${chapters.length + 1}: Bổ trợ thực hành nâng cao`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer w-fit shrink-0"
          >
            <PlusIcon size={14} />
            <span>Thêm Chuyên Đề Mới</span>
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="p-14 rounded-2xl bg-white border border-dashed border-gray-300 text-center flex flex-col items-center gap-2.5 text-gray-500 shadow-2xs">
            <span className="text-4xl">📚</span>
            <p className="text-sm font-black text-gray-900">Giáo trình của bạn đang chưa có chuyên đề nào.</p>
            <p className="text-xs max-w-sm">Hãy tạo chuyên đề đầu tiên để bắt đầu thêm bài học video, trắc nghiệm hoặc tài liệu.</p>
            <button
              type="button"
              onClick={() => addChapter("Chuyên đề 1: Nền tảng Core Architecture")}
              className="mt-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              + Tạo Chuyên Đề Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {chapters.map((chap: ChapterNode, cIndex: number) => (
              <div key={chap.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
                {/* Chapter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3.5 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {cIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => updateChapterTitle(chap.id, e.target.value)}
                        className="w-full text-sm font-black text-gray-900 bg-transparent focus:outline-none focus:border-b-2 focus:border-[#4F46E5] transition-colors truncate"
                        placeholder="Tên chuyên đề..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Bài học ${chap.lessons.length + 1}: Phân tích & Thực hành`, "video")}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Thêm Video
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Trắc nghiệm ôn tập #${chap.lessons.length + 1}`, "quiz")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Thêm Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Tài liệu đọc #${chap.lessons.length + 1}`, "document")}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      + Thêm Doc
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChapter(chap.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-all cursor-pointer ml-1"
                      title="Xóa chuyên đề"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Lessons List in Chapter */}
                <div className="flex flex-col gap-2.5 min-h-[50px] rounded-xl p-2 bg-gray-50/70 border border-gray-200">
                  {chap.lessons.length === 0 ? (
                    <p className="text-center text-xs font-bold text-gray-400 py-6">
                      Chuyên đề này chưa có bài giảng. Nhấn <strong className="text-[#4F46E5]">+ Thêm Video</strong> để xây dựng chi tiết.
                    </p>
                  ) : (
                    chap.lessons.map((les: LessonNode, lIndex: number) => (
                      <LessonRow
                        key={les.id}
                        lesson={les}
                        chapterId={chap.id}
                        index={lIndex}
                        onUpdate={updateLesson}
                        onDelete={deleteLesson}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onEdit={(cid, les) => setEditingLesson({ chapterId: cid, lesson: les })}
                      />
                    ))
                  )}
                </div>

                {/* AI Co-Creator Quick Action Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-[11px] font-bold text-gray-400 gap-1">
                  <span className="flex items-center gap-1 text-[#4F46E5]">
                    ✨ Trợ lý AI: Sẵn sàng phân tích transcript video &amp; tự động tạo câu hỏi trắc nghiệm đánh giá cho chuyên đề này.
                  </span>
                  <span>Tổng {chap.lessons.length} bài học</span>
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
    </div>
  );
}