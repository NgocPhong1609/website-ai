"use client";

// ─── Step2CourseStructure ──────────────────────────────────────────────────────
// Step 2: Course structure builder with modules and lessons.
// All data is managed via Zustand store (no API calls).

import {
  useState,
  useCallback,
  useRef,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { CreateLessonEditModal } from "./CreateLessonEditModal";
import { useCreateCourseStore } from "../stores/createCourseStore";
import type { DraftModule, DraftLesson, DraftLessonType } from "../types";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function DotsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function SparklesBigIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.6 5H19l-4.2 3 1.6 5L12 12 7.6 15l1.6-5L5 7h5.4z" />
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z" />
      <path d="M19 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
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

function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ChevronIcon({ size = 16, direction = "down" }: { size?: number; direction?: "down" | "right" }) {
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
      strokeLinejoin="round"
      className={twMerge(
        "transition-transform duration-200",
        direction === "right" && "-rotate-90",
      )}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function XCloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ModuleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LessonIcon({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLessonIcon(type: DraftLessonType) {
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz") return <QuizIcon size={14} />;
  return <DocIcon size={14} />;
}

function getLessonColor(type: DraftLessonType) {
  if (type === "video") return "text-[#4648D4] bg-[#EEEEFF]";
  if (type === "quiz") return "text-[#059669] bg-[#ECFDF5]";
  return "text-[#D97706] bg-[#FFFBEB]";
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: DraftLesson;
  moduleId: string;
  index: number;
  onUpdate: (moduleId: string, lessonId: string, title: string) => void;
  onEdit: (moduleId: string, lessonId: string) => void;
  onDelete: (moduleId: string, lessonId: string) => void;
  onDragStart: (e: DragEvent, moduleId: string, lessonId: string) => void;
  onDrop: (e: DragEvent, moduleId: string, lessonId: string) => void;
  onDragOver: (e: DragEvent) => void;
}

function LessonRow({
  lesson,
  moduleId,
  index,
  onUpdate,
  onEdit,
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
    if (trimmed) onUpdate(moduleId, lesson.id, trimmed);
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
      onDragStart={(e) => onDragStart(e, moduleId, lesson.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, moduleId, lesson.id);
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
          aria-label="Soạn thảo bài học"
          onClick={() => onEdit(moduleId, lesson.id)}
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
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 bg-white border border-[#EAEAF4] rounded-xl shadow-lg py-1 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A2E] hover:bg-[#F5F3FF] transition-colors"
                >
                  <PencilIcon size={12} />
                  Đổi tên
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(moduleId, lesson.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon size={13} />
                  Xóa bài giảng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Lesson Button ────────────────────────────────────────────────────────

interface AddLessonButtonProps {
  moduleId: string;
  onAdd: (moduleId: string, type: DraftLessonType) => void;
}

function AddLessonButton({ moduleId, onAdd }: AddLessonButtonProps) {
  const [open, setOpen] = useState(false);

  const types: { type: DraftLessonType; label: string }[] = [
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
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-48 bg-white border border-[#EAEAF4] rounded-xl shadow-lg py-1 animate-fadeIn">
            {types.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(moduleId, type);
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
  moduleId: string;
  onAccept: (moduleId: string) => void;
  onDismiss: (moduleId: string) => void;
}

function AiSuggestionCard({ moduleId, onAccept, onDismiss }: AiSuggestionCardProps) {
  return (
    <div className="relative rounded-xl border border-[#DDD8FF] bg-gradient-to-br from-[#F5F3FF] to-[#EEF0FF] p-4 overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute right-4 top-3 text-[#C8C6FF] opacity-60 pointer-events-none">
        <SparklesBigIcon size={40} />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          <span className="animate-pulse">
            <SparklesBigIcon size={15} />
          </span>
          <span className="text-[13px] font-semibold">Gợi ý từ MindNova AI</span>
        </div>

        <p className="text-[12px] text-[#5A5A8A] leading-relaxed">
          Dựa trên tiêu đề module, AI đề xuất{" "}
          <span className="font-semibold text-[#4648D4]">3 bài giảng</span> tiếp
          theo để tối ưu hóa lộ trình học tập của học viên.
        </p>

        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => onAccept(moduleId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4648D4] text-white text-[12px] font-semibold hover:bg-[#3D40C0] shadow-[0_4px_12px_rgba(70,72,212,0.3)] hover:shadow-[0_6px_16px_rgba(70,72,212,0.4)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <SparklesBigIcon size={12} />
            Xem 3 gợi ý bài giảng
          </button>
          <button
            type="button"
            onClick={() => onDismiss(moduleId)}
            className="px-3 py-2 rounded-lg text-[12px] font-medium text-[#6B6BFF] border border-[#C8C6FF] bg-white hover:bg-[#F5F3FF] transition-all duration-150"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

interface ModuleCardProps {
  module: DraftModule;
  index: number;
  onToggleExpand: (id: string) => void;
  onEditModule: (module: DraftModule) => void;
  onDeleteModule: (id: string) => void;
  onAddLesson: (moduleId: string, type: DraftLessonType) => void;
  onUpdateLesson: (moduleId: string, lessonId: string, title: string) => void;
  onEditLesson: (moduleId: string, lessonId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onDragStartModule: (e: DragEvent, moduleId: string) => void;
  onDropModule: (e: DragEvent, moduleId: string) => void;
  onDragOver: (e: DragEvent) => void;
  onDragStartLesson: (e: DragEvent, moduleId: string, lessonId: string) => void;
  onDropLesson: (e: DragEvent, moduleId: string, lessonId: string) => void;
  onAiAccept: (moduleId: string) => void;
  onAiDismiss: (moduleId: string) => void;
}

function ModuleCard({
  module,
  index,
  onToggleExpand,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onEditLesson,
  onDeleteLesson,
  onDragStartModule,
  onDropModule,
  onDragOver,
  onDragStartLesson,
  onDropLesson,
  onAiAccept,
  onAiDismiss,
}: ModuleCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStartModule(e, module.id)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDropModule(e, module.id);
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
      {/* Module header */}
      <div className="flex items-center gap-3 px-5 py-4 group">
        {/* Drag handle */}
        <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Collapse/expand toggle */}
        <button
          type="button"
          aria-label={module.expanded ? "Thu gọn" : "Mở rộng"}
          onClick={() => onToggleExpand(module.id)}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          <ChevronIcon size={16} direction={module.expanded ? "down" : "right"} />
        </button>

        {/* Left accent */}
        <div className="w-1 h-8 rounded-full bg-[#4648D4] shrink-0" />

        {/* Number + title + description */}
        <div
          className="flex flex-col flex-1 min-w-0 cursor-pointer"
          onClick={() => onToggleExpand(module.id)}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9090B0]">
            Module {index + 1}
          </span>
          <span className="text-base font-bold text-[#1A1A2E] truncate">
            {module.title}
          </span>
          {module.description && (
            <span className="text-[12px] text-[#9090B0] truncate mt-0.5">
              {module.description}
            </span>
          )}
        </div>

        {/* Lesson count badge */}
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#4648D4]">
          {module.lessons.length} bài
        </span>

        {/* Module actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa module"
            onClick={() => onEditModule(module)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa module"
            onClick={() => onDeleteModule(module.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      {/* Lessons (collapsible) */}
      {module.expanded && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-t border-[#F4F4FA] pt-3">
          {module.lessons.map((lesson, li) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              index={li}
              onUpdate={onUpdateLesson}
              onEdit={onEditLesson}
              onDelete={onDeleteLesson}
              onDragStart={onDragStartLesson}
              onDrop={onDropLesson}
              onDragOver={onDragOver}
            />
          ))}

          {/* AI suggestion */}
          {module.showAiSuggestion && (
            <AiSuggestionCard
              moduleId={module.id}
              onAccept={onAiAccept}
              onDismiss={onAiDismiss}
            />
          )}

          {/* Add lesson */}
          <AddLessonButton moduleId={module.id} onAdd={onAddLesson} />
        </div>
      )}
    </div>
  );
}

// ─── Module Modal ─────────────────────────────────────────────────────────────

interface ModuleModalProps {
  isOpen: boolean;
  editingModule: DraftModule | null;
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

function ModuleModal({ isOpen, editingModule, onSave, onClose }: ModuleModalProps) {
  const [title, setTitle] = useState(editingModule?.title || "");
  const [description, setDescription] = useState(editingModule?.description || "");
  const [titleError, setTitleError] = useState("");

  // Reset form when modal opens with different data
  const prevId = useRef(editingModule?.id);
  if (editingModule?.id !== prevId.current) {
    prevId.current = editingModule?.id;
    // We use this pattern instead of useEffect to avoid extra renders
  }

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Tên module không được để trống");
      return;
    }
    setTitleError("");
    onSave(trimmedTitle, description.trim());
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTitleError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">
            {editingModule ? "Chỉnh sửa Module" : "Thêm Module mới"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9090B0] hover:bg-[#F4F4FA] transition-colors"
          >
            <XCloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="module-title" className="text-sm font-semibold text-[#1A1A2E]">
              Tên Module <span className="text-red-500">*</span>
            </label>
            <input
              id="module-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Ví dụ: Giới thiệu về Machine Learning"
              className={twMerge(
                "w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border transition-all duration-200 focus:outline-none focus:ring-4",
                titleError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-[#EAEAF4] focus:border-[#6B6BFF] focus:ring-[#6B6BFF]/10",
              )}
            />
            {titleError && (
              <p className="text-[12px] text-red-500 font-medium">{titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="module-desc" className="text-sm font-semibold text-[#1A1A2E]">
              Mô tả
            </label>
            <textarea
              id="module-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn nội dung module này..."
              className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F8] flex justify-end gap-3 bg-[#FAFAFE]">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#64647A] hover:bg-[#EAEAF4] transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {editingModule ? "Lưu thay đổi" : "Thêm Module"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Step2CourseStructure() {
  // Read from store
  const modules = useCreateCourseStore((s) => s.modules);
  const addModuleToStore = useCreateCourseStore((s) => s.addModule);
  const updateModuleInStore = useCreateCourseStore((s) => s.updateModule);
  const deleteModuleFromStore = useCreateCourseStore((s) => s.deleteModule);
  const toggleModuleExpand = useCreateCourseStore((s) => s.toggleModuleExpand);
  const reorderModules = useCreateCourseStore((s) => s.reorderModules);
  const addLessonToStore = useCreateCourseStore((s) => s.addLesson);
  const updateLessonInStore = useCreateCourseStore((s) => s.updateLesson);
  const deleteLessonFromStore = useCreateCourseStore((s) => s.deleteLesson);
  const reorderLessons = useCreateCourseStore((s) => s.reorderLessons);
  const acceptAiSuggestion = useCreateCourseStore((s) => s.acceptAiSuggestion);
  const dismissAiSuggestion = useCreateCourseStore((s) => s.dismissAiSuggestion);

  // Local UI state
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: string;
    lesson: DraftLesson;
  } | null>(null);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModuleData, setEditingModuleData] = useState<DraftModule | null>(null);

  // Drag state
  const dragModule = useRef<string | null>(null);
  const dragLesson = useRef<{ moduleId: string; lessonId: string } | null>(null);

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const totalModules = modules.length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // ── Module Modal Handlers ─────────────────────────────────────────────────────

  const openAddModuleModal = useCallback(() => {
    setEditingModuleData(null);
    setModuleModalOpen(true);
  }, []);

  const openEditModuleModal = useCallback((mod: DraftModule) => {
    setEditingModuleData(mod);
    setModuleModalOpen(true);
  }, []);

  const handleModuleModalSave = useCallback(
    (title: string, description: string) => {
      if (editingModuleData) {
        updateModuleInStore(editingModuleData.id, { title, description });
      } else {
        addModuleToStore(title, description);
      }
      setModuleModalOpen(false);
      setEditingModuleData(null);
    },
    [editingModuleData, addModuleToStore, updateModuleInStore],
  );

  // ── Lesson CRUD ───────────────────────────────────────────────────────────────

  const handleAddLesson = useCallback(
    (moduleId: string, type: DraftLessonType) => {
      addLessonToStore(moduleId, type);
    },
    [addLessonToStore],
  );

  const handleUpdateLesson = useCallback(
    (moduleId: string, lessonId: string, title: string) => {
      updateLessonInStore(moduleId, lessonId, { title });
    },
    [updateLessonInStore],
  );

  const handleUpdateLessonContent = useCallback(
    (moduleId: string, lessonId: string, updates: Partial<DraftLesson>) => {
      updateLessonInStore(moduleId, lessonId, updates);
    },
    [updateLessonInStore],
  );

  const handleDeleteLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      deleteLessonFromStore(moduleId, lessonId);
    },
    [deleteLessonFromStore],
  );

  const handleEditLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      const mod = modules.find((m) => m.id === moduleId);
      const lesson = mod?.lessons.find((l) => l.id === lessonId);
      if (lesson) setEditingLesson({ moduleId, lesson });
    },
    [modules],
  );

  // ── Drag-and-drop: Modules ────────────────────────────────────────────────────

  const handleDragStartModule = useCallback(
    (e: DragEvent, moduleId: string) => {
      dragModule.current = moduleId;
      dragLesson.current = null;
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDropModule = useCallback(
    (e: DragEvent, targetModuleId: string) => {
      e.preventDefault();
      if (!dragModule.current || dragModule.current === targetModuleId) return;

      const reordered = [...modules];
      const fromIdx = reordered.findIndex((m) => m.id === dragModule.current);
      const toIdx = reordered.findIndex((m) => m.id === targetModuleId);
      if (fromIdx < 0 || toIdx < 0) return;

      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);
      dragModule.current = null;
      reorderModules(reordered);
    },
    [modules, reorderModules],
  );

  // ── Drag-and-drop: Lessons ────────────────────────────────────────────────────

  const handleDragStartLesson = useCallback(
    (e: DragEvent, moduleId: string, lessonId: string) => {
      dragLesson.current = { moduleId, lessonId };
      dragModule.current = null;
      e.dataTransfer.effectAllowed = "move";
      e.stopPropagation();
    },
    [],
  );

  const handleDropLesson = useCallback(
    (e: DragEvent, targetModuleId: string, targetLessonId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragLesson.current) return;

      const { moduleId: srcModuleId, lessonId: srcLessonId } = dragLesson.current;
      if (srcModuleId === targetModuleId && srcLessonId === targetLessonId) return;

      const modulesClone = modules.map((m) => ({
        ...m,
        lessons: [...m.lessons],
      }));

      const srcModule = modulesClone.find((m) => m.id === srcModuleId);
      const tgtModule = modulesClone.find((m) => m.id === targetModuleId);
      if (!srcModule || !tgtModule) return;

      const srcIdx = srcModule.lessons.findIndex((l) => l.id === srcLessonId);
      if (srcIdx < 0) return;

      const [movedLesson] = srcModule.lessons.splice(srcIdx, 1);

      if (srcModuleId === targetModuleId) {
        const tgtIdx = srcModule.lessons.findIndex((l) => l.id === targetLessonId);
        srcModule.lessons.splice(tgtIdx, 0, movedLesson);
        reorderLessons(srcModuleId, srcModule.lessons);
      } else {
        const tgtIdx = tgtModule.lessons.findIndex((l) => l.id === targetLessonId);
        tgtModule.lessons.splice(tgtIdx, 0, movedLesson);
        // Update both modules
        reorderLessons(srcModuleId, srcModule.lessons);
        reorderLessons(targetModuleId, tgtModule.lessons);
      }

      dragLesson.current = null;
    },
    [modules, reorderLessons],
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
            Nội dung khóa học
          </h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-sm text-[#9090B0]">
              <span className="w-5 h-5 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
                <ModuleIcon size={12} />
              </span>
              <span className="font-semibold text-[#4648D4]">{totalModules}</span> Module
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#9090B0]">
              <span className="w-5 h-5 rounded-md bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <LessonIcon size={11} />
              </span>
              <span className="font-semibold text-[#059669]">{totalLessons}</span> Bài học
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-add-module"
          onClick={openAddModuleModal}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <PlusIcon size={14} />
          Thêm Module mới
        </button>
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-4">
        {modules.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#D5D5FF] rounded-2xl bg-[#FAFAFE]">
            <div className="w-14 h-14 rounded-2xl bg-[#EEEEFF] flex items-center justify-center mb-4 text-[#6B6BFF]">
              <SparklesBigIcon size={28} />
            </div>
            <p className="text-base font-semibold text-[#1A1A2E]">
              Chưa có module nào
            </p>
            <p className="text-sm text-[#9090B0] mt-1 max-w-xs">
              Nhấn &quot;Thêm Module mới&quot; để bắt đầu xây dựng cấu trúc
              khóa học của bạn.
            </p>
            <button
              type="button"
              onClick={openAddModuleModal}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#4648D4] border-2 border-[#C5C6FF] hover:bg-[#F0F0FF] transition-all duration-200"
            >
              <PlusIcon size={14} />
              Thêm module đầu tiên
            </button>
          </div>
        ) : (
          modules.map((mod, index) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              index={index}
              onToggleExpand={toggleModuleExpand}
              onEditModule={openEditModuleModal}
              onDeleteModule={deleteModuleFromStore}
              onAddLesson={handleAddLesson}
              onUpdateLesson={handleUpdateLesson}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onDragStartModule={handleDragStartModule}
              onDropModule={handleDropModule}
              onDragOver={handleDragOver}
              onDragStartLesson={handleDragStartLesson}
              onDropLesson={handleDropLesson}
              onAiAccept={acceptAiSuggestion}
              onAiDismiss={dismissAiSuggestion}
            />
          ))
        )}
      </div>

      {/* Module create/edit modal */}
      <ModuleModal
        isOpen={moduleModalOpen}
        editingModule={editingModuleData}
        onSave={handleModuleModalSave}
        onClose={() => {
          setModuleModalOpen(false);
          setEditingModuleData(null);
        }}
      />

      {/* Lesson edit modal */}
      {editingLesson && (
        <CreateLessonEditModal
          lesson={editingLesson.lesson}
          onSave={(id, updates) => {
            handleUpdateLessonContent(editingLesson.moduleId, id, updates);
            setEditingLesson(null);
          }}
          onClose={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}
