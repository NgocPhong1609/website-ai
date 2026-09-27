"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { axiosClient } from "@/src/shared/lib/axios";
import { MOBILE_SIDEBAR_EVENT } from "@/src/features/student/layout/components/mobileSidebar";

import { Menu, Plus, BookOpen, DollarSign, FileQuestion, MessageSquare, Users, UserRound, type LucideIcon } from "lucide-react";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";

function LogoMark() {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm border border-blue-100/60 bg-[#0F265C]">
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

function CreateCourseCTA() {
 return (
 <div className="px-1 py-1 shrink-0">
 <Link
 href="/instructor/create-course"
 title="Create New Course"
 className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 <span className="truncate tracking-wide uppercase font-bold">TẠO KHÓA HỌC MỚI</span>
 </Link>
 </div>
 );
}



interface NavItem {
 label: string;
 href: string;
 activePatterns?: string[];
 Icon: LucideIcon;
 isCollapsed?: boolean;
}

function SidebarNavItem({ label, href, activePatterns, Icon, isCollapsed }: NavItem) {
 const pathname = usePathname();
 // Mark as active if it's the exact path, a sub-path, or matches any activePatterns
 const isActive = pathname === href || pathname.startsWith(href + "/") || (activePatterns && activePatterns.some(pattern => pathname.startsWith(pattern)));

 return (
 <li>
 <Link
 href={href}
 aria-current={isActive ? "page" : undefined}
 title={isCollapsed ? label : undefined}
 className={twMerge(
 "group relative flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
 isCollapsed ? "justify-center px-0" : "px-3",
 isActive
 ? "bg-blue-50 text-blue-600"
 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
 )}
 >
 <span
 className={twMerge(
 "absolute left-0 w-[3px] h-5 rounded-r-full bg-blue-600 transition-all duration-200",
 isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
 )}
 />
 <span
 className={twMerge(
 "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 shrink-0",
 isActive
 ? "bg-blue-100/50 text-blue-600"
 : "text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50",
 )}
 >
 <Icon size={18} aria-hidden />
 </span>
 {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
 </Link>
 </li>
 );
}

export function InstructorSidebar() {
 const pathname = usePathname();
 const [isCollapsed, setIsCollapsed] = React.useState(false);
 const [isMobileOpen, setIsMobileOpen] = React.useState(false);

 React.useEffect(() => {
   const toggle = () => setIsMobileOpen((open) => !open);
   window.addEventListener(MOBILE_SIDEBAR_EVENT, toggle);
   return () => window.removeEventListener(MOBILE_SIDEBAR_EVENT, toggle);
 }, []);
 
 React.useEffect(() => { setIsMobileOpen(false); }, [pathname]);

 React.useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
 e.preventDefault();
 setIsCollapsed((prev) => !prev);
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const INSTRUCTOR_NAV: NavItem[] = [
  { label: "Quản lý Khóa học", href: "/instructor/courses", Icon: BookOpen },
  { 
    label: "Tạo bài Kiểm tra", 
    href: "/instructor/quiz-generator", 
    activePatterns: ["/instructor/quiz-generator"], 
    Icon: FileQuestion 
  },
  { 
    label: "Thảo luận & Hỏi đáp", 
    href: "/instructor/discussions", 
    activePatterns: ["/instructor/discussions"],
    Icon: MessageSquare 
  },
  { 
    label: "Tin nhắn", 
    href: "/instructor/messages", 
    activePatterns: ["/instructor/messages", "/instructor/chat", "/chat"],
    Icon: MessageSquare 
  },
  { label: "Quản lý Học viên", href: "/instructor/students", activePatterns: ["/instructor/analytics"], Icon: Users },
  { label: "Quản lý Doanh thu", href: "/instructor/revenue", Icon: DollarSign },
  { label: "Hồ sơ & xác minh", href: "/instructor/profile", Icon: UserRound },
 ];

 return (
  <>
  {isMobileOpen && (
    <div className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" aria-hidden onClick={() => setIsMobileOpen(false)} />
  )}
  <aside className={twMerge(
    "shrink-0 h-screen flex flex-col bg-white border-r border-slate-200 transition-all duration-300 group/sidebar", 
    "fixed inset-y-0 left-0 z-50 w-64 md:static md:z-auto",
    isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0",
    isCollapsed ? "md:w-[72px]" : "md:w-56"
  )}>
 {/* Brand & Toggle */}
 <div className={twMerge(
 "py-[18px] border-b border-slate-200 flex items-center transition-all",
 isCollapsed ? "px-2 flex-col justify-center gap-4" : "px-4 justify-between"
 )}>
 <Link href="/instructor/courses" className="flex items-center gap-3 group" aria-label="MindNova AI — Instructor">
 <LogoMark />
 {!isCollapsed && (
 <div className="flex flex-col leading-tight">
 <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-150">
 Instructor Portal
 </span>
 <span className="text-xs text-slate-400 font-medium tracking-wide">
 Professional Suite
 </span>
 </div>
 )}
 </Link>
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shrink-0"
 aria-label={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
 >
 <Menu className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-900 transition-colors" strokeWidth={2.5} aria-hidden />
 </button>
 </div>

 {/* Main nav */}
 <nav className={twMerge("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")} aria-label="Instructor navigation">
 {!isCollapsed && (
 <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
 QUẢN LÝ & GIẢNG DẠY
 </div>
 )}
 <ul className="flex flex-col gap-1">
 {INSTRUCTOR_NAV.map((item) => (
 <SidebarNavItem key={item.href} {...item} isCollapsed={isCollapsed} />
 ))}
 </ul>
 </nav>

 <div className={twMerge("pb-4", isCollapsed ? "px-2" : "px-4")}>
 {isCollapsed ? (
 <Link
 href="/instructor/create-course"
 title="Create New Course"
 className="flex items-center justify-center w-full h-10 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200"
 >
 <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
 </Link>
 ) : (
 <CreateCourseCTA />
 )}
 </div>

 <div className={twMerge("py-5 border-t border-slate-200 flex flex-col gap-3", isCollapsed ? "px-2 items-center" : "px-4")}>
 <div className="flex flex-col gap-0.5 w-full">
 <button
 type="button"
 onClick={async () => {
 try { await axiosClient.post("/api/logout"); } catch {}
 window.localStorage.clear();
 document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
 window.location.assign("/login");
 }}
 title={isCollapsed ? "Đăng xuất" : undefined}
 className={twMerge(
 "flex items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 shrink-0 cursor-pointer",
 isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-2.5 px-3 py-2 text-sm w-full text-left"
 )}
 >
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
 {!isCollapsed && <span>Đăng xuất</span>}
 </button>
 </div>
 </div>
  </aside>
  </>
 );
}
