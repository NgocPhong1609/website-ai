import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { CourseTabStatus } from "../types";

const TABS: { id: CourseTabStatus; label: string }[] = [
  { id: "All", label: "Tất cả" },
  { id: "In Progress", label: "Đang học" },
  { id: "Completed", label: "Đã hoàn tất" },
  { id: "Not Started", label: "Chưa bắt đầu" },
];

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
    <div className="flex flex-col gap-8 mb-6">
      {/* ─── Synchronized Universal Hero Banner matching /study-plan perfectly ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EEF2FF]/90 via-[#F6F6FB] to-[#E0F2FE]/80 border border-[#6B6BFF]/25 p-6 sm:p-7 shadow-[0_8px_30px_rgba(107,107,255,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(107,107,255,0.12)] w-full">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#6B6BFF]/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#4CD7F6]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#6B6BFF]/30 text-xs font-semibold text-[#4648D4] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute" />
              Danh mục Đào tạo • AI Co-Pilot
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E] leading-tight">
              Hệ thống <span className="bg-gradient-to-r from-[#4648D4] via-[#6063EE] to-[#4CD7F6] bg-clip-text text-transparent font-bold drop-shadow-2xs">Khoá học của bạn 🎓</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64647A] leading-relaxed font-normal">
              Quản lý và tiếp tục rèn luyện các chuyên đề đào tạo AI được cá nhân hoá theo năng lực. Hệ thống hiện đang theo dõi và đồng bộ tiến độ học tập thực tế của bạn.
            </p>
          </div>

          {/* Universal Wide Mastery Card matching /study-plan */}
          <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#6B6BFF]/20 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#6B6BFF]/50 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-full flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-[#7878A0] group-hover:text-[#4648D4] transition-colors">Tiến độ tổng thể ↗</span>
              <span className="text-[11px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
                Đúng lộ trình
              </span>
            </div>

            <div className="text-3xl font-bold text-[#1A1A2E] my-1 flex items-baseline justify-between gap-6">
              <div>
                <span className="text-[#4648D4]">{completionPercentage}%</span>
                <span className="text-xs font-medium text-[#9090B0] ml-1.5">hoàn thành</span>
              </div>
              <span className="text-xs font-semibold text-[#64647A]">
                {completedCount} / {totalCount} khoá học
              </span>
            </div>

            <div className="w-full h-2 bg-[#F4F4FA] rounded-full mt-2 overflow-hidden p-0.5 border border-[#EAEAF4]/80">
              <div
                className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] rounded-full shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-1000 group-hover:brightness-110"
                style={{ width: `${Math.max(completionPercentage, 12)}%` }}
              />
            </div>

            <p className="text-xs font-semibold text-[#6B6BFF] mt-3 flex items-center justify-between gap-4">
              <span>🔥 {inProgressCount} chuyên đề đang học tích cực!</span>
              <Link href="/study-plan" className="text-[#4648D4] font-bold hover:underline text-decoration-none focus:outline-none">Vào học ngay ➔</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── Unboxed Search & Status Tab Controls ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Tìm kiếm khoá học theo tên..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#1A1A2E] bg-white border border-[#EAEAF4] shadow-2xs placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#5052EE]/25 focus:border-[#5052EE] transition-all duration-200"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7878A0]"
            width="16"
            height="16"
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] hover:text-[#1A1A2E] font-bold focus:outline-none"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const count = counts[tab.id] ?? 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={twMerge(
                  "group whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 active:scale-95",
                  isActive
                    ? "bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white font-semibold shadow-sm -translate-y-0.5"
                    : "bg-white text-[#64647A] font-medium hover:text-[#1A1A2E] hover:border-[#5052EE]/30 border border-[#EAEAF4] shadow-2xs"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={twMerge(
                    "px-2 py-0.5 rounded-md text-[11px] transition-colors",
                    isActive
                      ? "bg-white/25 text-white font-semibold"
                      : "bg-[#F4F5FB] text-[#7878A0] font-semibold group-hover:bg-[#EEF2FF] group-hover:text-[#5052EE]"
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
