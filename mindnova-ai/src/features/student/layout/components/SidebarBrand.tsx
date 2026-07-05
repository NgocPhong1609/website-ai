import Link from "next/link";

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_4px_12px_rgba(107,107,255,0.45)] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

// ─── Component ────────────────────────────────────────────────────────────────

export function SidebarBrand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 group" aria-label="MindNova AI home">
      <LogoMark />
      <div className="flex flex-col leading-tight">
        <span className="text-[14px] font-extrabold text-[#1A1A2E] tracking-tight group-hover:text-[#4648D4] transition-colors duration-150">
          MindNova AI
        </span>
        <span className="text-[10px] text-[#9090B0] font-medium tracking-wide">
          AI-Powered Learning
        </span>
      </div>
    </Link>
  );
}
