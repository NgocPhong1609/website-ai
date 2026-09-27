// ─── CreateCourseTopbar ────────────────────────────────────────────────────────
// Minimal topbar for the course-creation flow (no sidebar).

import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { Bell, HelpCircle } from "lucide-react";

function LogoMark() {
  return (
    <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-blue-100/60 bg-[#0F265C] shrink-0">
      <Image
        src="/images/logo.png"
        alt="MindNova AI"
        width={32}
        height={32}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}

export function CreateCourseTopbar() {
 return (
 <header className="h-[60px] shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
 {/* Brand */}
 <Link
 href="/instructor"
 className="flex items-center gap-2.5 group"
 aria-label="MindNova AI — Quay lại Dashboard"
 >
 <LogoMark />
 <span className="text-[15px] font-semibold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-150">
 MindNova AI
 </span>
 </Link>

 {/* Right nav */}
 <nav className="flex items-center gap-1" aria-label="Liên kết hỗ trợ">
 <Link
 href="/instructor/guide"
 className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
 >
 Hướng dẫn
 </Link>
 <Link
 href="/instructor/community"
 className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
 >
 Cộng đồng
 </Link>

 <div className="w-px h-5 bg-slate-200 mx-1" aria-hidden="true" />

 {/* Help */}
 <button
 type="button"
 aria-label="Trợ giúp"
 className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
 >
 <HelpCircle size={18} />
 </button>

 {/* Bell */}
 <button
 type="button"
 aria-label="Thông báo"
 className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
 >
 <Bell size={18} />
 <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 border border-white" />
 </button>

 {/* Avatar */}
 <button
 type="button"
 aria-label="Tài khoản"
 className="ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-full"
 >
 <Avatar fallback="N" size="sm" className="hover:shadow-md transition-all duration-150" />
 </button>
 </nav>
 </header>
 );
}
