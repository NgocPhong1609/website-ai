import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FOCUS_AREAS, OVERALL_PROGRESS, STUDY_STREAK } from "../constants";
import type { FocusActionKind, FocusArea as FocusAreaType, OverallProgress, StudyStreak } from "../types";
import { Card, getCardClassName } from "@/src/shared/components";

// ─── Overall Progress Card (Compact & Cohesive) ─────────────────────────────

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
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Study Streak Card (Compact & Cohesive) ─────────────────────────────────

function StudyStreakCard({ data, weeklyActivity }: { data: StudyStreak, weeklyActivity?: Record<string, boolean> }) {
  const { days, message } = data;
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const defaultActivity: Record<string, boolean> = {
    "T2": true, "T3": true, "T4": true, "T5": true, "T6": false, "T7": false, "CN": false
  };
  const activeDays = weeklyActivity || defaultActivity;

  // Find today's index roughly by getting current day
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1; // 0 is Sunday in JS, map it to 6 (CN)

  return (
    <Link 
      href="/progress" 
      className="group bg-white rounded-2xl p-5 border border-[#EAEAF4] shadow-sm hover:shadow-md hover:border-[#F59E0B]/40 transition-all duration-300 flex flex-col justify-between gap-4 text-decoration-none focus:outline-none"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#7878A0] group-hover:text-[#D97706] transition-colors">
            Chuỗi ngày chuyên cần ↗
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#FFF9ED] text-[#D97706] flex items-center justify-center text-sm font-semibold border border-[#F59E0B]/20 shadow-2xs group-hover:scale-105 transition-transform">
            🔥
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
              {days} Ngày
            </span>
            <span className="text-[11px] font-semibold text-[#D97706] bg-[#FFF3DF] px-2 py-0.5 rounded-md border border-[#D97706]/20">
              Đang duy trì
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-md">
            Active
          </span>
        </div>

        <p className="text-xs text-[#64647A] font-normal leading-relaxed line-clamp-1">
          {message}
        </p>
      </div>

      {/* Rewarding Weekday Indicator (Compact & Soothing) */}
      <div className="grid grid-cols-7 gap-1.5 pt-3 border-t border-[#F0F0F8] mt-auto">
        {weekDays.map((d, i) => {
          const isDone = activeDays[d] === true;
          const isToday = i === todayIndex;
          return (
            <div key={i} className="flex flex-col items-center gap-1 group/day">
              <span className="text-[10px] font-medium text-[#7878A0]">{d}</span>
              <div className={twMerge(
                "w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all duration-200 shadow-2xs",
                isDone 
                  ? "bg-gradient-to-tr from-[#F59E0B] to-[#D97706] text-white shadow-2xs" 
                  : "bg-[#F8FAFC] text-[#A0A0C0] border border-[#EAEAF4]",
                isToday && "ring-2 ring-[#F59E0B] ring-offset-1 scale-105"
              )}>
                {isDone ? "✓" : "•"}
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}

// ─── Focus Areas Card (Compact & Cohesive) ──────────────────────────────────

const ACTION_STYLES: Record<FocusActionKind, string> = {
  review:   "bg-[#EEF2FF] text-[#5052EE] hover:bg-[#5052EE] hover:text-white border border-[#5052EE]/30",
  practice: "bg-[#EAF8F5] text-[#0D9488] hover:bg-[#0D9488] hover:text-white border border-[#0D9488]/30",
};

function FocusAreaRow({ area }: { area: FocusAreaType }) {
  const targetHref = area.action === "review" ? "/practice" : "/practice/quiz";

  return (
    <div className="group/row flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#EAEAF4]">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-[#1A1A2E] truncate group-hover/row:text-[#4648D4] transition-colors">
          {area.topic === "React Server Components (RSC)" ? "React Server Components & SSR" : area.topic}
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

// ─── Top Stats Section ────────────────────────────────────────────────────────

interface DashboardStatsPanelProps {
  overallProgress?: OverallProgress;
  studyStreak?: StudyStreak;
  focusAreas?: FocusAreaType[];
  weeklyActivity?: Record<string, boolean>;
}

export function DashboardStatsPanel({
  overallProgress = OVERALL_PROGRESS,
  studyStreak = STUDY_STREAK,
  focusAreas = FOCUS_AREAS,
  weeklyActivity,
}: DashboardStatsPanelProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Thống kê tổng quan học tập và trọng tâm AI">
      <OverallProgressCard data={overallProgress} />
      <StudyStreakCard data={studyStreak} weeklyActivity={weeklyActivity} />
      <FocusAreasCard areas={focusAreas} />
    </section>
  );
}
