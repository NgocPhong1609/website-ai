import Link from "next/link";
import { AI_SUGGESTION } from "../constants";
import type { AiSuggestion } from "../types";

function SparkleIcon() {
  return (
    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(80,82,238,0.3)] relative group-hover:scale-105 transition-all">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z" />
        <path d="M9 16v.01" />
        <path d="M15 16v.01" />
      </svg>
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-white animate-pulse" />
    </div>
  );
}

interface AiSuggestionCardProps {
  suggestion?: AiSuggestion;
}

export function AiSuggestionCard({ suggestion = AI_SUGGESTION }: AiSuggestionCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF] via-[#F3F4FC] to-[#EAF8F5] border border-[#5052EE]/25 p-5 shadow-sm hover:shadow-md transition-all duration-300 w-full">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <SparkleIcon />

        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Badge & Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#4648D4] text-xs font-semibold border border-[#6B6BFF]/20 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span>Gợi ý từ Trợ lý AI Nova</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-xs font-medium text-[#64647A] border border-[#EAEAF4]">
                ⏱️ Thời gian: 15 phút
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#0D9488]/20">
              ✨ Chẩn đoán thời gian thực
            </span>
          </div>

          {/* Message Content */}
          <p className="text-sm sm:text-base font-bold text-[#1A1A2E] tracking-tight leading-snug group-hover:text-[#4648D4] transition-colors duration-200">
            &quot;Chúng tôi nhận thấy bạn vừa dành 20 phút xử lý vướng mắc về Hydration errors. Hãy thử ôn tập chuyên sâu học phần <span className="text-[#5052EE]">Server vs Client Leaf Node Components</span> nhé!&quot;
          </p>

          <div className="flex items-center gap-2 text-xs text-[#64647A] font-normal italic bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/70">
            <span className="text-[#5052EE] font-semibold">💡 Lý do đề xuất:</span>
            <span>Điểm kiểm tra kỹ năng State &amp; Client Components lần trước là 58%.</span>
          </div>

          {/* Compact Interactive Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/courses/lesson"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-[0_4px_12px_rgba(80,82,238,0.35)] hover:shadow-[0_6px_18px_rgba(80,82,238,0.5)] hover:-translate-y-0.5 transition-all duration-200 text-decoration-none group/btn"
            >
              <span>Vào bài ôn tập ngay</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
            </Link>

            <Link
              href="/study-plan"
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#64647A] hover:text-[#4648D4] bg-white hover:bg-[#EEF2FF] border border-[#EAEAF4] hover:border-[#6B6BFF]/30 transition-all text-decoration-none"
            >
              Cấu hình mục tiêu AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
