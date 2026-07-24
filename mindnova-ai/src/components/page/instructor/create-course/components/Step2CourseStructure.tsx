"use client";

// ─── Step2CourseStructure ──────────────────────────────────────────────────────
// Step 2: Drag-and-drop course structure builder with chapters and lessons.

import {
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { twMerge } from "tailwind-merge";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LessonType = "video" | "quiz" | "document";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  showAiSuggestion?: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GripIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
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
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function QuizIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function DotsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function SparklesBigIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l1.6 5H19l-4.2 3 1.6 5L12 12 7.6 15l1.6-5L5 7h5.4z" />
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z" />
      <path d="M19 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
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

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  chapterId: string;
  index: number;
  onUpdate: (chapterId: string, lessonId: string, title: string) => void;
  onDelete: (chapterId: string, lessonId: string) => void;
  onDragStart: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDrop: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDragOver: (e: DragEvent) => void;
}

function LessonRow({
  lesson,
  chapterId,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDrop,
  onDragOver,
}: LessonRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lesson.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdate(chapterId, lesson.id, trimmed);
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
        "group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150",
        isDragOver
          ? "border-[#6B6BFF] bg-[#F0F0FF] shadow-[0_0_0_2px_rgba(107,107,255,0.15)]"
          : "border-[#EAEAF4] bg-white hover:border-[#D5D5FF] hover:bg-[#FAFAFE]",
      )}
    >
      {/* Drag handle */}
      <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
        <GripIcon size={14} />
      </span>

      {/* Type badge */}
      <span
        className={twMerge(
          "shrink-0 w-6 h-6 rounded-md flex items-center justify-center",
          getLessonColor(lesson.type),
        )}
      >
        {getLessonIcon(lesson.type)}
      </span>

      {/* Title / Edit */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-[#1A1A2E] bg-transparent border-b border-[#6B6BFF] focus:outline-none pb-0.5"
          />
        ) : (
          <span className="text-sm text-[#1A1A2E] truncate block">
            {index + 1}. {lesson.title}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 relative">
        <button
          type="button"
          aria-label="Chỉnh sửa bài giảng"
          onClick={() => {
            setEditing(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          <PencilIcon size={13} />
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Tùy chọn thêm"
            onClick={() => setMenuOpen((p) => !p)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
          >
            <DotsIcon size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-[#EAEAF4] rounded-xl shadow-lg py-1 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onDelete(chapterId, lesson.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                <TrashIcon size={13} />
                Xóa bài giảng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Lesson Button ────────────────────────────────────────────────────────

interface AddLessonButtonProps {
  chapterId: string;
  onAdd: (chapterId: string, type: LessonType) => void;
}

function AddLessonButton({ chapterId, onAdd }: AddLessonButtonProps) {
  const [open, setOpen] = useState(false);

  const types: { type: LessonType; label: string }[] = [
    { type: "video", label: "Video bài giảng" },
    { type: "quiz", label: "Bài kiểm tra" },
    { type: "document", label: "Tài liệu đọc" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#D5D5FF] text-[#6B6BFF] text-sm font-medium hover:border-[#6B6BFF] hover:bg-[#F5F3FF] transition-all duration-200 group"
      >
        <span className="group-hover:rotate-90 transition-transform duration-200">
          <PlusIcon size={14} />
        </span>
        Thêm bài giảng mới
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-48 bg-white border border-[#EAEAF4] rounded-xl shadow-lg py-1 animate-fadeIn">
            {types.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(chapterId, type);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1A1A2E] hover:bg-[#F5F3FF] hover:text-[#4648D4] transition-colors"
              >
                <span
                  className={twMerge(
                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    getLessonColor(type),
                  )}
                >
                  {getLessonIcon(type)}
                </span>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── AI Suggestion Card ───────────────────────────────────────────────────────

interface AiSuggestionCardProps {
  chapterId: string;
  onAccept: (chapterId: string) => void;
  onDismiss: (chapterId: string) => void;
}

function AiSuggestionCard({
  chapterId,
  onAccept,
  onDismiss,
}: AiSuggestionCardProps) {
  return (
    <div className="relative rounded-xl border border-[#DDD8FF] bg-gradient-to-br from-[#F5F3FF] to-[#EEF0FF] p-4 overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute right-4 top-3 text-[#C8C6FF] opacity-60 pointer-events-none">
        <SparklesBigIcon size={40} />
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          <span className="animate-pulse">
            <SparklesBigIcon size={15} />
          </span>
          <span className="text-[13px] font-semibold">Gợi ý từ MindNova AI</span>
        </div>

        {/* Body */}
        <p className="text-[12px] text-[#5A5A8A] leading-relaxed">
          Dựa trên tiêu đề chương học, AI đề xuất{" "}
          <span className="font-semibold text-[#4648D4]">3 bài giảng</span> tiếp
          theo để tối ưu hóa lộ trình học tập của học viên.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => onAccept(chapterId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4648D4] text-white text-[12px] font-semibold hover:bg-[#3D40C0] shadow-[0_4px_12px_rgba(70,72,212,0.3)] hover:shadow-[0_6px_16px_rgba(70,72,212,0.4)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <SparklesBigIcon size={12} />
            Xem 3 gợi ý bài giảng
          </button>
          <button
            type="button"
            onClick={() => onDismiss(chapterId)}
            className="px-3 py-2 rounded-lg text-[12px] font-medium text-[#6B6BFF] border border-[#C8C6FF] bg-white hover:bg-[#F5F3FF] transition-all duration-150"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
  onUpdateChapterTitle: (id: string, title: string) => void;
  onDeleteChapter: (id: string) => void;
  onAddLesson: (chapterId: string, type: LessonType) => void;
  onUpdateLesson: (chapterId: string, lessonId: string, title: string) => void;
  onDeleteLesson: (chapterId: string, lessonId: string) => void;
  onDragStartChapter: (e: DragEvent, chapterId: string) => void;
  onDropChapter: (e: DragEvent, chapterId: string) => void;
  onDragOver: (e: DragEvent) => void;
  onDragStartLesson: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onDropLesson: (e: DragEvent, chapterId: string, lessonId: string) => void;
  onAiAccept: (chapterId: string) => void;
  onAiDismiss: (chapterId: string) => void;
}

function ChapterCard({
  chapter,
  index,
  onUpdateChapterTitle,
  onDeleteChapter,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onDragStartChapter,
  onDropChapter,
  onDragOver,
  onDragStartLesson,
  onDropLesson,
  onAiAccept,
  onAiDismiss,
}: ChapterCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chapter.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdateChapterTitle(chapter.id, trimmed);
    else setDraft(chapter.title);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setDraft(chapter.title);
      setEditing(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStartChapter(e, chapter.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDropChapter(e, chapter.id);
      }}
      onDragOver={(e) => {
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={twMerge(
        "rounded-2xl border transition-all duration-200",
        isDragOver
          ? "border-[#6B6BFF] shadow-[0_0_0_3px_rgba(107,107,255,0.15)] bg-[#F8F7FF]"
          : "border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(70,72,212,0.05)]",
      )}
    >
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-5 py-4 group">
        {/* Drag handle */}
        <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Left accent */}
        <div className="w-1 h-8 rounded-full bg-[#4648D4] shrink-0" />

        {/* Number + title */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9090B0]">
            Chương {index + 1}
          </span>
          {editing ? (
            <input
              ref={inputRef}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              className="text-base font-bold text-[#1A1A2E] bg-transparent border-b border-[#6B6BFF] focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="text-base font-bold text-[#1A1A2E] text-left hover:text-[#4648D4] transition-colors truncate"
            >
              {chapter.title}
            </button>
          )}
        </div>

        {/* Chapter actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            onClick={() => {
              setEditing(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={() => onDeleteChapter(chapter.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      {/* Lessons */}
      {(chapter.lessons.length > 0 || chapter.showAiSuggestion) && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-t border-[#F4F4FA] pt-3">
          {chapter.lessons.map((lesson, li) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              chapterId={chapter.id}
              index={li}
              onUpdate={onUpdateLesson}
              onDelete={onDeleteLesson}
              onDragStart={onDragStartLesson}
              onDrop={onDropLesson}
              onDragOver={onDragOver}
            />
          ))}

          {/* AI suggestion */}
          {chapter.showAiSuggestion && (
            <AiSuggestionCard
              chapterId={chapter.id}
              onAccept={onAiAccept}
              onDismiss={onAiDismiss}
            />
          )}

          {/* Add lesson */}
          <AddLessonButton chapterId={chapter.id} onAdd={onAddLesson} />
        </div>
      )}

      {/* Add lesson when empty */}
      {chapter.lessons.length === 0 && !chapter.showAiSuggestion && (
        <div className="px-5 pb-4 border-t border-[#F4F4FA] pt-3">
          <AddLessonButton chapterId={chapter.id} onAdd={onAddLesson} />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface CourseStructure {
  chapters: Chapter[];
}

interface Step2CourseStructureProps {
  data: CourseStructure;
  onChange: (data: CourseStructure) => void;
}


export function Step2CourseStructure({
  data,
  onChange,
}: Step2CourseStructureProps) {
  // Drag state
  const dragChapter = useRef<string | null>(null);
  const dragLesson = useRef<{ chapterId: string; lessonId: string } | null>(
    null,
  );

  const update = useCallback(
    (chapters: Chapter[]) => onChange({ ...data, chapters }),
    [data, onChange],
  );

  // ── Chapter CRUD ─────────────────────────────────────────────────────────────

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: uid(),
      title: `Tên chương học ${data.chapters.length + 1}`,
      lessons: [],
      showAiSuggestion: data.chapters.length >= 1,
    };
    update([...data.chapters, newChapter]);
  }, [data.chapters, update]);

  const updateChapterTitle = useCallback(
    (id: string, title: string) => {
      update(
        data.chapters.map((c) => (c.id === id ? { ...c, title } : c)),
      );
    },
    [data.chapters, update],
  );

  const deleteChapter = useCallback(
    (id: string) => {
      update(data.chapters.filter((c) => c.id !== id));
    },
    [data.chapters, update],
  );

  // ── Lesson CRUD ───────────────────────────────────────────────────────────────

  const addLesson = useCallback(
    (chapterId: string, type: LessonType) => {
      const chapter = data.chapters.find((c) => c.id === chapterId);
      if (!chapter) return;
      const newLesson: Lesson = {
        id: uid(),
        title: `Bài ${chapter.lessons.length + 1} - ${
          type === "video"
            ? "Video bài giảng"
            : type === "quiz"
              ? "Bài kiểm tra"
              : "Tài liệu đọc"
        }`,
        type,
      };
      update(
        data.chapters.map((c) =>
          c.id === chapterId
            ? { ...c, lessons: [...c.lessons, newLesson] }
            : c,
        ),
      );
    },
    [data.chapters, update],
  );

  const updateLesson = useCallback(
    (chapterId: string, lessonId: string, title: string) => {
      update(
        data.chapters.map((c) =>
          c.id === chapterId
            ? {
                ...c,
                lessons: c.lessons.map((l) =>
                  l.id === lessonId ? { ...l, title } : l,
                ),
              }
            : c,
        ),
      );
    },
    [data.chapters, update],
  );

  const deleteLesson = useCallback(
    (chapterId: string, lessonId: string) => {
      update(
        data.chapters.map((c) =>
          c.id === chapterId
            ? { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) }
            : c,
        ),
      );
    },
    [data.chapters, update],
  );

  // ── AI Actions ────────────────────────────────────────────────────────────────

  const handleAiAccept = useCallback(
    (chapterId: string) => {
      const chapter = data.chapters.find((c) => c.id === chapterId);
      if (!chapter) return;
      const suggestions: Lesson[] = [
        { id: uid(), title: "Giới thiệu tổng quan", type: "video" },
        { id: uid(), title: "Bài tập thực hành", type: "quiz" },
        { id: uid(), title: "Tài liệu tham khảo", type: "document" },
      ];
      update(
        data.chapters.map((c) =>
          c.id === chapterId
            ? {
                ...c,
                lessons: [...c.lessons, ...suggestions],
                showAiSuggestion: false,
              }
            : c,
        ),
      );
    },
    [data.chapters, update],
  );

  const handleAiDismiss = useCallback(
    (chapterId: string) => {
      update(
        data.chapters.map((c) =>
          c.id === chapterId ? { ...c, showAiSuggestion: false } : c,
        ),
      );
    },
    [data.chapters, update],
  );

  // ── Drag-and-drop: Chapters ───────────────────────────────────────────────────

  const handleDragStartChapter = useCallback(
    (e: DragEvent, chapterId: string) => {
      dragChapter.current = chapterId;
      dragLesson.current = null;
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDropChapter = useCallback(
    (e: DragEvent, targetChapterId: string) => {
      e.preventDefault();
      if (!dragChapter.current || dragChapter.current === targetChapterId)
        return;

      const chapters = [...data.chapters];
      const fromIdx = chapters.findIndex((c) => c.id === dragChapter.current);
      const toIdx = chapters.findIndex((c) => c.id === targetChapterId);
      if (fromIdx < 0 || toIdx < 0) return;

      const [moved] = chapters.splice(fromIdx, 1);
      chapters.splice(toIdx, 0, moved);
      dragChapter.current = null;
      update(chapters);
    },
    [data.chapters, update],
  );

  // ── Drag-and-drop: Lessons ────────────────────────────────────────────────────

  const handleDragStartLesson = useCallback(
    (e: DragEvent, chapterId: string, lessonId: string) => {
      dragLesson.current = { chapterId, lessonId };
      dragChapter.current = null;
      e.dataTransfer.effectAllowed = "move";
      e.stopPropagation();
    },
    [],
  );

  const handleDropLesson = useCallback(
    (e: DragEvent, targetChapterId: string, targetLessonId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragLesson.current) return;

      const { chapterId: srcChapterId, lessonId: srcLessonId } =
        dragLesson.current;
      if (srcChapterId === targetChapterId && srcLessonId === targetLessonId)
        return;

      const chapters = data.chapters.map((c) => ({
        ...c,
        lessons: [...c.lessons],
      }));

      const srcChapter = chapters.find((c) => c.id === srcChapterId);
      const tgtChapter = chapters.find((c) => c.id === targetChapterId);
      if (!srcChapter || !tgtChapter) return;

      const srcIdx = srcChapter.lessons.findIndex((l) => l.id === srcLessonId);
      if (srcIdx < 0) return;

      const [movedLesson] = srcChapter.lessons.splice(srcIdx, 1);

      if (srcChapterId === targetChapterId) {
        const tgtIdx = srcChapter.lessons.findIndex(
          (l) => l.id === targetLessonId,
        );
        srcChapter.lessons.splice(tgtIdx, 0, movedLesson);
      } else {
        const tgtIdx = tgtChapter.lessons.findIndex(
          (l) => l.id === targetLessonId,
        );
        tgtChapter.lessons.splice(tgtIdx, 0, movedLesson);
      }

      dragLesson.current = null;
      update(chapters);
    },
    [data.chapters, update],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">
            Cấu trúc Nội dung:{" "}
            <span className="text-[#4648D4]">Kéo thả</span>
          </h2>
          <p className="text-sm text-[#9090B0] mt-0.5">
            Tổ chức các chương học và bài giảng một cách trực quan.
          </p>
        </div>

        <button
          type="button"
          id="btn-add-chapter"
          onClick={addChapter}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <PlusIcon size={14} />
          Thêm Chương mới
        </button>
      </div>

      {/* Chapter list */}
      <div className="flex flex-col gap-4">
        {data.chapters.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#D5D5FF] rounded-2xl bg-[#FAFAFE]">
            <div className="w-14 h-14 rounded-2xl bg-[#EEEEFF] flex items-center justify-center mb-4 text-[#6B6BFF]">
              <SparklesBigIcon size={28} />
            </div>
            <p className="text-base font-semibold text-[#1A1A2E]">
              Chưa có chương học nào
            </p>
            <p className="text-sm text-[#9090B0] mt-1 max-w-xs">
              Nhấn &quot;Thêm Chương mới&quot; để bắt đầu xây dựng cấu trúc
              khóa học của bạn.
            </p>
            <button
              type="button"
              onClick={addChapter}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#4648D4] border-2 border-[#C5C6FF] hover:bg-[#F0F0FF] transition-all duration-200"
            >
              <PlusIcon size={14} />
              Thêm chương đầu tiên
            </button>
          </div>
        ) : (
          data.chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              onUpdateChapterTitle={updateChapterTitle}
              onDeleteChapter={deleteChapter}
              onAddLesson={addLesson}
              onUpdateLesson={updateLesson}
              onDeleteLesson={deleteLesson}
              onDragStartChapter={handleDragStartChapter}
              onDropChapter={handleDropChapter}
              onDragOver={handleDragOver}
              onDragStartLesson={handleDragStartLesson}
              onDropLesson={handleDropLesson}
              onAiAccept={handleAiAccept}
              onAiDismiss={handleAiDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}
