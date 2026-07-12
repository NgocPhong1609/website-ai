// ─── InstructorTopbar ─────────────────────────────────────────────────────────
// Top search + actions bar for the instructor layout.

import Link from "next/link";
import { BellIcon, MessageIcon, SearchIcon, SparklesIcon } from "./icons";

export function InstructorTopbar() {
  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
          <SearchIcon />
        </div>
        <input
          id="instructor-search"
          type="search"
          placeholder="Tìm kiếm khóa học..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <BellIcon />
          {/* Unread dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 border-2 border-white" />
        </button>

        {/* Message */}
        <button
          type="button"
          aria-label="Tin nhắn"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <MessageIcon />
        </button>

        {/* CTA — Tạo khóa học */}
        <Link
          id="btn-create-course"
          href="/instructor/create-course"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_20px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/40"
        >
          <SparklesIcon size={13} />
          + Tạo khóa học
        </Link>
      </div>
    </header>
  );
}

