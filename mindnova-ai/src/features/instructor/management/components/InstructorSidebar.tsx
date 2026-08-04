"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
  CourseManagementNavIcon,
  StudentManagementNavIcon,
  AITeachingNavIcon,
  RevenueNavIcon,
  SettingsNavIcon,
  HelpNavIcon,
  DiscussionsNavIcon,
} from "./icons";

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function CreateCourseCTA() {
  return (
    <div className="px-1 py-1 shrink-0">
      <Link
        href="/instructor/create-course"
        title="Create New Course"
        className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-xs font-black text-white bg-[#4648D4] hover:bg-[#383AB8] shadow-md transition-all duration-200"
      >
        <svg aria-hidden viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="shrink-0">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="truncate tracking-wide uppercase font-black">TẠO KHÓA HỌC MỚI</span>
      </Link>
    </div>
  );
}

function SidebarUserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-3 py-2 items-center">
        <div className="w-9 h-9 rounded-full bg-[#4648D4]/15 text-[#4648D4] flex items-center justify-center text-sm font-black shadow-2xs shrink-0 border border-[#4648D4]/20">
          N
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2 px-2">
      <div className="w-9 h-9 rounded-full bg-[#4648D4]/15 text-[#4648D4] flex items-center justify-center text-sm font-black shadow-2xs shrink-0 border border-[#4648D4]/20">
        N
      </div>
      <div className="flex flex-col min-w-0 leading-tight">
        <span className="text-sm font-black text-gray-900 truncate">Nguyễn Minh Anh</span>
        <span className="text-[11px] text-gray-500 font-bold truncate">Senior AI Instructor</span>
      </div>
    </div>
  );
}

interface NavItem {
  label: string;
  href: string;
  Icon: React.FC;
  isCollapsed?: boolean;
}

function SidebarNavItem({ label, href, Icon, isCollapsed }: NavItem) {
  const pathname = usePathname();
  // Mark as active if it's the exact path or a sub-path
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? label : undefined}
        className={twMerge(
          "group relative flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
          isCollapsed ? "justify-center px-0" : "px-3",
          isActive
            ? "bg-[#4648D4] text-white shadow-md shadow-[#4648D4]/30"
            : "text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E]",
        )}
      >
        <span
          className={twMerge(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
            isActive
              ? "text-white"
              : "text-[#9090B0] group-hover:text-[#4648D4] group-hover:bg-[#6B6BFF]/8",
          )}
        >
          <Icon />
        </span>
        {!isCollapsed && <span className="flex-1 truncate">{label}</span>}
      </Link>
    </li>
  );
}

export function InstructorSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
    { label: "Quản lý Khóa học", href: "/instructor/courses", Icon: CourseManagementNavIcon },
    { label: "Thảo luận & Hỏi đáp", href: "/instructor/discussions", Icon: DiscussionsNavIcon },
    { label: "Phân tích Học viên", href: "/instructor/analytics", Icon: StudentManagementNavIcon },
    { label: "Quản lý Doanh thu", href: "/instructor/revenue", Icon: RevenueNavIcon },
  ];

  return (
    <aside className={twMerge("shrink-0 h-full flex flex-col bg-white border-r border-gray-200 shadow-sm z-50 transition-all duration-300", isCollapsed ? "w-[80px]" : "w-[234px]")}>
      {/* Brand */}
      <div className={twMerge("h-16 shrink-0 border-b border-gray-200 flex items-center justify-center", isCollapsed ? "px-2" : "px-4")}>
        <Link href="/instructor/courses" className="flex items-center gap-3 group" aria-label="MindNova AI — Instructor">
          <LogoMark />
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-black text-gray-900 tracking-tight group-hover:text-[#4648D4] transition-colors duration-150">
                Instructor Portal
              </span>
              <span className="text-[10px] text-gray-500 font-extrabold tracking-wide uppercase">
                Professional Suite
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Main nav */}
      <nav className={twMerge("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")} aria-label="Instructor navigation">
        {!isCollapsed && (
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-3">
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
             className="flex items-center justify-center w-full h-10 rounded-xl text-xs font-black text-white bg-[#4648D4] hover:bg-[#383AB8] shadow-md transition-all duration-200"
           >
             <svg aria-hidden viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="shrink-0">
               <line x1="12" y1="5" x2="12" y2="19" />
               <line x1="5" y1="12" x2="19" y2="12" />
             </svg>
           </Link>
         ) : (
           <CreateCourseCTA />
         )}
      </div>

      <div className={twMerge("py-3 border-t border-gray-100 flex flex-col gap-3", isCollapsed ? "px-2" : "px-3")}>
        <SidebarUserProfile isCollapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={twMerge("flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50 group", isCollapsed ? "justify-center" : "justify-between w-full")}
        >
          {isCollapsed ? (
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-900 transition-colors">
               <line x1="4" x2="20" y1="12" y2="12" />
               <line x1="4" x2="20" y1="6" y2="6" />
               <line x1="4" x2="20" y1="18" y2="18" />
             </svg>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-900 transition-colors">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span>Thu gọn</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-black tracking-widest text-gray-400 group-hover:text-gray-500 group-hover:border-gray-300 transition-colors">Ctrl+B</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
