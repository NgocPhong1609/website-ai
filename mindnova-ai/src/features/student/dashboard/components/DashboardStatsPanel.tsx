import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FOCUS_AREAS, OVERALL_PROGRESS, STUDY_STREAK } from "../constants";
import { StudyStreakInteractive } from "./StudyStreakInteractive";

import type { FocusActionKind, FocusArea as FocusAreaType, OverallProgress, StudyStreak } from "../types";

export type DayOfWeek = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";

// ─── Overall Progress Card ─────────────────────────────
function OverallProgressCard({ data }: { data: OverallProgress }) {
  const { percent, delta } = data;

  return (
    <Link 
      href="/progress" 
      className="group bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm hover:shadow-md hover:border-[#5052EE]/40 transition-all duration-300 flex flex-col justify-between gap-4 text-decoration-none focus:outline-none"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#7878A0] group-hover:text-[#4648D4] transition-colors">
            Tiến độ tổng thể ↗
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center text-sm font-semibold border border-[#5052EE]/20 shadow-2xs group-hover:scale-105 transition-transform">
            🏆
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
              {percent}%
            </span>
            <span className="text-xs font-semibold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-md border border-[#059669]/20">
              ▲ {delta}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#5052EE] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#5052EE]/20">
            Level 4
          </span>
        </div>

        <p className="text-xs text-[#64647A] font-normal leading-relaxed line-clamp-1">
          Tối ưu hóa đều đặn qua từng học phần của khoá học.
        </p>
      </div>

      <div className="pt-3 border-t border-[#F0F0F8] space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-[#64647A]">
          <span>Hoàn tất lộ trình</span>
          <span className="text-[#0D9488] font-semibold">Đạt tiến độ chuẩn</span>
        </div>
        <div className="h-2 rounded-full bg-[#F4F4FA] overflow-hidden p-0.5 border border-[#EAEAF4]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] shadow-xs transition-all duration-700"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tiến độ hiện tại: ${percent}%`}
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Focus Areas Card ──────────────────────────────────
const ACTION_STYLES: Record<FocusActionKind, string> = {
  review:   "bg-[#EEF2FF] text-[#5052EE] hover:bg-[#5052EE] hover:text-white border border-[#5052EE]/30",
  practice: "bg-[#EAF8F5] text-[#0D9488] hover:bg-[#0D9488] hover:text-white border border-[#0D9488]/30",
};

function FocusAreaRow({ area }: { area: FocusAreaType }) {
  const targetHref = area.action === "review" ? "/practice" : "/practice/quiz";

  return (
    <div className="group/row flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#EAEAF4]">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-[#1A1A2E] truncate group-hover/row:text-[#4648D4] transition-colors" title={area.topic}>
          {area.topic}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${area.accuracy < 60 ? "bg-[#F59E0B]" : "bg-[#10B981]"}`} />
          <p className="text-xs font-normal text-[#64647A]">
            {area.accuracy}% mức độ thấu hiểu
          </p>
        </div>
      </div>
      <Link
        href={targetHref}
        className={twMerge(
          "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-2xs text-decoration-none text-center",
          ACTION_STYLES[area.action]
        )}
      >
        {area.action === "review" ? "⚡ Ôn tập" : "🎯 Luyện quiz"}
      </Link>
    </div>
  );
}

function FocusAreasCard({ areas }: { areas: FocusAreaType[] }) {
  const displayAreas = areas.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#7878A0]">
            Trọng tâm AI khuyến nghị
          </span>
          <span className="text-[11px] font-semibold text-[#0D9488] bg-[#EAF8F5] px-2 py-0.5 rounded-md border border-[#0D9488]/20 flex items-center gap-1">
            <span>✨ AI Focus</span>
          </span>
        </div>
        <p className="text-xs font-normal text-[#64647A] pb-2 border-b border-[#F0F0F8]">
          Cá nhân hóa từ phân tích chẩn đoán thực chiến
        </p>
      </div>

      <div className="flex flex-col gap-1 -mx-1 mt-auto">
        {displayAreas.map((area) => (
          <FocusAreaRow key={area.id} area={area} />
        ))}
      </div>
    </div>
  );
}

// ─── Top Stats Section (Main Export) ──────────────────

interface DashboardStatsPanelProps {
  overallProgress?: OverallProgress;
  studyStreak?: StudyStreak;
  focusAreas?: FocusAreaType[];
  weeklyActivity?: Record<DayOfWeek, boolean>;
  todayKey?: DayOfWeek; 
  checkedInDates?: string[];       // 🚀 Nhận dữ liệu ngày đã điểm danh từ Server
  streakFreezeCount?: number;      // 🚀 Nhận số thẻ đóng băng từ Server
}

export function DashboardStatsPanel({
  overallProgress = OVERALL_PROGRESS,
  studyStreak = STUDY_STREAK,
  focusAreas = FOCUS_AREAS,
  weeklyActivity,
  todayKey = "CN",
  checkedInDates = [],             // Mặc định mảng rỗng
  streakFreezeCount = 1,           // Mặc định 1 thẻ
}: DashboardStatsPanelProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Thống kê tổng quan học tập và trọng tâm AI">
      <OverallProgressCard data={overallProgress} />
      
      {/* 🚀 Truyền dữ liệu thật xuống StudyStreakInteractive */}
      <StudyStreakInteractive 
        data={studyStreak} 
        weeklyActivity={weeklyActivity} 
        todayKey={todayKey} 
        checkedInDates={checkedInDates}
        streakFreezeCount={streakFreezeCount}
      />
      
      <FocusAreasCard areas={focusAreas} />
    </section>
  );
}