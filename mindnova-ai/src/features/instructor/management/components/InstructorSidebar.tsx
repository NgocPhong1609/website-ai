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

function SidebarUserProfile() {
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
}

function SidebarNavItem({ label, href, Icon }: NavItem) {
  const pathname = usePathname();
  // Mark as active if it's the exact path or a sub-path
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={twMerge(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
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
        <span className="flex-1 truncate">{label}</span>
      </Link>
    </li>
  );
}

export function InstructorSidebar() {
  const INSTRUCTOR_NAV: NavItem[] = [
    { label: "Quản lý Khóa học", href: "/instructor", Icon: CourseManagementNavIcon },
    { label: "Tạo Khóa Học AI", href: "/instructor/create-course", Icon: AITeachingNavIcon },
    { label: "Thảo luận & Hỏi đáp", href: "/instructor/discussions", Icon: DiscussionsNavIcon },
    { label: "Phân tích Học viên", href: "/instructor/analytics", Icon: StudentManagementNavIcon },
    { label: "Quản lý Doanh thu", href: "/instructor/revenue", Icon: RevenueNavIcon },
  ];

  return (
    <aside className="w-[260px] shrink-0 h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm z-50">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/instructor" className="flex items-center gap-3 group" aria-label="MindNova AI — Instructor">
          <LogoMark />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black text-gray-900 tracking-tight group-hover:text-[#4648D4] transition-colors duration-150">
              Instructor Portal
            </span>
            <span className="text-[10px] text-gray-500 font-extrabold tracking-wide uppercase">
              Professional Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Instructor navigation">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-3">
          QUẢN LÝ & GIẢNG DẠY
        </div>
        <ul className="flex flex-col gap-1">
          {INSTRUCTOR_NAV.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-4">
         <CreateCourseCTA />
      </div>

      <div className="px-3 py-3 border-t border-gray-100 flex flex-col gap-3">
        <SidebarUserProfile />
      </div>
    </aside>
  );
}
