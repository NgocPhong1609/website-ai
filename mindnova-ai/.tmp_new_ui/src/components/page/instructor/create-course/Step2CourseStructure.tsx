"use client";

import React, { useState, useCallback, useRef, type DragEvent, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useCourseStructure, type CoursePublishStatus, type LessonType, type ChapterNode, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { useVideoProcessing, type VideoItem } from "@/src/hooks/instructor/useVideoProcessing";

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
}

function LessonRow({ lesson, chapterId, index, onUpdate, onDelete, onDragStart, onDrop, onDragOver }: LessonRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lesson.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdate(chapterId, lesson.id, { title: trimmed });
    else setDraft(lesson.title);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setDraft(lesson.title);
      setEditing(false);
    }
  };

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
          {editing ? (
            <input
              ref={inputRef}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-xs font-bold text-gray-900 bg-white border-2 border-[#4F46E5] rounded-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs font-bold text-gray-900 truncate">
                {index + 1}. {lesson.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                {lesson.type === "video" ? "Video" : lesson.type === "quiz" ? "Trắc nghiệm" : "Tài liệu"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="px-2.5 py-1 text-xs font-extrabold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all cursor-pointer border border-indigo-200"
          >
            Sửa tên
          </button>
        )}
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
      {/* Top Banner: Status & Architecture Builder */}
      <div className="w-full p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-black text-gray-900">Xây Dựng Khai Triển Chương Trình Học</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              {versionMeta.version}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Kéo thả bài học giữa các chuyên đề linh hoạt. Điều kiện xuất bản đòi hỏi tối thiểu $\ge 1$ chuyên đề và $\ge 1$ bài giảng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <CourseStatusBadge status={status} onStatusChange={setStatus} />
          {status === "published" && (
            <button
              type="button"
              onClick={createVersionSnapshot}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
            >
              ⚡ Phát hành phiên bản mới
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-3">
          <span className="text-base">🛑</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Bulk Video Uploader Zone */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span>🎬 Bulk Video Uploader (Tải Lên Nhiều Video MP4/MOV)</span>
            {isProcessingAny && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                ⚙️ Đang mã hóa video ngầm trong hệ thống...
              </span>
            )}
          </h4>
          <span className="text-xs text-gray-500 font-medium">
            Giảng viên có thể rời trang trong khi quá trình xử lý diễn ra
          </span>
        </div>

        {uploadError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            ⚠️ {uploadError}
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropZone}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-9 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 hover:bg-indigo-50/30 hover:border-[#4F46E5] cursor-pointer transition-all flex flex-col items-center justify-center text-center group shadow-2xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/quicktime,.mp4,.mov"
            className="hidden"
            onChange={(e) => e.target.files && handleDropFiles(e.target.files)}
          />
          <div className="text-[#4F46E5] group-hover:scale-110 transition-transform mb-2">
            <UploadCloudIcon />
          </div>
          <h5 className="text-sm font-black text-gray-900">Kéo và thả tệp video MP4 hoặc MOV vào đây</h5>
          <p className="text-xs font-medium text-gray-500 max-w-md mt-1 leading-relaxed">
            Hệ thống AI tự động nén, chuyển mã video đa độ phân giải (<strong className="text-[#4F46E5]">1080p, 720p, 480p</strong>) và tạo hình thu nhỏ thông minh.
          </p>
          <button
            type="button"
            className="mt-4 px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
          >
            Chọn tệp video từ máy tính
          </button>
        </div>

        {/* Processing State Queue Visualizer */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {videos.map((vid: VideoItem) => (
              <div key={vid.id} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-black text-xs shrink-0 border border-indigo-100">
                      {vid.format.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-900 truncate" title={vid.fileName}>{vid.fileName}</p>
                      <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{vid.fileSizeMb} MB • Transcode: 1080p / 720p / 480p</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(vid.id)}
                    className="text-gray-400 hover:text-rose-600 font-black text-sm transition-colors p-1"
                    title="Xóa khỏi danh sách"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={vid.stage === "ready" ? "text-emerald-700 font-extrabold" : "text-[#4F46E5]"}>{vid.stageLabel}</span>
                    <span className="font-mono">{vid.stage === "ready" ? "100%" : `${vid.uploadProgress}%`}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={twMerge(
                        "h-full transition-all duration-300 rounded-full",
                        vid.stage === "ready" ? "bg-emerald-500" : "bg-[#4F46E5] animate-pulse"
                      )}
                      style={{ width: `${vid.stage === "ready" ? 100 : Math.max(10, vid.uploadProgress)}%` }}
                    />
                  </div>
                  {vid.resolutions.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Luồng HD đã sẵn sàng:</span>
                      {vid.resolutions.map((res) => (
                        <span key={res} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

      {/* Bottom Gate Indicator & Review Submission */}
      <div className="p-6 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-3xl">{canSubmitForReview ? "🟢" : "⚠️"}</span>
          <div>
            <h4 className="text-sm font-black text-white">Cổng Kiểm Duyệt Khóa Học MindNova</h4>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              {canSubmitForReview
                ? "✓ Cấu trúc giáo trình đạt chuẩn. Bạn đã sẵn sàng gửi phê duyệt để đưa lên sàn!"
                : "Yêu cầu bắt buộc: Thêm ít nhất 1 chuyên đề và 1 bài học để mở khóa nút gửi kiểm duyệt."}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!canSubmitForReview}
          onClick={() => {
            if (canSubmitForReview) {
              setStatus("review");
              alert("Đã gửi hồ sơ khóa học tới ban kiểm duyệt thành công!");
            }
          }}
          className={twMerge(
            "px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shrink-0 cursor-pointer",
            canSubmitForReview
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          Gửi Phê Duyệt Ngay ➔
        </button>
      </div>
    </div>
  );
}