import Link from "next/link";
import Image from "next/image";

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-blue-100/60 shrink-0 bg-[#0F265C]">
      <Image
        src="/images/logo.png"
        alt="MindNova AI"
        width={36}
        height={36}
        className="w-full h-full object-cover"
        priority
      />
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
