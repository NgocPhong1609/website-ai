"use client";

// ─── LessonManagementContainer ────────────────────────────────────────────────
// Màn hình quản lý bài học chi tiết cho một khóa học — drag/drop chapters +
// lessons, filter tabs, AI assist card, add chapter CTA, và chat FAB.

import { useState, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
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
  MessageCircleIcon,
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
} from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "published" | "draft";
type LessonType   = "video" | "article" | "quiz_module";
type FilterTab    = "all" | "public" | "draft";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string; // "MM:SS"
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

// ─── Mock data ────────────────────────────────────────────────────────────────

// No INITIAL_CHAPTERS needed anymore

// ─── Helpers ──────────────────────────────────────────────────────────────────

function totalDuration(chapters: Chapter[]): string {
  let secs = 0;
  chapters.forEach((ch) =>
    ch.lessons.forEach((l) => {
      const [m, s] = l.duration.split(":").map(Number);
      secs += (m || 0) * 60 + (s || 0);
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
          ? "bg-[#EEF0FF] text-[#4648D4]"
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
  if (type === "video") return <VideoIcon size={14} />;
  if (type === "quiz_module") return <HelpCircleIcon size={14} />;
  return <DocumentIcon size={14} />;
}

function getLessonColor(type: LessonType) {
  if (type === "video") return "text-[#4648D4] bg-[#EEEEFF]";
  if (type === "quiz_module") return "text-[#059669] bg-[#ECFDF5]";
  return "text-[#D97706] bg-[#FFFBEB]";
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}

function LessonRow({ lesson, onEdit, onDelete }: LessonRowProps) {
  return (
    <div
      className={twMerge(
        "group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#EAEAF4] bg-white hover:border-[#D5D5FF] hover:bg-[#FAFAFE] transition-all duration-150"
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
          getLessonColor(lesson.type)
        )}
      >
        <LessonTypeIcon type={lesson.type} />
      </span>

      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm text-[#1A1A2E] truncate block">
          {lesson.title}
        </span>
        <LessonStatusBadge status={lesson.status} />
      </div>

      {/* Duration */}
      <span className="flex items-center gap-1 text-[11px] text-[#9090B0] shrink-0 font-mono">
        <ClockIcon size={11} />
        {lesson.duration}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Soạn thảo bài học"
          onClick={onEdit}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          <PencilIcon size={13} />
        </button>
        <button
          type="button"
          aria-label="Xóa bài học"
          onClick={onDelete}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <TrashIcon size={13} />
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
}

function ChapterCard({ chapter, onToggle, onAddLesson, onEditLesson, onDeleteLesson, onEdit, onDelete }: ChapterCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(70,72,212,0.05)] transition-all duration-200">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-5 py-4 group">
        {/* Drag handle */}
        <span className="text-[#C8C8E0] group-hover:text-[#9090B0] cursor-grab active:cursor-grabbing transition-colors shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Collapse/expand toggle */}
        <button
          type="button"
          aria-label={chapter.collapsed ? "Mở rộng" : "Thu gọn"}
          onClick={onToggle}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
        >
          {chapter.collapsed ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
        </button>

        {/* Left accent */}
        <div className="w-1 h-8 rounded-full bg-[#4648D4] shrink-0" />

        {/* Number + title + description */}
        <div
          className="flex flex-col flex-1 min-w-0 cursor-pointer"
          onClick={onToggle}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9090B0]">
            Chương {chapter.index}
          </span>
          <span className="text-base font-bold text-[#1A1A2E] truncate">
            {chapter.title}
          </span>
        </div>

        {/* Lesson count badge */}
        <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#4648D4]">
          {chapter.lessons.length} bài
        </span>

        {/* Module actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            onClick={onEdit}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEEEFF] transition-all"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      {/* Lesson list (collapsible) */}
      {!chapter.collapsed && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-t border-[#F4F4FA] pt-3">
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onEdit={() => onEditLesson(lesson)}
              onDelete={() => onDeleteLesson(lesson.id)}
            />
          ))}

          {/* Add lesson CTA */}
          <button
            type="button"
            onClick={onAddLesson}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#D5D5FF] text-[#6B6BFF] text-sm font-medium hover:border-[#6B6BFF] hover:bg-[#F5F3FF] transition-all duration-200 group mt-1"
          >
            <span className="group-hover:rotate-90 transition-transform duration-200">
              <PlusIcon size={14} />
            </span>
            Thêm bài giảng mới
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
    <div className="rounded-2xl border border-[#C5C6FF] bg-gradient-to-r from-[#F5F3FF] to-[#EEF0FF] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon + text */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[#6B6BFF]">
          <span className="animate-pulse"><SparklesIcon size={13} /></span>
          <span className="text-[10px] font-bold tracking-widest uppercase">
            MindNova AI Assist
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#1A1A2E]">
          Sử dụng AI để tối ưu lộ trình học tập
        </p>
        <p className="text-[12px] text-[#64647A] leading-relaxed max-w-[420px]">
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
          className="px-4 py-2.5 rounded-xl border border-[#C5C6FF] text-[13px] font-semibold text-[#4648D4] bg-white hover:bg-[#EEF0FF] hover:border-[#6B6BFF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          Sinh câu hỏi Quiz
        </button>
        <button
          type="button"
          id="btn-suggest-chapter"
          onClick={onSuggestChapter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
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
              "px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
              active === tab.id
                ? "bg-[#6B6BFF] text-white shadow-[0_2px_8px_rgba(107,107,255,0.3)]"
                : "bg-[#F4F4FA] text-[#64647A] hover:bg-[#EAEAF4]",
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
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <ClockIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng thời lượng</span>
          <span className="font-bold text-[#1A1A2E]">{totalHours}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#464554]">
          <LayersIcon size={13} />
          <span className="text-[11px] font-semibold text-[#9090B0]">Tổng chương</span>
          <span className="font-bold text-[#1A1A2E]">
            {String(totalChapters).padStart(2, "0")} Chương
          </span>
        </div>

        {/* Sort icons */}
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Lọc" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <FilterIcon size={14} />
          </button>
          <button type="button" aria-label="Sắp xếp" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all">
            <SortIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page Topbar ──────────────────────────────────────────────────────────────

function PageTopbar() {
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Brand */}
      <Link
        href="/instructor"
        className="text-[15px] font-extrabold text-[#4648D4] tracking-tight hover:text-[#3D40C0] transition-colors shrink-0"
      >
        MindNova AI
      </Link>

      <div className="w-px h-5 bg-[#EAEAF4] mx-1" aria-hidden />

      {/* Context breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#64647A] shrink-0">
        <LayersIcon size={13} />
        <span className="font-semibold">Quản lý Khóa học</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block w-52">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="lesson-search"
          type="search"
          placeholder="Tìm kiếm bài học..."
          className="w-full pl-9 pr-3 h-9 rounded-xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all duration-200"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Thông báo" className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <BellIcon size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
        </button>
        <button type="button" aria-label="Trợ giúp" className="w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <HelpCircleIcon size={17} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-[12px] font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] cursor-pointer ml-0.5">
          N
        </div>
      </div>
    </header>
  );
}

// ─── Add Chapter CTA ──────────────────────────────────────────────────────────

function AddChapterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      id="btn-add-chapter"
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-2xl border-2 border-dashed border-[#D5D5F0] bg-white hover:border-[#6B6BFF] hover:bg-[#F5F3FF] transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
    >
      <span className="w-10 h-10 rounded-full border-2 border-dashed border-[#C5C6FF] group-hover:border-[#6B6BFF] group-hover:bg-[#EEF0FF] flex items-center justify-center text-[#9090B0] group-hover:text-[#6B6BFF] transition-all duration-200">
        <PlusCircleIcon size={20} />
      </span>
      <span className="text-[13px] font-semibold text-[#9090B0] group-hover:text-[#6B6BFF] transition-colors duration-200">
        Thêm Chương mới
      </span>
    </button>
  );
}

// ─── Page Footer ─────────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer className="border-t border-[#F0F0F8] bg-white px-6 py-3 flex items-center justify-between text-[11px] text-[#B0B0C8]">
      <span>© 2024 MindNova AI Education Platform. All rights reserved.</span>
      <div className="flex items-center gap-4">
        {["Hướng dẫn giảng viên", "Chính sách bảo mật", "Hỗ trợ"].map((l) => (
          <button key={l} type="button" className="hover:text-[#4648D4] transition-colors duration-150">
            {l}
          </button>
        ))}
      </div>
    </footer>
  );
}

// ─── Chat FAB ────────────────────────────────────────────────────────────────

function ChatFAB() {
  return (
    <button
      type="button"
      id="btn-chat-fab"
      aria-label="Mở hộp chat hỗ trợ"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(107,107,255,0.5)] hover:shadow-[0_10px_30px_rgba(107,107,255,0.65)] hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <MessageCircleIcon size={18} />
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
          <h2 className="text-[16px] font-bold text-[#1A1A2E]">
            {editingChapter ? "Chỉnh sửa Module" : "Thêm Module mới"}
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
            <label htmlFor="chapter-title" className="text-sm font-semibold text-[#1A1A2E]">
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
            <label htmlFor="chapter-desc" className="text-sm font-semibold text-[#1A1A2E]">
              Mô tả
            </label>
            <textarea
              id="chapter-desc"
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

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Collapse state since it's not stored in DB
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

  // Enhance chapter data with collapsed state
  const chapters = chaptersData.map((ch, i) => ({
    ...ch,
    index: i + 1,
    collapsed: !!collapsedChapters[ch.id],
    lessons: ch.lessons.map((l) => ({ ...l, duration: "00:00" })) // Mock duration for now
  }));

  // ── Derived stats ───────────────────────────────────────────────────────────
  const allLessons   = totalLessons(chapters as any);
  const pubLessons   = publishedLessons(chapters as any);
  const draftLessons = allLessons - pubLessons;
  const duration     = totalDuration(chapters as any);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleChapter = useCallback((id: string) => {
    setCollapsedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      deleteModuleMutation.mutate({ courseId, moduleId: id });
    }
  }, [courseId, deleteModuleMutation]);

  const updateLesson = useCallback((chapterId: string, lessonId: string, updates: Partial<Lesson>) => {
    updateLessonMutation.mutate({ courseId, lessonId, payload: updates });
    if (updates.quizData) {
      createQuizMutation.mutate({ lessonId, payload: updates.quizData });
    }
  }, [courseId, updateLessonMutation, createQuizMutation]);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
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

  // ── Filtered chapters ──────────────────────────────────────────────────────
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
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <PageTopbar />

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6 flex flex-col gap-5">

          {/* Back link */}
          <Link
            href="/instructor/courses"
            className="flex items-center gap-1 text-[13px] text-[#6B6BFF] font-semibold hover:text-[#4648D4] transition-colors w-fit"
          >
            <ChevronLeftIcon size={14} />
            Quay lại danh sách khóa học
          </Link>

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 suppressHydrationWarning className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
                {course?.title || "Khóa học"}
              </h1>
              <p className="text-[13px] text-[#9090B0] mt-1">
                Quản lý nội dung và cấu trúc bài giảng
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-preview-course"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-semibold text-[#464554] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
              >
                <EyeIcon size={13} />
                Xem trước
              </button>
              <button
                type="button"
                id="btn-add-lesson"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
              >
                <PlusIcon size={13} />
                Thêm Bài học mới
              </button>
            </div>
          </div>

          {/* Filter + stats bar */}
          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            total={allLessons}
            published={pubLessons}
            draft={draftLessons}
            totalHours={duration}
            totalChapters={chapters.length}
          />

          {/* Chapter list */}
          <div className="flex flex-col gap-3">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter as any}
                onToggle={() => toggleChapter(chapter.id.toString())}
                onAddLesson={() => addLesson(chapter.id.toString())}
                onEditLesson={(lesson) => setEditingLesson({ chapterId: chapter.id.toString(), lesson: lesson as any })}
                onDeleteLesson={(lid) => deleteLesson(chapter.id.toString(), lid.toString())}
                onEdit={() => openEditChapterModal(chapter as any)}
                onDelete={() => deleteChapter(chapter.id.toString())}
              />
            ))}

            {filteredChapters.length === 0 && (
              <div className="flex items-center justify-center py-16 text-[13px] text-[#B0B0C8]">
                Không có bài học nào phù hợp với bộ lọc này.
              </div>
            )}
          </div>

          {/* AI Assist */}
          <AIAssistCard
            onQuizGenerate={() => alert("Đang sinh câu hỏi Quiz...")}
            onSuggestChapter={openAddChapterModal}
          />

          {/* Add Chapter CTA */}
          <AddChapterButton onClick={openAddChapterModal} />
        </div>
      </div>

      <PageFooter />
      <ChatFAB />

      {/* Modals */}
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
          onSave={(id, updates) => {
            updateLesson(editingLesson.chapterId, id, updates);
            setEditingLesson(null);
          }}
          onClose={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
}
