import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { CourseTabStatus } from "../types";

const TABS: CourseTabStatus[] = ["All", "In Progress", "Completed", "Not Started"];

interface CoursesHeaderProps {
  activeTab?: CourseTabStatus;
  onTabChange?: (tab: CourseTabStatus) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  counts?: Record<CourseTabStatus, number>;
}

export function CoursesHeader({
  activeTab = "All",
  onTabChange,
  searchQuery = "",
  onSearchChange,
  counts = { All: 0, "In Progress": 0, Completed: 0, "Not Started": 0 },
}: CoursesHeaderProps) {
  const totalCount = counts["All"] ?? 0;
  const inProgressCount = counts["In Progress"] ?? 0;
  const completedCount = counts["Completed"] ?? 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 mb-8">
      {/* Synchronized Hero Banner matching http://localhost:3000/ exactly */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)]">
        {/* Subtle animated background glow balls (refined and gentle) */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              MindNova AI Curriculum Active
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              My Learning <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent drop-shadow-2xs font-bold">Courses</span> 🎓
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed">
              Manage and explore your personalized AI training tracks. You currently have <span className="text-[#4648D4] font-semibold bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#6B6BFF]/20">{inProgressCount} {inProgressCount === 1 ? "course" : "courses"}</span> actively underway!
            </p>
          </div>

          {/* Synchronized Interactive Mastery Widget */}
          <Link href="/study-plan" className="group block shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#6B6BFF]/20 flex flex-col items-center justify-center min-w-[200px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none">
            <div className="w-full flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Course Mastery ↗</span>
              <span className="w-6 h-6 rounded-lg bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center text-xs font-semibold shadow-2xs">🏆</span>
            </div>

            <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline gap-1.5">
              <span className="text-[#4648D4]">{completedCount}</span>
              <span className="text-xs font-medium text-[#9090B0]">/ {totalCount} completed</span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:w-full group-hover:brightness-110"
                style={{ width: `${Math.max(completionPercentage, 12)}%` }}
              />
            </div>

            <p className="text-[11px] font-semibold text-[#6B6BFF] mt-2.5 flex items-center gap-1">
              <span>🔥 {inProgressCount} tracks in execution!</span>
            </p>
          </Link>
        </div>
      </section>

      {/* Synchronized Search and Status Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#F0F0F8] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search courses by title..."
            className="w-full pl-10 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#1A1A2E] bg-[#F6F6FB] border border-[#EAEAF4] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30 focus:border-[#6B6BFF] focus:bg-white transition-all duration-200"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6BFF]"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] hover:text-[#1A1A2E] font-bold focus:outline-none"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            const count = counts[tab] ?? 0;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={twMerge(
                  "group whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6B6BFF]/40 flex items-center gap-2 active:scale-95",
                  isActive
                    ? "bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] text-white shadow-md shadow-[#6B6BFF]/20 -translate-y-0.5"
                    : "bg-[#EEF2FF] text-[#64647A] hover:bg-[#E0E7FF] hover:text-[#1A1A2E]"
                )}
              >
                <span>{tab}</span>
                <span
                  className={twMerge(
                    "px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-white text-[#64647A] group-hover:bg-[#4648D4] group-hover:text-white border border-[#EAEAF4] group-hover:border-transparent"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
