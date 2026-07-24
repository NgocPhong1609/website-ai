"use client";

// ─── InstructorSidebar ────────────────────────────────────────────────────────
// Dedicated sidebar for the instructor dashboard.

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  Icon: React.FC;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INSTRUCTOR_NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/instructor",
    Icon: CourseManagementNavIcon,
  },
  {
    label: "My Courses",
    href: "/instructor/courses",
    Icon: CourseManagementNavIcon,
  },
  {
    label: "Discussions",
    href: "/instructor/discussions",
    Icon: DiscussionsNavIcon,
  },
  {
    label: "Student Analytics",
    href: "/instructor/analytics",
    Icon: StudentManagementNavIcon,
  },
  {
    label: "AI Tools",
    href: "/instructor/ai-teaching",
    Icon: AITeachingNavIcon,
  },
  { label: "Revenue", href: "/instructor/revenue", Icon: RevenueNavIcon },
];

const BOTTOM_LINKS: NavItem[] = [
  { label: "Settings", href: "/instructor/settings", Icon: SettingsNavIcon },
  { label: "Support", href: "/instructor/help", Icon: HelpNavIcon },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SidebarNavItem({ label, href, Icon }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={twMerge(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-[#6B6BFF]/10 text-[#4648D4]"
            : "text-[#64647A] hover:bg-[#F4F4FA] hover:text-[#1A1A2E]",
        )}
      >
        {/* Active indicator */}
        <span
          className={twMerge(
            "absolute left-0 w-[3px] h-6 rounded-r-full bg-[#6B6BFF] transition-all duration-200",
            isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0",
          )}
        />

        {/* Icon wrapper */}
        <span
          className={twMerge(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
            isActive
              ? "bg-[#6B6BFF]/15 text-[#6B6BFF]"
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

// ─── User profile (bottom of sidebar) ────────────────────────────────────────

function SidebarUserProfile() {
  return (
    <div className="flex items-center gap-3 px-1">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(107,107,255,0.35)] shrink-0">
        N
      </div>
      {/* Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-[#1A1A2E] truncate">
          Nguyễn Minh Anh
        </span>
        <span className="text-[11px] text-[#9090B0] truncate">
          Senior AI Instructor
        </span>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function InstructorSidebar() {
  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-white border-r border-[#F0F0F8]">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#F4F4FA]">
        <Link
          href="/instructor"
          className="flex items-center gap-3 group"
          aria-label="MindNova AI — Instructor"
        >
          <LogoMark />
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-extrabold text-[#1A1A2E] tracking-tight group-hover:text-[#4648D4] transition-colors duration-150">
              Instructor Portal
            </span>
            <span className="text-[10px] text-[#9090B0] font-medium tracking-wide">
              Professional Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-3"
        aria-label="Instructor navigation"
      >
        <ul className="flex flex-col gap-0.5">
          {INSTRUCTOR_NAV.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </ul>
      </nav>

      {/* Create New Course CTA */}
      <div className="px-3 pb-3">
        <Link
          href="/instructor/create-course"
          id="sidebar-create-course"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#4648D4] border-2 border-dashed border-[#C5C6FF] hover:bg-[#6B6BFF] hover:text-white hover:border-[#6B6BFF] hover:shadow-[0_4px_14px_rgba(107,107,255,0.35)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
        >
          <svg aria-hidden viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Course
        </Link>
      </div>

      <div className="px-3 py-4 border-t border-[#F4F4FA] flex flex-col gap-3">
        {/* Bottom links */}
        <ul className="flex flex-col gap-0.5">
          {BOTTOM_LINKS.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-[#F4F4FA] pt-3">
          <SidebarUserProfile />
        </div>
      </div>
    </aside>
  );
}
