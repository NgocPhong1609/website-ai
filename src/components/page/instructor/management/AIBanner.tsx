// ─── AIBanner ─────────────────────────────────────────────────────────────────
// Promotional AI banner at the top of the course management page.

import { SparklesIcon } from "./icons";

export function AIBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4648D4] via-[#5B5DE8] to-[#6B6BFF] p-6 flex items-center justify-between min-h-[120px]">
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-10 right-32 w-56 h-56 rounded-full bg-[#4CD7F6]/10 blur-3xl pointer-events-none"
      />

      {/* Left content */}
      <div className="relative z-10 flex flex-col gap-2 max-w-sm">
        <h2 className="text-white font-bold text-xl leading-snug">
          Hỗ trợ AI: Sinh đề cương
        </h2>
        <p className="text-white/75 text-sm leading-relaxed">
          Sử dụng MindNova AI để tự động tạo cấu trúc chương học dựa trên
          tiêu đề khóa học của bạn chỉ trong vài giây.
        </p>
        <button
          id="btn-ai-banner-cta"
          type="button"
          className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#4648D4] bg-white hover:bg-white/90 active:bg-white/80 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-fit"
        >
          <SparklesIcon />
          Thử ngay bây giờ
        </button>
      </div>

      {/* Right decorative illustration */}
      <div
        aria-hidden="true"
        className="relative z-10 hidden md:flex items-center justify-center w-28 h-28 mr-4"
      >
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full opacity-80">
          {/* Brain / neural network illustration */}
          <circle cx="60" cy="60" r="40" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
          <circle cx="60" cy="60" r="28" stroke="white" strokeWidth="1" opacity="0.2" />
          <circle cx="60" cy="60" r="12" fill="white" opacity="0.15" />
          {/* Nodes */}
          <circle cx="60" cy="32" r="4" fill="white" opacity="0.7" />
          <circle cx="84" cy="48" r="4" fill="white" opacity="0.7" />
          <circle cx="84" cy="72" r="4" fill="white" opacity="0.7" />
          <circle cx="60" cy="88" r="4" fill="white" opacity="0.7" />
          <circle cx="36" cy="72" r="4" fill="white" opacity="0.7" />
          <circle cx="36" cy="48" r="4" fill="white" opacity="0.7" />
          {/* Connections */}
          <line x1="60" y1="32" x2="84" y2="48" stroke="white" strokeWidth="1" opacity="0.4" />
          <line x1="84" y1="48" x2="84" y2="72" stroke="white" strokeWidth="1" opacity="0.4" />
          <line x1="84" y1="72" x2="60" y2="88" stroke="white" strokeWidth="1" opacity="0.4" />
          <line x1="60" y1="88" x2="36" y2="72" stroke="white" strokeWidth="1" opacity="0.4" />
          <line x1="36" y1="72" x2="36" y2="48" stroke="white" strokeWidth="1" opacity="0.4" />
          <line x1="36" y1="48" x2="60" y2="32" stroke="white" strokeWidth="1" opacity="0.4" />
          {/* Center glow */}
          <circle cx="60" cy="60" r="6" fill="white" opacity="0.9" />
          <circle cx="60" cy="60" r="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}
