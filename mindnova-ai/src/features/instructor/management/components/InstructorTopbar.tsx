// ─── InstructorTopbar ─────────────────────────────────────────────────────────
// Top navigation bar — brand name + icon actions on the right.

import Link from "next/link";
import { BellIcon } from "./icons";

// ─── Local icons ──────────────────────────────────────────────────────────────

const NAV_SVG = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function HelpIcon() {
  return (
    <svg {...NAV_SVG} width={18} height={18}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── User Avatar ──────────────────────────────────────────────────────────────

function UserAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-[13px] font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] shrink-0 cursor-pointer hover:shadow-[0_4px_14px_rgba(107,107,255,0.45)] transition-all duration-150">
      N
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InstructorTopbar() {
  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Brand */}
      <Link
        href="/instructor"
        className="text-[15px] font-extrabold text-[#4648D4] tracking-tight hover:text-[#3D40C0] transition-colors duration-150 shrink-0"
        aria-label="MindNova AI"
      >
        MindNova AI
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border-2 border-white" />
        </button>

        {/* Help */}
        <button
          type="button"
          aria-label="Trợ giúp"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <HelpIcon />
        </button>

        {/* Avatar */}
        <UserAvatar />
      </div>
    </header>
  );
}
