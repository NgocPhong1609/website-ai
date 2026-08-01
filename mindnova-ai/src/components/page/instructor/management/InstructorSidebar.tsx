"use client";

// ─── InstructorSidebar (Modular & Data-Driven via Props) ────────────────────────
// Dedicated sidebar for the instructor dashboard using data-driven configuration.

import React from "react";
import Link from "next/link";
import {
  Sidebar as RootSidebar,
  SidebarLogo,
  useSidebar,
  type SidebarGroupConfig,
} from "@/src/components/ui";
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
  const { setMobileOpen } = useSidebar();
  return (
    <div className="px-1 py-1 shrink-0">
      <Link
        href="/instructor/create-course"
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setMobileOpen(false);
          }
        }}
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

// ─── Main Data-Driven Export ──────────────────────────────────────────────────

export function InstructorSidebar() {
  // TRUYỀN DATA BẰNG PROPS
  const instructorGroups: SidebarGroupConfig[] = [
    {
      title: "QUẢN TRỊ GIẢNG DẠY",
      items: [
        { label: "Dashboard", href: "/instructor", icon: <CourseManagementNavIcon /> },
        { label: "My Courses", href: "/instructor/courses", icon: <CourseManagementNavIcon /> },
        { label: "Discussions", href: "/instructor/discussions", icon: <DiscussionsNavIcon /> },
        { label: "Student Analytics", href: "/instructor/analytics", icon: <StudentManagementNavIcon /> },
        { label: "AI Tools", href: "/instructor/ai-teaching", icon: <AITeachingNavIcon /> },
        { label: "Revenue", href: "/instructor/revenue", icon: <RevenueNavIcon /> },
      ],
    },
    {
      title: "CẤU HÌNH & HỖ TRỢ",
      items: [
        { label: "Settings", href: "/instructor/settings", icon: <SettingsNavIcon /> },
        { label: "Support", href: "/instructor/help", icon: <HelpNavIcon /> },
      ],
    },
  ];

  return (
    <RootSidebar
      header={
        <SidebarLogo
          href="/instructor"
          logoText="Instructor Portal"
          subText="Professional Suite"
          icon={<LogoMark />}
        />
      }
      groups={instructorGroups}
      cta={<CreateCourseCTA />}
      footer={<SidebarUserProfile />}
    />
  );
}
