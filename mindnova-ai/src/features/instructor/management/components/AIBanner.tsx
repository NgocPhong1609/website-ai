// ─── AIBanner ─────────────────────────────────────────────────────────────────
// Promotional AI banner at the top of the course management page (Minimalist Rule #7)

import Link from "next/link";
import { SparklesIcon } from "./icons";

export function AIBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 flex items-center justify-between shadow-2xs">
      {/* Left content */}
      <div className="relative z-10 flex flex-col gap-3 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold w-fit border border-indigo-100">
          <SparklesIcon />
          <span>MindNova AI Assistant</span>
        </div>
        <h2 className="text-[#111827] font-extrabold text-xl tracking-tight">
          Hỗ trợ AI: Sinh đề cương tự động
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed font-medium">
          Sử dụng Trí tuệ Nhân tạo để tự động tạo cấu trúc chương học logic và toàn diện dựa trên tiêu đề khóa học chỉ trong vài giây.
        </p>
        <Link
          id="btn-ai-banner-cta"
          href="/instructor/create-course"
          className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] shadow-2xs hover:shadow-sm transition-all duration-150 w-fit cursor-pointer"
        >
          <SparklesIcon />
          <span>Thử ngay bây giờ</span>
        </Link>
      </div>

      {/* Right decorative graphic (Minimalist Indigo) */}
      <div
        aria-hidden="true"
        className="relative z-10 hidden md:flex items-center justify-center w-32 h-32 mr-4 shrink-0 bg-[#F8FAFC] rounded-2xl border border-gray-100 p-4"
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full text-[#4F46E5]">
          <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.2" />
          <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="60" cy="32" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="84" cy="48" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="84" cy="72" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="60" cy="88" r="5" fill="currentColor" opacity="0.9" />
          <circle cx="36" cy="72" r="5" fill="currentColor" opacity="0.7" />
          <circle cx="36" cy="48" r="5" fill="currentColor" opacity="0.7" />
          <line x1="60" y1="32" x2="84" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="84" y1="48" x2="84" y2="72" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="84" y1="72" x2="60" y2="88" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="60" y1="88" x2="36" y2="72" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="36" y1="72" x2="36" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <line x1="36" y1="48" x2="60" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.15" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}