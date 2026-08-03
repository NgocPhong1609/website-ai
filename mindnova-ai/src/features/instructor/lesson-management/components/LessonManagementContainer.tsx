"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { LessonAIQuizModal } from "./LessonAIQuizModal";
import { LessonEditModal } from "./LessonEditModal";
import { useInstructorCourse } from "../../management/api/courses";
import { useCourseModules, useCreateModule, useDeleteModule, useUpdateModule, useCreateLesson, useUpdateLesson, useDeleteLesson, useCreateQuiz } from "../api";
import {
  GripIcon,
  VideoIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  PlusIcon,
  PlusCircleIcon,
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  LayersIcon,
  FilterIcon,
  SortIcon,
} from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "published" | "draft";
type LessonType   = "video" | "article" | "quiz_module";
type FilterTab    = "all" | "public" | "draft";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration_seconds: number;
  status: LessonStatus;
  content?: string;
  quizData?: any;
}

interface Chapter {
  id: string;
  index: number;
  title: string;
  lessons: Lesson[];
  collapsed: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDurationSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, "0");
  
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

function totalDuration(chapters: Chapter[]): string {
  let secs = 0;
  chapters.forEach((ch) =>
    ch.lessons.forEach((l) => {
      secs += l.duration_seconds || 0;
    }),
  );
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h} giờ ${m} phút`;
}

function totalLessons(chapters: Chapter[]): number {
  return chapters.reduce((a, c) => a + c.lessons.length, 0);
}

function publishedLessons(chapters: Chapter[]): number {
  return chapters.reduce(
    (a, c) => a + c.lessons.filter((l) => l.status === "published").length,
    0,
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={twMerge(
        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
        status === "published"
          ? "bg-[#EEF0FF] text-[#4F46E5]"
          : "bg-amber-100 text-amber-700",
      )}
    >
      {status === "published" ? "Đã xuất bản" : "Đang soạn thảo"}
    </span>
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

// ─── Lesson Icon ──────────────────────────────────────────────────────────────

function LessonTypeIcon({ type }: { type: LessonType }) {
  return (
    <span className="w-6 h-6 rounded-md bg-[#F4F4FA] text-[#9090B0] flex items-center justify-center shrink-0">
      {type === "video"    && <VideoIcon size={12} />}
      {type === "article" && <DocumentIcon size={12} />}
      {type === "quiz_module"     && <VideoIcon size={12} />}
    </span>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
  onGenerateQuiz: () => void;
}

function LessonRow({ lesson, onEdit, onDelete, onGenerateQuiz }: LessonRowProps) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFE] transition-colors duration-100 border-b border-gray-100 last:border-0">
      {/* Drag handle */}
      <span className="text-gray-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <GripIcon size={14} />
      </span>

      {/* Type icon */}
      <LessonTypeIcon type={lesson.type} />

      {/* Title */}
      <p className="flex-1 text-[13px] text-gray-900 font-medium truncate min-w-0">
        {lesson.title}
      </p>

      {/* Generate Quiz button */}
      <button
        type="button"
        onClick={onGenerateQuiz}
        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white border border-indigo-200 hover:border-transparent text-[11px] font-extrabold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
        title="AI analysis of lesson transcript to auto-generate multiple choice rubric"
      >
        <span>🪄 Generate Quiz</span>
      </button>

      {/* Duration */}
      <span className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0 font-mono">
        <ClockIcon size={11} />
        {formatDurationSeconds(lesson.duration_seconds || 0)}
      </span>

      {/* Status badge */}
      <LessonStatusBadge status={lesson.status} />

      {/* Actions (hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Chỉnh sửa bài học"
          onClick={onEdit}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-all duration-150"
        >
          <PencilIcon size={12} />
        </button>
        <button
          type="button"
          aria-label="Xóa bài học"
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <TrashIcon size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────

interface ChapterCardProps {
  chapter: Chapter;
  onToggle: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onGenerateQuiz: (lessonTitle: string) => void;
}

function ChapterCard({ chapter, onToggle, onAddLesson, onEditLesson, onDeleteLesson, onEdit, onDelete, onGenerateQuiz }: ChapterCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50/50 transition-colors">
        {/* Drag handle */}
        <span className="text-gray-300 cursor-grab shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Chapter badge */}
        <span className="px-2.5 py-1 rounded-lg bg-[#4F46E5] text-white text-[11px] font-bold tracking-wide shrink-0">
          Chương {chapter.index}
        </span>

        {/* Title */}
        <span className="flex-1 text-[13px] font-semibold text-gray-900 truncate min-w-0" onClick={onToggle} style={{cursor: "pointer"}}>
          {chapter.title}
        </span>

        {/* Chapter actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-all duration-150"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <TrashIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={chapter.collapsed ? "Mở rộng chương" : "Thu gọn chương"}
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-all duration-150"
          >
            {chapter.collapsed ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}
          </button>
        </div>
      </div>

      {/* Lesson list (collapsible) */}
      {!chapter.collapsed && (
        <div className="border-t border-gray-100">
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onEdit={() => onEditLesson(lesson)}
              onDelete={() => onDeleteLesson(lesson.id)}
              onGenerateQuiz={() => onGenerateQuiz(lesson.title)}
            />
          ))}

          {/* Add lesson CTA */}
          <button
            type="button"
            onClick={onAddLesson}
            className="w-full flex items-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#4F46E5] hover:bg-indigo-50/50 transition-colors duration-150 border-t border-dashed border-indigo-200 group"
          >
            <PlusIcon size={13} />
            Thêm bài học mới vào chương {chapter.index}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── AI Assist Card ───────────────────────────────────────────────────────────

function AIAssistCard({ onQuizGenerate, onSuggestChapter }: {
  onQuizGenerate: () => void;
  onSuggestChapter: () => void;
}) {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon + text */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[#4F46E5]">
          <span className="animate-pulse"><SparklesIcon size={13} /></span>
          <span className="text-[10px] font-bold tracking-widest uppercase">
            MindNova AI Assist
          </span>
        </div>
        <p className="text-[14px] font-bold text-gray-900">
          Sử dụng AI để tối ưu lộ trình học tập
        </p>
        <p className="text-[12px] text-gray-500 leading-relaxed max-w-[420px]">
          Hệ thống AI của chúng tôi có thể giúp bạn tự động sinh câu hỏi Quiz,
          tóm tắt bài giảng hoặc đề xuất thêm các chương học dựa trên xu hướng
          thị trường.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onQuizGenerate}
          className="px-4 py-2.5 rounded-xl border border-indigo-200 text-[13px] font-semibold text-[#4F46E5] bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
        >
          Sinh câu hỏi Quiz
        </button>
        <button
          type="button"
          onClick={onSuggestChapter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs hover:shadow-sm transition-all duration-200 focus:outline-none"
        >
          <PlusIcon size={13} />
          Gợi ý Chương mới
        </button>
      </div>
    </div>
  );
}

// ─── Filter Tabs + Stats ──────────────────────────────────────────────────────

interface FilterBarProps {
  active: FilterTab;
  onChange: (t: FilterTab) => void;
  total: number;
  published: number;
  draft: number;
  totalHours: string;
  totalChapters: number;
}

function FilterBar({ active, onChange, total, published, draft, totalHours, totalChapters }: FilterBarProps) {
  const TABS: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",    label: "Tất cả",   count: total     },
    { id: "public", label: "Công khai", count: published },
    { id: "draft",  label: "Bản nháp", count: draft     },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={twMerge(
              "px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 focus:outline-none",
              active === tab.id
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900",
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <ClockIcon size={13} />
          <span className="text-[11px] font-semibold text-gray-400">Tổng thời lượng</span>
          <span className="font-bold text-gray-900">{totalHours}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <LayersIcon size={13} />
          <span className="text-[11px] font-semibold text-gray-400">Tổng chương</span>
          <span className="font-bold text-gray-900">
            {String(totalChapters).padStart(2, "0")} Chương
          </span>
        </div>

        {/* Sort icons */}
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Lọc" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-all">
            <FilterIcon size={14} />
          </button>
          <button type="button" aria-label="Sắp xếp" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-all">
            <SortIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddChapterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      id="btn-add-chapter"
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-[#4F46E5] hover:bg-indigo-50/30 transition-all duration-200 group cursor-pointer shadow-2xs"
    >
      <span className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#4F46E5] group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#4F46E5] transition-all">
        <PlusCircleIcon size={20} />
      </span>
      <span className="text-xs font-black text-gray-500 group-hover:text-[#4F46E5] transition-colors duration-200 uppercase tracking-wider">
        Thêm Chuyên Đề / Chương Mới
      </span>
    </button>
  );
}


// ─── Chapter Modal ────────────────────────────────────────────────────────────

interface ChapterModalProps {
  isOpen: boolean;
  editingChapter: Chapter | null;
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

function ChapterModal({ isOpen, editingChapter, onSave, onClose }: ChapterModalProps) {
  const [title, setTitle] = useState(editingChapter?.title || "");
  const [description, setDescription] = useState((editingChapter as any)?.description || "");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(editingChapter?.title || "");
      setDescription((editingChapter as any)?.description || "");
      setTitleError("");
    }
  }, [isOpen, editingChapter]);

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">
            {editingChapter ? "Chỉnh sửa Module" : "Thêm Module mới"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <XCloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="chapter-title" className="text-sm font-semibold text-gray-900">
              Tên Module <span className="text-red-500">*</span>
            </label>
            <input
              id="chapter-title"
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
                "w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white border transition-all duration-200 focus:outline-none",
                titleError
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20",
              )}
            />
            {titleError && (
              <p className="text-[12px] text-red-500 font-medium">{titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="chapter-desc" className="text-sm font-semibold text-gray-900">
              Mô tả
            </label>
            <textarea
              id="chapter-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn nội dung module này..."
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs hover:shadow-sm transition-all"
          >
            {editingChapter ? "Lưu thay đổi" : "Thêm Module"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Main Container ───────────────────────────────────────────────────────────

export function LessonManagementContainer({ courseId }: { courseId: string }) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [editingLesson, setEditingLesson] = useState<{
    chapterId: string;
    lesson: Lesson;
  } | null>(null);

  const [activeQuizLesson, setActiveQuizLesson] = useState<string | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  const { data: course } = useInstructorCourse(courseId);
  const { data: chaptersData = [], isLoading } = useCourseModules(courseId);
  
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLesson = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const createQuizMutation = useCreateQuiz();

  const chapters = chaptersData.map((ch, i) => ({
    ...ch,
    index: i + 1,
    collapsed: !!collapsedChapters[ch.id],
    lessons: ch.lessons.map((l) => ({ ...l }))
  }));

  const allLessons   = totalLessons(chapters as any);
  const pubLessons   = publishedLessons(chapters as any);
  const draftLessons = allLessons - pubLessons;
  const duration     = totalDuration(chapters as any);

  const toggleChapter = useCallback((id: string) => {
    setCollapsedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      deleteModuleMutation.mutate({ courseId, moduleId: id });
    }
  }, [courseId, deleteModuleMutation]);

  const updateLesson = useCallback(async (chapterId: string, lessonId: string, updates: Partial<Lesson>) => {
    await updateLessonMutation.mutateAsync({ courseId, lessonId, payload: updates });
    if (updates.quizData) {
      await createQuizMutation.mutateAsync({ lessonId, payload: updates.quizData });
    }
  }, [courseId, updateLessonMutation, createQuizMutation]);

  const deleteLessonHandler = useCallback((chapterId: string, lessonId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
      deleteLessonMutation.mutate({ courseId, lessonId });
    }
  }, [courseId, deleteLessonMutation]);

  const addLesson = useCallback((chapterId: string) => {
    createLesson.mutate({
      courseId,
      moduleId: chapterId,
      payload: {
        title: "Bài học mới",
        type: "video",
        order: chapters.find(c => c.id === chapterId)?.lessons.length || 0,
        status: "draft"
      }
    });
  }, [courseId, chapters, createLesson]);

  const openAddChapterModal = useCallback(() => {
    setEditingChapter(null);
    setIsChapterModalOpen(true);
  }, []);

  const openEditChapterModal = useCallback((chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsChapterModalOpen(true);
  }, []);

  const handleChapterModalSave = useCallback((title: string, description: string) => {
    if (editingChapter) {
      updateModule.mutate({
        courseId,
        moduleId: editingChapter.id,
        title,
        description,
      });
    } else {
      createModule.mutate({
        courseId,
        title,
        description,
        order: chapters.length,
      });
    }
    setIsChapterModalOpen(false);
    setEditingChapter(null);
  }, [editingChapter, updateModule, createModule, courseId, chapters.length]);

  const filteredChapters = chapters.map((ch) => ({
    ...ch,
    lessons:
      activeFilter === "all"
        ? ch.lessons
        : ch.lessons.filter((l) =>
            activeFilter === "public" ? l.status === "published" : l.status === "draft",
          ),
  })).filter((ch) => activeFilter === "all" || ch.lessons.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 py-6 flex flex-col gap-6">
          <Link
            href="/instructor/courses"
            className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-bold hover:underline transition-colors w-fit"
          >
            <ChevronLeftIcon size={14} />
            <span>Quay lại danh sách khóa học</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                {course?.title || "Khóa học"}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Trung tâm quản lý nội dung học liệu và cấu trúc bài giảng AI
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/courses/${courseId}`}
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
              >
                <EyeIcon size={14} />
                <span>Xem trước</span>
              </Link>
              <button
                type="button"
                id="btn-add-lesson"
                onClick={() => addLesson(chapters[0]?.id?.toString() || "ch1")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
              >
                <PlusIcon size={14} />
                <span>Thêm bài giảng</span>
              </button>
            </div>
          </div>

          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            total={allLessons}
            published={pubLessons}
            draft={draftLessons}
            totalHours={duration}
            totalChapters={chapters.length}
          />

          <div className="flex flex-col gap-4">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter as any}
                onToggle={() => toggleChapter(chapter.id.toString())}
                onAddLesson={() => addLesson(chapter.id.toString())}
                onEditLesson={(lesson) => setEditingLesson({ chapterId: chapter.id.toString(), lesson: lesson as any })}
                onDeleteLesson={(lid) => deleteLessonHandler(chapter.id.toString(), lid.toString())}
                onEdit={() => openEditChapterModal(chapter as any)}
                onDelete={() => deleteChapter(chapter.id.toString())}
                onGenerateQuiz={(title) => setActiveQuizLesson(title)}
              />
            ))}

            {filteredChapters.length === 0 && (
              <div className="flex items-center justify-center py-20 text-xs font-bold text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                Không có bài giảng nào phù hợp với bộ lọc này.
              </div>
            )}
          </div>

          <AIAssistCard
            onQuizGenerate={() => setActiveQuizLesson("Toàn bộ khóa học (General Rubric)")}
            onSuggestChapter={openAddChapterModal}
          />

          <AddChapterButton onClick={openAddChapterModal} />
        </div>
      </div>

      <LessonAIQuizModal
        isOpen={!!activeQuizLesson}
        lessonTitle={activeQuizLesson || ""}
        onClose={() => setActiveQuizLesson(null)}
      />
      
      <ChapterModal
        isOpen={isChapterModalOpen}
        editingChapter={editingChapter}
        onSave={handleChapterModalSave}
        onClose={() => {
          setIsChapterModalOpen(false);
          setEditingChapter(null);
        }}
      />

      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson.lesson}
          onSave={async (id, updates) => {
            try {
              await updateLesson(editingLesson.chapterId, id, updates);
              setEditingLesson(null);
            } catch (err) {
              console.error(err);
              throw err; 
            }
          }}
          onClose={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}
