"use client";

// ─── LessonManagementContainer ────────────────────────────────────────────────
// Màn hình quản lý bài học chi tiết cho một khóa học — drag/drop chapters +
// lessons, filter tabs, AI assist card, add chapter CTA, và chat FAB.

import { useState, useCallback } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
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
type LessonType   = "video" | "document" | "quiz";
type FilterTab    = "all" | "public" | "draft";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string; // "MM:SS"
  status: LessonStatus;
}

interface Chapter {
  id: string;
  index: number;
  title: string;
  lessons: Lesson[];
  collapsed: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    index: 1,
    title: "Giới thiệu về Generative AI",
    collapsed: false,
    lessons: [
      { id: "l1", title: "Bài học 1.1: Khái niệm cơ bản & Lịch sử hình thành", type: "video",    duration: "15:20", status: "published" },
      { id: "l2", title: "Bài học 1.2: Các mô hình ngôn ngữ lớn (LLMs) hoạt động như thế nào?", type: "document", duration: "22:45", status: "published" },
    ],
  },
  {
    id: "ch2",
    index: 2,
    title: "Kỹ thuật Prompt Engineering cơ bản",
    collapsed: false,
    lessons: [
      { id: "l3", title: "Bài học 2.1: Cấu trúc của một Prompt hiệu quả",        type: "video", duration: "18:05", status: "draft"     },
      { id: "l4", title: "Bài học 2.2: Kỹ thuật Few-shot vs Zero-shot prompting", type: "video", duration: "25:10", status: "published" },
    ],
  },
];

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

// ─── Lesson Icon ──────────────────────────────────────────────────────────────

function LessonTypeIcon({ type }: { type: LessonType }) {
  return (
    <span className="w-6 h-6 rounded-md bg-[#F4F4FA] text-[#9090B0] flex items-center justify-center shrink-0">
      {type === "video"    && <VideoIcon size={12} />}
      {type === "document" && <DocumentIcon size={12} />}
      {type === "quiz"     && <VideoIcon size={12} />}
    </span>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

interface LessonRowProps {
  lesson: Lesson;
  onDelete: () => void;
}

function LessonRow({ lesson, onDelete }: LessonRowProps) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFE] transition-colors duration-100 border-b border-[#F4F4FA] last:border-0">
      {/* Drag handle */}
      <span className="text-[#D0D0E8] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <GripIcon size={14} />
      </span>

      {/* Type icon */}
      <LessonTypeIcon type={lesson.type} />

      {/* Title */}
      <p className="flex-1 text-[13px] text-[#1A1A2E] font-medium truncate min-w-0">
        {lesson.title}
      </p>

      {/* Duration */}
      <span className="flex items-center gap-1 text-[11px] text-[#9090B0] shrink-0 font-mono">
        <ClockIcon size={11} />
        {lesson.duration}
      </span>

      {/* Status badge */}
      <LessonStatusBadge status={lesson.status} />

      {/* Actions (hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          aria-label="Chỉnh sửa bài học"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
        >
          <PencilIcon size={12} />
        </button>
        <button
          type="button"
          aria-label="Xóa bài học"
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
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
  onDeleteLesson: (lessonId: string) => void;
  onDelete: () => void;
}

function ChapterCard({ chapter, onToggle, onAddLesson, onDeleteLesson, onDelete }: ChapterCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Chapter header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FAFAFE] transition-colors">
        {/* Drag handle */}
        <span className="text-[#D0D0E8] cursor-grab shrink-0">
          <GripIcon size={16} />
        </span>

        {/* Chapter badge */}
        <span className="px-2.5 py-1 rounded-lg bg-[#6B6BFF] text-white text-[11px] font-bold tracking-wide shrink-0">
          Chương {chapter.index}
        </span>

        {/* Title */}
        <span className="flex-1 text-[13px] font-semibold text-[#1A1A2E] truncate min-w-0">
          {chapter.title}
        </span>

        {/* Chapter actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            aria-label="Chỉnh sửa chương"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label="Xóa chương"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <TrashIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={chapter.collapsed ? "Mở rộng chương" : "Thu gọn chương"}
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            {chapter.collapsed ? <ChevronDownIcon size={14} /> : <ChevronUpIcon size={14} />}
          </button>
        </div>
      </div>

      {/* Lesson list (collapsible) */}
      {!chapter.collapsed && (
        <div className="border-t border-[#F4F4FA]">
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onDelete={() => onDeleteLesson(lesson.id)}
            />
          ))}

          {/* Add lesson CTA */}
          <button
            type="button"
            onClick={onAddLesson}
            className="w-full flex items-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#6B6BFF] hover:bg-[#F5F3FF] transition-colors duration-150 border-t border-dashed border-[#D5D5FF] group"
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

// ─── Main Container ───────────────────────────────────────────────────────────

export function LessonManagementContainer() {
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  // ── Derived stats ───────────────────────────────────────────────────────────
  const allLessons   = totalLessons(chapters);
  const pubLessons   = publishedLessons(chapters);
  const draftLessons = allLessons - pubLessons;
  const duration     = totalDuration(chapters);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleChapter = useCallback((id: string) => {
    setChapters((prev) =>
      prev.map((ch) => ch.id === id ? { ...ch, collapsed: !ch.collapsed } : ch),
    );
  }, []);

  const deleteChapter = useCallback((id: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  }, []);

  const deleteLesson = useCallback((chapterId: string, lessonId: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
          : ch,
      ),
    );
  }, []);

  const addLesson = useCallback((chapterId: string) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: `Bài học mới`,
      type: "video",
      duration: "00:00",
      status: "draft",
    };
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch,
      ),
    );
  }, []);

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: `ch${Date.now()}`,
      index: chapters.length + 1,
      title: `Chương ${chapters.length + 1}: Chương học mới`,
      lessons: [],
      collapsed: false,
    };
    setChapters((prev) => [...prev, newChapter]);
  }, [chapters.length]);

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
              <h1 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
                Generative AI Cơ bản
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
                chapter={chapter}
                onToggle={() => toggleChapter(chapter.id)}
                onAddLesson={() => addLesson(chapter.id)}
                onDeleteLesson={(lid) => deleteLesson(chapter.id, lid)}
                onDelete={() => deleteChapter(chapter.id)}
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
            onSuggestChapter={() => addChapter()}
          />

          {/* Add Chapter CTA */}
          <AddChapterButton onClick={addChapter} />
        </div>
      </div>

      <PageFooter />
      <ChatFAB />
    </div>
  );
}
