import React from "react";
import { SidebarLogo } from "@/src/components/ui";

// ─── Logo mark (Styled for White Sidebar Theme) ────────────────────────────────

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4648D4] to-[#383AB8] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 border border-indigo-100">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="2.5" fill="white" />
        <path
          d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SidebarBrand() {
  return (
    <SidebarLogo
      href="/dashboard"
      logoText="MindNova AI"
      subText="AI-Powered Learning"
      icon={<LogoMark />}
    />
  );
}
