"use client";

// ─── AIOutlineModal ─────────────────────────────────────────────────────────────
// Modal "Hỗ trợ AI: Lập đề cương thông minh" — nhập chủ đề và sinh đề cương bằng AI.
// Thiết kế nhất quán với design system của create-course feature.

import { useState, useRef, useCallback, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, XIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OutlineChapter {
  title: string;
  lessons: string[];
}

export interface GeneratedOutline {
  chapters: OutlineChapter[];
}

export interface AIOutlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Callback khi instructor muốn áp dụng đề cương vào khóa học */
  onApply?: (outline: GeneratedOutline) => void;
}

type GenerationState = "idle" | "loading" | "done" | "error";

// ─── Mock generator ───────────────────────────────────────────────────────────
// Giả lập gọi AI — trong production sẽ thay bằng API call thực.

async function mockGenerateOutline(topic: string): Promise<GeneratedOutline> {
  await new Promise((r) => setTimeout(r, 1800));
  return {
    chapters: [
      {
        title: `Giới thiệu về ${topic}`,
        lessons: ["Tổng quan và lịch sử phát triển", "Cài đặt môi trường", "Bài tập khởi động"],
      },
      {
        title: "Kiến thức nền tảng",
        lessons: ["Các khái niệm cốt lõi", "Thực hành cơ bản", "Bài kiểm tra nền tảng"],
      },
      {
        title: "Kỹ năng nâng cao",
        lessons: ["Kỹ thuật chuyên sâu", "Case study thực tế", "Dự án cuối module"],
      },
    ],
  };
}

// ─── Local icons ──────────────────────────────────────────────────────────────

const SVG_BASE = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function ListIcon() {
  return (
    <svg {...SVG_BASE} width={20} height={20} strokeWidth={1.6}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function CheckCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG_BASE} width={size} height={size} strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg {...SVG_BASE} width={11} height={11} strokeWidth={2}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg {...SVG_BASE} width={14} height={14} strokeWidth={1.8}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonBar({ className }: { className?: string }) {
  return <div className={twMerge("animate-pulse rounded bg-[#EDEEFF]", className)} />;
}

function OutlineSkeleton() {
  const rows = [3, 2, 3] as const;
  return (
    <div className="flex flex-col gap-4 p-4" aria-busy aria-label="Đang tạo đề cương...">
      {rows.map((count, ci) => (
        <div key={ci} className="rounded-xl border border-[#EAEAF4] bg-[#FAFAFE] p-4 flex flex-col gap-3">
          <SkeletonBar className="h-4 w-2/5" />
          <div className="flex flex-col gap-2 pl-2">
            {Array.from({ length: count }).map((_, li) => (
              <SkeletonBar key={li} className={`h-3 ${li % 2 === 0 ? "w-3/5" : "w-4/5"}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#F0F0FF] flex items-center justify-center text-[#ADADD8]">
        <ListIcon />
      </div>
      <p className="text-sm text-[#B0B0C8] leading-relaxed max-w-[220px]">
        Kết quả đề cương sẽ xuất hiện tại đây
      </p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm text-red-500 font-medium">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="text-[12px] text-[#6B6BFF] underline hover:no-underline transition-all"
      >
        Thử lại
      </button>
    </div>
  );
}

// ─── Chapter card ─────────────────────────────────────────────────────────────

function ChapterCard({ chapter, index }: { chapter: OutlineChapter; index: number }) {
  return (
    <div className="rounded-xl border border-[#EAEAF4] bg-white overflow-hidden shadow-[0_1px_6px_rgba(70,72,212,0.05)] hover:shadow-[0_2px_12px_rgba(70,72,212,0.1)] hover:border-[#D5D5FF] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#F5F3FF] to-[#EEF0FF] border-b border-[#EAEAF4]">
        <div className="w-6 h-6 rounded-lg bg-[#4648D4] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {index + 1}
        </div>
        <span className="text-sm font-semibold text-[#1A1A2E] flex-1 min-w-0 truncate">
          {chapter.title}
        </span>
        <span className="text-[11px] text-[#9090B0] shrink-0">
          {chapter.lessons.length} bài
        </span>
      </div>

      {/* Lessons */}
      <ul className="flex flex-col divide-y divide-[#F4F4FA]">
        {chapter.lessons.map((lesson, li) => (
          <li key={li} className="flex items-center gap-2.5 px-4 py-2.5">
            <span className="w-5 h-5 rounded-md bg-[#EEEEFF] text-[#4648D4] flex items-center justify-center shrink-0">
              <VideoIcon />
            </span>
            <span className="text-[13px] text-[#464554]">
              {li + 1}. {lesson}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Outline result ───────────────────────────────────────────────────────────

interface OutlineResultProps {
  outline: GeneratedOutline;
  onApply?: (outline: GeneratedOutline) => void;
  onRegenerate: () => void;
}

function OutlineResult({ outline, onApply, onRegenerate }: OutlineResultProps) {
  const totalLessons = outline.chapters.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Stats bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-[12px] text-[#6B6BFF] font-semibold">
          <span className="flex items-center gap-1">
            <CheckCircleIcon size={13} />
            {outline.chapters.length} chương
          </span>
          <span className="w-px h-3 bg-[#D5D5FF]" aria-hidden />
          <span>{totalLessons} bài giảng</span>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-1 text-[11px] text-[#9090B0] hover:text-[#6B6BFF] transition-colors duration-150"
        >
          <span className="text-base leading-none">↺</span>
          Tạo lại
        </button>
      </div>

      {/* Chapter list */}
      <div className="flex flex-col gap-2">
        {outline.chapters.map((chapter, i) => (
          <ChapterCard key={i} chapter={chapter} index={i} />
        ))}
      </div>

      {/* Apply CTA */}
      {onApply && (
        <button
          type="button"
          onClick={() => onApply(outline)}
          className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <CheckCircleIcon size={14} />
          Áp dụng đề cương này
        </button>
      )}
    </div>
  );
}


// ─── Modal shell ──────────────────────────────────────────────────────────────

export function AIOutlineModal({ isOpen, onClose, onApply }: AIOutlineModalProps) {
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<GenerationState>("idle");
  const [outline, setOutline] = useState<GeneratedOutline | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus khi modal mở
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  // Đóng bằng Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleGenerate = useCallback(async () => {
    const trimmed = topic.trim();
    if (!trimmed) { inputRef.current?.focus(); return; }

    setState("loading");
    setOutline(null);
    setErrorMsg("");

    try {
      const result = await mockGenerateOutline(trimmed);
      setOutline(result);
      setState("done");
    } catch {
      setErrorMsg("Đã xảy ra lỗi. Vui lòng thử lại.");
      setState("error");
    }
  }, [topic]);

  const handleRegenerate = useCallback(() => {
    if (state !== "loading") handleGenerate();
  }, [state, handleGenerate]);

  const handleApply = useCallback(
    (result: GeneratedOutline) => { onApply?.(result); onClose(); },
    [onApply, onClose],
  );

  const handleReset = useCallback(() => {
    setTopic("");
    setState("idle");
    setOutline(null);
    setErrorMsg("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  if (!isOpen) return null;

  const isLoading  = state === "loading";
  const canGenerate = !!topic.trim() && !isLoading;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label="Hỗ trợ AI: Lập đề cương thông minh"
          className="pointer-events-auto w-full max-w-[520px] bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_20px_60px_rgba(70,72,212,0.18),0_8px_24px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-scaleIn"
        >
          {/* ── Header ── */}
          <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-[#F0F0F8]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(70,72,212,0.35)] shrink-0">
              <SparklesIcon size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-extrabold text-[#1A1A2E] leading-snug tracking-tight">
                Hỗ trợ AI: Lập đề cương thông minh
              </h2>
              <p className="text-[12px] text-[#9090B0] mt-0.5 leading-snug">
                Tạo cấu trúc khóa học chuyên nghiệp chỉ trong vài giây
              </p>
            </div>

            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#1A1A2E] hover:bg-[#F4F4FA] transition-all duration-150 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
            >
              <XIcon size={15} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[70vh]">

            {/* Topic input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="outline-topic" className="text-[13px] font-semibold text-[#464554]">
                Nhập chủ đề khóa học của bạn:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADADC0] pointer-events-none">
                  <SendIcon />
                </span>
                <input
                  ref={inputRef}
                  id="outline-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canGenerate && handleGenerate()}
                  placeholder="Ví dụ: Generative AI Cơ bản"
                  disabled={isLoading}
                  className="w-full h-10 pl-8 pr-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              id="btn-generate-outline"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={twMerge(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40",
                canGenerate
                  ? "text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  : "bg-[#DDDDF5] text-[#ADADD8] cursor-not-allowed",
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Đang tạo đề cương...
                </>
              ) : (
                <>
                  <span className={state !== "idle" ? "" : "animate-pulse"}>
                    <SparklesIcon size={14} />
                  </span>
                  Lập đề cương
                </>
              )}
            </button>

            {/* Result area */}
            <div className="flex flex-col gap-2">
              {/* Section header */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#EEEEFF] text-[#6B6BFF] flex items-center justify-center">
                  <ListIcon />
                </div>
                <span className="text-[13px] font-semibold text-[#464554]">
                  Đề cương gợi ý của AI
                </span>

                {/* Reset hint after done */}
                {state === "done" && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-auto text-[11px] text-[#9090B0] hover:text-[#6B6BFF] transition-colors"
                  >
                    Nhập lại chủ đề
                  </button>
                )}
              </div>

              {/* Content states */}
              <div className="rounded-xl border border-[#EAEAF4] bg-[#FAFAFE] min-h-[160px]">
                {state === "idle" && (
                  <EmptyState />
                )}

                {state === "loading" && (
                  <div className="p-4">
                    <OutlineSkeleton />
                  </div>
                )}

                {state === "error" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="text-[12px] text-[#6B6BFF] underline hover:no-underline transition-all"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {state === "done" && outline && (
                  <div className="p-3">
                    <OutlineResult
                      outline={outline}
                      onApply={onApply ? handleApply : undefined}
                      onRegenerate={handleRegenerate}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
