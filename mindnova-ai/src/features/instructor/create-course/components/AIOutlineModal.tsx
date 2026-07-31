"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneratedOutlineChapter {
  title: string;
  lessons: string[];
}

export interface GeneratedOutline {
  chapters: GeneratedOutlineChapter[];
}

interface AIOutlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (outline: GeneratedOutline) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AIOutlineModal({ isOpen, onClose, onApply }: AIOutlineModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState<GeneratedOutline | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Placeholder: simulate AI generation
    await new Promise((r) => setTimeout(r, 1200));

    setOutline({
      chapters: [
        { title: "Giới thiệu", lessons: ["Tổng quan khóa học", "Cài đặt môi trường"] },
        { title: "Nội dung chính", lessons: ["Bài học 1", "Bài học 2", "Bài học 3"] },
        { title: "Nâng cao", lessons: ["Chủ đề nâng cao", "Dự án thực hành"] },
      ],
    });
    setIsGenerating(false);
  };

  const handleApply = () => {
    if (outline) {
      onApply(outline);
      setOutline(null);
      setPrompt("");
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAF4]">
            <div className="flex items-center gap-2">
              <span className="text-[#4648D4]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                </svg>
              </span>
              <h2 className="text-[16px] font-bold text-[#1A1A2E]">Tạo giáo trình bằng AI</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F4F4FA] text-[#9090B0] transition-colors"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <p className="text-[13px] text-[#7878A0] leading-relaxed">
              Mô tả khóa học hoặc chủ đề bạn muốn tạo, AI sẽ gợi ý cấu trúc giáo trình phù hợp.
            </p>

            <textarea
              id="ai-outline-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Khóa học React cho người mới bắt đầu, từ cơ bản đến xây dựng dự án..."
              rows={4}
              className="w-full rounded-xl border border-[#EAEAF4] bg-[#F8F8FC] px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none transition focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white resize-none"
            />

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Đang tạo...
                </>
              ) : (
                "✨ Tạo giáo trình"
              )}
            </button>

            {/* Generated outline preview */}
            {outline && (
              <div className="rounded-xl border border-[#EAEAF4] bg-[#F8F8FC] p-4 flex flex-col gap-3">
                <p className="text-[12px] font-bold text-[#4648D4] uppercase tracking-wider">Gợi ý giáo trình</p>
                {outline.chapters.map((chapter, i) => (
                  <div key={i}>
                    <p className="text-[13px] font-bold text-[#1A1A2E] mb-1">
                      Chương {i + 1}: {chapter.title}
                    </p>
                    <ul className="flex flex-col gap-0.5 pl-3">
                      {chapter.lessons.map((lesson, j) => (
                        <li key={j} className="text-[12px] text-[#7878A0] flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#B0B0C8] shrink-0" />
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={twMerge(
            "flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAEAF4]",
            !outline && "hidden"
          )}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:shadow-md transition-all"
            >
              Áp dụng giáo trình
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
