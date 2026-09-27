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
 className="h-full group bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between gap-5 text-decoration-none focus:outline-none focus:border-blue-500 relative overflow-hidden"
 >
 {/* Decorative background element */}
 <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
 Tiến độ tổng thể
 </span>
 </div>

 <div className="flex items-end justify-between">
 <div className="flex items-end gap-2.5">
 <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight leading-none">
 {percent ?? 0}%
 </span>
 <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md mb-1">
 +{delta}
 </span>
 </div>
 <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg mb-1">
 Level {data.level ?? 1}
 </span>
 </div>

 <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
 {data.description || "Tối ưu hóa đều đặn qua từng học phần của khoá học."}
 </p>
 </div>

 <div className="pt-4 border-t border-slate-100 space-y-3 mt-auto">
 <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
 <span>Hoàn tất lộ trình</span>
 <span className="text-slate-900 font-bold">Đạt tiến độ chuẩn</span>
 </div>
 <div className="h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
 <div
 className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 relative"
 style={{ width: `${percent ?? 0}%` }}
 role="progressbar"
 aria-valuenow={percent ?? 0}
 aria-valuemin={0}
 aria-valuemax={100}
 aria-label={`Tiến độ hiện tại: ${percent ?? 0}%`}
 >
 <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
 </div>
 </div>
 </div>
 </Link>
 );
}

// ─── Focus Areas Card ──────────────────────────────────
const ACTION_STYLES: Record<FocusActionKind, string> = {
 review: "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200",
 practice: "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100",
};

function FocusAreaRow({ area }: { area: FocusAreaType }) {
 const targetHref = area.action === "review" ? "/practice" : "/practice/quiz";

 return (
 <div className="group/row flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
 <div className="flex-1 min-w-0">
 <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover/row:text-blue-600 transition-colors" title={area.topic}>
 {area.topic}
 </p>
 <div className="flex items-center gap-1.5 mt-1">
 <span className={`w-2 h-2 rounded-full ${area.accuracy < 60 ? "bg-amber-500" : "bg-emerald-500"}`} />
 <p className="text-xs font-normal text-slate-500">
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
 <div className="h-full bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col gap-4">
 <div>
 <div className="flex items-center justify-between mb-3">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
 Trọng tâm AI
 </span>
 <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
 AI Focus
 </span>
 </div>
 <p className="text-sm font-medium text-slate-500 pb-4 border-b border-slate-100">
 Cá nhân hóa từ phân tích chẩn đoán thực chiến
 </p>
 </div>

 <div className="flex flex-col gap-2 -mx-2 mt-auto flex-1 justify-center">
 {displayAreas.length > 0 ? (
 displayAreas.map((area) => (
 <FocusAreaRow key={area.id} area={area} />
 ))
 ) : (
 <div className="py-4 flex flex-col items-center justify-center h-full gap-2 opacity-50">
 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
 <span className="text-slate-400">✨</span>
 </div>
 <span className="text-slate-500 text-sm font-medium">Không có đề xuất mới nào.</span>
 </div>
 )}
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
 todayKey,
 checkedInDates = [],
 streakFreezeCount = 0,
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