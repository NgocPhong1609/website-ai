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
 className="group bg-white rounded-xl p-5 border border-[#E8E2D9] hover:border-[#B8B0A3] transition-all duration-300 flex flex-col justify-between gap-4 text-decoration-none focus:outline-none"
 >
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-medium text-[#B8B0A3] group-hover:text-[#C0392B] transition-colors uppercase tracking-wider">
 Tiến độ tổng thể
 </span>
 </div>

 <div className="flex items-baseline justify-between">
 <div className="flex items-baseline gap-2">
 <span className="text-2xl font-bold text-[#2C3039] tracking-tight font-[family-name:var(--font-playfair-display)]">
 {percent}%
 </span>
 <span className="text-xs font-semibold text-[#27AE60] bg-[#E8F8F0] px-2 py-0.5 rounded-md">
 +{delta}
 </span>
 </div>
 <span className="text-[11px] font-semibold text-[#2C3039] bg-[#F5F0E8] px-2 py-0.5 rounded-md">
 Level 4
 </span>
 </div>

 <p className="text-xs text-[#8A8478] font-normal leading-relaxed line-clamp-1">
 Tối ưu hóa đều đặn qua từng học phần của khoá học.
 </p>
 </div>

 <div className="pt-3 border-t border-[#F5F0E8] space-y-1.5">
 <div className="flex items-center justify-between text-xs font-medium text-[#8A8478]">
 <span>Hoàn tất lộ trình</span>
 <span className="text-[#2C3039] font-semibold">Đạt tiến độ chuẩn</span>
 </div>
 <div className="h-2 rounded-full bg-[#F5F0E8] overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div
 className="h-full rounded-full bg-[#2C3039] transition-all duration-700"
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
 review: "bg-[#F5F0E8] text-[#2C3039] hover:bg-[#2C3039] hover:text-white border border-[#E8E2D9]",
 practice: "bg-[#E8F6F3] text-[#2C3039] hover:bg-[#2C3039] hover:text-white border border-[#2C3039]/20",
};

function FocusAreaRow({ area }: { area: FocusAreaType }) {
 const targetHref = area.action === "review" ? "/practice" : "/practice/quiz";

 return (
 <div className="group/row flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-[#FAF7F2] transition-colors border border-transparent hover:border-[#E8E2D9]">
 <div className="flex-1 min-w-0">
 <p className="text-xs sm:text-sm font-bold text-[#2C3039] truncate group-hover/row:text-[#C0392B] transition-colors" title={area.topic}>
 {area.topic}
 </p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className={`w-2 h-2 rounded-full ${area.accuracy < 60 ? "bg-[#D4A017]" : "bg-[#27AE60]"}`} />
 <p className="text-xs font-normal text-[#8A8478]">
 {area.accuracy}% mức độ thấu hiểu
 </p>
 </div>
 </div>
 <Link
 href={targetHref}
 className={twMerge(
 "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 text-decoration-none text-center",
 ACTION_STYLES[area.action]
 )}
 >
 {area.action === "review" ? "Ôn tập" : "Luyện quiz"}
 </Link>
 </div>
 );
}

function FocusAreasCard({ areas }: { areas: FocusAreaType[] }) {
 const displayAreas = areas.slice(0, 2);

 return (
 <div className="bg-white rounded-xl p-5 border border-[#E8E2D9] hover:border-[#B8B0A3] transition-all duration-300 flex flex-col justify-between gap-4">
 <div>
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-medium text-[#B8B0A3] uppercase tracking-wider">
 Trọng tâm AI khuyến nghị
 </span>
 <span className="text-[11px] font-semibold text-[#2C3039] bg-[#E8F6F3] px-2 py-0.5 rounded-md">
 AI Focus
 </span>
 </div>
 <p className="text-xs font-normal text-[#8A8478] pb-2 border-b border-[#F5F0E8]">
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
 checkedInDates?: string[];
 streakFreezeCount?: number;
}

export function DashboardStatsPanel({
 overallProgress = OVERALL_PROGRESS,
 studyStreak = STUDY_STREAK,
 focusAreas = FOCUS_AREAS,
 weeklyActivity,
 todayKey = "CN",
 checkedInDates = [],
 streakFreezeCount = 1,
}: DashboardStatsPanelProps) {
 return (
 <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Thống kê tổng quan học tập và trọng tâm AI">
 <OverallProgressCard data={overallProgress} />
 
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