import Link from "next/link";

import { Sparkles } from "lucide-react";

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
      <Sparkles className="w-5 h-5 text-white" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SidebarBrand({ isCollapsed }: { isCollapsed?: boolean }) {
 return (
 <Link href="/" className="flex items-center gap-3 group" aria-label="MindNova AI home">
 <LogoMark />
 {!isCollapsed && (
 <div className="flex flex-col leading-tight overflow-hidden whitespace-nowrap">
 <span className="text-[14px] font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-150">
 MindNova AI
 </span>
 <span className="text-[10px] text-slate-400 font-medium tracking-wide">
 AI-Powered Learning
 </span>
 </div>
 )}
 </Link>
 );
}
