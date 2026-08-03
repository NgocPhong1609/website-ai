import Link from "next/link";
import { twMerge } from "tailwind-merge";
<<<<<<< HEAD
import { FOCUS_AREAS, OVERALL_PROGRESS, STUDY_STREAK } from "../constants";
import type { FocusActionKind, FocusArea as FocusAreaType, OverallProgress, StudyStreak } from "../types";
import { Card, getCardClassName } from "@/src/shared/components";
=======
import {
  FOCUS_AREAS,
  OVERALL_PROGRESS,
  RECENT_ACTIVITY,
  STUDY_STREAK,
} from "../constants";
import { FocusActionKind, IActivityGroup, IFocusArea } from "../types";
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

// ─── Overall Progress ─────────────────────────────────────────────────────────

function OverallProgressCard({ data }: { data: OverallProgress }) {
  const { percent, delta } = data;

  return (
    <Link 
      href="/progress" 
      className={getCardClassName({ 
        variant: "default", 
        hoverEffect: "lift", 
        padding: "md", 
        className: "group flex flex-col justify-between border-[#E8E8F2] focus:outline-none w-full h-full min-h-[260px]" 
      })}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6B6BFF]/5 rounded-full blur-2xl group-hover:bg-[#6B6BFF]/15 transition-all duration-500 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7878A0] group-hover:text-[#4648D4] transition-colors">
            Overall Progress ↗
          </span>
          <span className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4648D4] flex items-center justify-center text-base shadow-2xs group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            🏆
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight">
              {percent}%
            </span>
            <span className="text-xs font-bold text-[#10B981] bg-[#D1FAE5]/80 px-2 py-0.5 rounded-lg border border-[#10B981]/20">
              ▲ {delta}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6B6BFF] bg-[#EEF2FF] px-2.5 py-1 rounded-md">Level 4</span>
        </div>

        <p className="text-xs text-[#64647A] font-medium">Consistent daily progression across active courses.</p>
      </div>

      {/* Aligned Footer Area matching Study Streak grid height */}
      <div className="mt-auto pt-4 border-t border-[#F0F0F8]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#64647A] mb-2">
          <span>Syllabus Completion</span>
          <span className="text-[#4648D4]">On Target</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#F4F4FA] overflow-hidden p-0.5 border border-[#EAEAF4]/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#4648D4] shadow-[0_0_8px_rgba(107,107,255,0.4)] transition-all duration-700"
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

// ─── Study Streak ─────────────────────────────────────────────────────────────

function StudyStreakCard({ data }: { data: StudyStreak }) {
  const { days, message } = data;
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Link 
      href="/progress" 
      className={getCardClassName({ 
        variant: "gradient", 
        hoverEffect: "lift", 
        padding: "md", 
        className: "group flex flex-col justify-between bg-gradient-to-br from-[#FFFBEB] via-white to-white border-[#FEF3C7] hover:border-[#F59E0B]/50 focus:outline-none w-full h-full min-h-[260px]" 
      })}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#92400E] group-hover:text-[#B45309] transition-colors">
            Study Streak ↗
          </span>
          <span className="text-2xl group-hover:animate-bounce transition-transform duration-300" role="img" aria-label="fire">🔥</span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] tracking-tight">
            {days} days
          </span>
          <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#D97706]/25 shadow-2xs">
            STREAK ACTIVE
          </span>
        </div>

        <p className="text-xs text-[#64647A] font-medium">{message}</p>
      </div>
      
      {/* Rewarding Weekday Indicator */}
      <div className="grid grid-cols-7 gap-1.5 pt-4 border-t border-[#FEF3C7]/70 mt-auto">
        {weekDays.map((d, i) => {
          const isDone = i < 5;
          const isToday = i === 4;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 group/day">
              <span className="text-[10px] font-bold text-[#7878A0]">{d}</span>
              <div className={twMerge(
                "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-2xs group-hover/day:scale-110",
                isDone 
                  ? "bg-gradient-to-tr from-[#F59E0B] to-[#D97706] text-white shadow-sm shadow-[#D97706]/30" 
                  : "bg-[#F4F4FA] text-[#9090B0] border border-[#EAEAF4]",
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

// ─── Focus Areas ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<FocusActionKind, string> = {
  review:   "bg-[#FEE2E2]/90 text-[#DC2626] hover:bg-[#DC2626] hover:text-white border border-[#DC2626]/30",
  practice: "bg-[#CCFBF1]/90 text-[#0D9488] hover:bg-[#0D9488] hover:text-white border border-[#0D9488]/30",
};

function FocusAreaRow({ area }: { area: FocusAreaType }) {
  const targetHref = area.action === "review" ? "/practice" : "/practice/quiz";

  return (
    <div className="group/row flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#F6F6FB] transition-colors border border-transparent hover:border-[#EAEAF4]">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-[#1A1A2E] truncate group-hover/row:text-[#4648D4] transition-colors">{area.topic}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${area.accuracy < 60 ? "bg-red-500 animate-pulse" : "bg-[#10B981]"}`} />
          <p className="text-xs font-semibold text-[#64647A]">
            {area.accuracy}% mastery score
          </p>
        </div>
      </div>
      <Link
        href={targetHref}
        className={twMerge(
          "shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-sm active:scale-95 text-center",
          ACTION_STYLES[area.action]
        )}
      >
        {area.action === "review" ? "⚡ Review" : "🎯 Practice"}
      </Link>
    </div>
  );
}

function FocusAreasCard({ areas }: { areas: FocusAreaType[] }) {
  const displayAreas = areas.slice(0, 2); // Show top 2 items to ensure exact equal height matching in 3-col grid

  return (
    <Card variant="default" hoverEffect="none" padding="md" className="border-[#E8E8F2] shadow-sm w-full h-full min-h-[260px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7878A0]">
            AI Recommended Focus
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B6BFF] animate-ping" />
        </div>
        <p className="text-xs font-medium text-[#8888A8] mb-3 pb-2.5 border-b border-[#F0F0F8]">Prioritized by AI based on diagnostic patterns</p>
      </div>

      <div className="flex flex-col gap-1 -mx-1 mt-auto">
        {displayAreas.map((area) => (
          <FocusAreaRow key={area.id} area={area} />
        ))}
      </div>
    </Card>
  );
}

// ─── Top Stats Section ────────────────────────────────────────────────────────

interface DashboardStatsPanelProps {
  overallProgress?: OverallProgress;
  studyStreak?: StudyStreak;
  focusAreas?: FocusAreaType[];
}

export function DashboardStatsPanel({
  overallProgress = OVERALL_PROGRESS,
  studyStreak = STUDY_STREAK,
  focusAreas = FOCUS_AREAS,
}: DashboardStatsPanelProps) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Dashboard overview stats and focus areas">
      <OverallProgressCard data={overallProgress} />
      <StudyStreakCard data={studyStreak} />
      <FocusAreasCard areas={focusAreas} />
    </section>
  );
}




