// ─── CreateCourseTopbar ────────────────────────────────────────────────────────
// Minimal topbar for the course-creation flow (no sidebar).

import Link from "next/link";
import { HelpCircleIcon, BellIcon } from "./icons";

function LogoMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_3px_10px_rgba(107,107,255,0.45)] shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="2.5" fill="white" />
        <path
          d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function CreateCourseTopbar() {
  return (
    <header className="h-[60px] shrink-0 flex items-center justify-between px-6 bg-white border-b border-[#F0F0F8]">
      {/* Brand */}
      <Link
        href="/instructor"
        className="flex items-center gap-2.5 group"
        aria-label="MindNova AI — Quay lại Dashboard"
      >
        <LogoMark />
        <span className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight group-hover:text-[#4648D4] transition-colors duration-150">
          MindNova AI
        </span>
      </Link>

      {/* Right nav */}
      <nav className="flex items-center gap-1" aria-label="Liên kết hỗ trợ">
        <Link
          href="/instructor/guide"
          className="px-3 py-2 rounded-lg text-sm text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150"
        >
          Hướng dẫn
        </Link>
        <Link
          href="/instructor/community"
          className="px-3 py-2 rounded-lg text-sm text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150"
        >
          Cộng đồng
        </Link>

        <div className="w-px h-5 bg-[#EAEAF4] mx-1" aria-hidden="true" />

        {/* Help */}
        <button
          type="button"
          aria-label="Trợ giúp"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <HelpCircleIcon />
        </button>

        {/* Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="Tài khoản"
          className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400/40 ml-1"
        >
          <span className="text-white text-xs font-bold">N</span>
        </button>
      </nav>
    </header>
  );
}
