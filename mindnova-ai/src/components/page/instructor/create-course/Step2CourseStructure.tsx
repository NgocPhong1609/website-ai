"use client";

import React, { useState, useCallback, useRef, type DragEvent, type KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import { useCourseStructure, type CoursePublishStatus, type LessonType, type ChapterNode, type LessonNode } from "@/src/hooks/instructor/useCourseStructure";
import { useVideoProcessing, type VideoItem } from "@/src/hooks/instructor/useVideoProcessing";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

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
  if (type === "video") return "text-[#4648D4] bg-[#EEEEFF]";
  if (type === "quiz") return "text-[#059669] bg-[#ECFDF5]";
  return "text-[#D97706] bg-[#FFFBEB]";
}

// ─── Status Badge Component (Section 1.1) ─────────────────────────────────────

function CourseStatusBadge({ status, onStatusChange }: { status: CoursePublishStatus; onStatusChange: (s: CoursePublishStatus) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Publish State:</span>
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200">
        <button
          type="button"
          onClick={() => onStatusChange("draft")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer",
            status === "draft" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Draft
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("review")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer",
            status === "review" ? "bg-amber-500 text-white shadow-sm" : "text-amber-700 hover:bg-amber-50"
          )}
        >
          Under Review
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("published")}
          className={twMerge(
            "px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer",
            status === "published" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-700 hover:bg-emerald-50"
          )}
        >
          Published ✓
        </button>
      </div>
    </div>
  );
}

// ─── Lesson Row with Inline Editing & Dnd ────────────────────────────────────

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
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all duration-150 select-none",
        isDragOver
          ? "border-[#6B6BFF] bg-[#F0F0FF] shadow-[0_0_0_2px_rgba(107,107,255,0.2)]"
          : "border-[#EAEAF4] bg-white hover:border-[#D5D5FF] hover:bg-[#FAFAFE]"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-[#C8C8E0] group-hover:text-[#6B6BFF] cursor-grab active:cursor-grabbing transition-colors shrink-0" title="Drag to reorder lesson">
          <GripIcon size={16} />
        </span>

        <span className={twMerge("shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-xs", getLessonColor(lesson.type))}>
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
              className="w-full text-sm font-bold text-[#1A1A2E] bg-white border-2 border-[#6B6BFF] rounded-lg px-2 py-1 focus:outline-none"
            />
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm font-bold text-[#1A1A2E] truncate">
                {index + 1}. {lesson.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                {lesson.type}
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
            className="px-2.5 py-1 text-xs font-extrabold text-[#5153DF] bg-[#EEEEFF] hover:bg-[#D5D5FF] rounded-lg transition-all"
          >
            Inline Edit
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(chapterId, lesson.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete Lesson"
        >
          <TrashIcon size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Step2CourseStructure Component ──────────────────────────────────────

export function Step2CourseStructure() {
  // Integrate custom hooks (Rule #2 & #3)
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

  // Drag handlers
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
    <div className="w-full flex flex-col gap-10">
      {/* Top Banner: Status Indicators & Version Control (Section 1.1) */}
      <div className="w-full p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-extrabold text-[#1A1A2E]">Curriculum Architecture Builder</h3>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F0F0FF] text-[#5153DF] border border-[#D5D5FF]">
              {versionMeta.version}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Drag and drop lessons across chapters effortlessly. Publish state requires $\ge 1$ chapter and $\ge 1$ lesson.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <CourseStatusBadge status={status} onStatusChange={setStatus} />
          {status === "published" && (
            <button
              type="button"
              onClick={createVersionSnapshot}
              className="px-4 py-2 bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-white rounded-xl text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
            >
              ⚡ Publish Version Update
            </button>
          )}
        </div>
      </div>

      {/* Validation Error Gate Notice */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 font-bold text-sm flex items-center gap-3">
          <span className="text-xl">🛑</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Bulk Video Uploader & Asynchronous Processing Zone (Section 1.2) */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-extrabold text-[#1A1A2E] flex items-center gap-2">
            <span>🎬 Bulk Video Uploader (MP4, MOV)</span>
            {isProcessingAny && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                ⚙️ Asynchronous processing active in background
              </span>
            )}
          </h4>
          <span className="text-xs text-gray-500 font-semibold">
            Instructors can leave this page while backend transcoding continues!
          </span>
        </div>

        {uploadError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            ⚠️ {uploadError}
          </div>
        )}

        {/* Large Dropzone Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropZone}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-10 rounded-3xl border-2 border-dashed border-[#B0B0E0] bg-[#F8F9FF] hover:bg-[#F0F2FF] hover:border-[#6B6BFF] cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/quicktime,.mp4,.mov"
            className="hidden"
            onChange={(e) => e.target.files && handleDropFiles(e.target.files)}
          />
          <div className="text-[#6B6BFF] group-hover:scale-110 transition-transform mb-3">
            <UploadCloudIcon />
          </div>
          <h5 className="text-base font-bold text-[#1A1A2E]">Drag &amp; drop MP4 or MOV video streams here</h5>
          <p className="text-xs font-medium text-gray-500 max-w-md mt-1">
            System automatically manages raw stream compression, transcoding to multiple resolutions (<strong className="text-[#5153DF]">1080p, 720p, 480p</strong>), and background thumbnail generation.
          </p>
          <button
            type="button"
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#1A1A2E] text-white text-xs font-extrabold shadow-md group-hover:bg-[#4648D4] transition-colors"
          >
            Select Bulk Files
          </button>
        </div>

        {/* Processing State Queue Visualizer */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {videos.map((vid: VideoItem) => (
              <div key={vid.id} className="p-5 rounded-2xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                      {vid.format.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A1A2E] truncate" title={vid.fileName}>{vid.fileName}</p>
                      <p className="text-[11px] font-semibold text-gray-400">{vid.fileSizeMb} MB • Transcode Target: 1080p / 720p / 480p</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(vid.id)}
                    className="text-gray-400 hover:text-red-500 font-black text-sm transition-colors"
                    title="Remove from processing queue"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar & Status Tag */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={vid.stage === "ready" ? "text-emerald-600" : "text-[#5153DF]"}>{vid.stageLabel}</span>
                    <span>{vid.stage === "ready" ? "100%" : `${vid.uploadProgress}%`}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={twMerge(
                        "h-full transition-all duration-300 rounded-full",
                        vid.stage === "ready" ? "bg-emerald-500" : "bg-gradient-to-r from-[#6B6BFF] to-[#F368E0] animate-pulse"
                      )}
                      style={{ width: `${vid.stage === "ready" ? 100 : Math.max(10, vid.uploadProgress)}%` }}
                    />
                  </div>
                  {vid.resolutions.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase">Available Streams:</span>
                      {vid.resolutions.map((res) => (
                        <span key={res} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
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
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-extrabold text-[#1A1A2E]">Curriculum Modules ({chapters.length})</h4>
            <p className="text-xs text-gray-500">Each module represents an architectural milestone in the syllabus.</p>
          </div>
          <button
            type="button"
            onClick={() => addChapter(`Module ${chapters.length + 1}: Advanced Technical Application`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4648D4] text-white text-xs font-extrabold shadow-md hover:bg-[#3B3DB8] transition-all"
          >
            <PlusIcon size={14} />
            <span>Add New Module</span>
          </button>
        </div>

        {chapters.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#F8F9FF] border border-dashed border-gray-300 text-center flex flex-col items-center gap-3 text-gray-500">
            <span className="text-4xl">📚</span>
            <p className="text-sm font-bold text-[#1A1A2E]">Your curriculum tree is empty.</p>
            <p className="text-xs max-w-sm">Remember: A course must contain at least one chapter and one lesson before submitting for review.</p>
            <button
              type="button"
              onClick={() => addChapter("Module 1: Architecture Foundations")}
              className="mt-2 px-6 py-2.5 bg-[#6B6BFF] text-white text-xs font-extrabold rounded-xl shadow-md"
            >
              + Create First Chapter
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {chapters.map((chap: ChapterNode, cIndex: number) => (
              <div key={chap.id} className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-5">
                {/* Chapter Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-[#1A1A2E] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                      {cIndex + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => updateChapterTitle(chap.id, e.target.value)}
                        className="w-full text-base font-extrabold text-[#1A1A2E] bg-transparent focus:outline-none focus:border-b-2 focus:border-[#6B6BFF] transition-colors truncate"
                        placeholder="Chapter Title..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Lesson ${chap.lessons.length + 1}: Deep-Dive Walkthrough`, "video")}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold transition-all"
                    >
                      + Add Video Lesson
                    </button>
                    <button
                      type="button"
                      onClick={() => addLesson(chap.id, `Practice Quiz #${chap.lessons.length + 1}`, "quiz")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-all"
                    >
                      + Add Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChapter(chap.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete Module"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Lessons List in Chapter */}
                <div className="flex flex-col gap-3 min-h-[50px] rounded-2xl p-2 bg-[#FAF8FF] border border-indigo-100/40">
                  {chap.lessons.length === 0 ? (
                    <p className="text-center text-xs font-bold text-gray-400 py-6">
                      No lessons in this module yet. Click <strong className="text-indigo-600">+ Add Video Lesson</strong> to expand curriculum.
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

                {/* AI Co-Creator Quick Action Tag (Section 2.2 preview link) */}
                <div className="flex items-center justify-between pt-2 text-[11px] font-bold text-gray-400">
                  <span className="flex items-center gap-1 text-indigo-500">
                    ✨ AI Co-Creator: Ready to evaluate video transcripts &amp; auto-generate diagnostic quiz rubrics for this module.
                  </span>
                  <span>{chap.lessons.length} total lessons configured</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Gate Indicator & Review Submission */}
      <div className="p-6 rounded-3xl bg-[#1A1A2E] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{canSubmitForReview ? "🟢" : "⚠️"}</span>
          <div>
            <h4 className="text-sm font-extrabold text-white">Review Submission Readiness Gate</h4>
            <p className="text-xs text-gray-400">
              {canSubmitForReview
                ? "✓ All required bounds met. Curriculum structure is locked and prepared for admin review."
                : "Requirement pending: Add at least 1 chapter and 1 lesson to unlock submission."}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!canSubmitForReview}
          onClick={() => {
            if (canSubmitForReview) setStatus("review");
          }}
          className={twMerge(
            "px-6 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all shrink-0",
            canSubmitForReview
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/30 cursor-pointer hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          Submit For Review ➔
        </button>
      </div>
    </div>
  );
}
