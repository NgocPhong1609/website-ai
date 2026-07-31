"use client";

import Link from "next/link";
import { HelpCircleIcon, BellIcon } from "./icons";

// ─── CreateCourseTopbar ───────────────────────────────────────────────────────
// Fixed top navigation bar for the create/edit course wizard.

export function CreateCourseTopbar() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-[#F0F0F8]">
      {/* Brand / back link */}
      <Link
        href="/instructor"
        className="flex items-center gap-2 text-[#4648D4] hover:text-[#3A3CB8] transition-colors"
        aria-label="Quay lại trang quản lý"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-[14px] font-bold tracking-tight">MindNova Studio</span>
      </Link>

      {/* Title */}
      <span className="text-[14px] font-semibold text-[#3C3C5A] hidden sm:block">
        Tạo khóa học mới
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 text-[#9090B0]">
        <button
          type="button"
          aria-label="Trợ giúp"
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all"
        >
          <HelpCircleIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Thông báo"
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all"
        >
          <BellIcon size={18} />
        </button>
      </div>
    </header>
  );
}
