import { twMerge } from "tailwind-merge";

import {
  FOCUS_AREAS,
  OVERALL_PROGRESS,
  RECENT_ACTIVITY,
  STUDY_STREAK,
} from "../constants";

import { FocusActionKind, IActivityGroup, IFocusArea } from "../types";

// ─── Overall Progress ─────────────────────────────────────────────────────────

function OverallProgressCard() {
  const { percent, delta } = OVERALL_PROGRESS;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
        Overall Progress
      </p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[32px] font-bold text-[#4F46E5] leading-none">
          {percent}%
        </span>
        <span className="text-xs font-semibold text-[#10B981]">{delta}</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#EEF2FF] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4F46E5]"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Overall progress: ${percent}%`}
        />
      </div>
    </div>
  );
}

// ─── Study Streak ─────────────────────────────────────────────────────────────

function StudyStreakCard() {
  const { days, message } = STUDY_STREAK;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
        Study Streak
      </p>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[28px] font-bold text-[#4F46E5] leading-none">
          {days} days
        </span>
        <span className="text-2xl leading-none" role="img" aria-label="fire">
          🔥
        </span>
      </div>
      <p className="text-xs text-[#6B7280]">{message}</p>
    </div>
  );
}

// ─── Focus Areas ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<FocusActionKind, string> = {
  review: "bg-[#FEE2E2] text-[#DC2626]",
  practice: "bg-[#CCFBF1] text-[#0D9488]",
};

const ACCURACY_TEXT_STYLES: Record<FocusActionKind, string> = {
  review: "text-[#DC2626]",
  practice: "text-[#0D9488]",
};

function FocusAreaRow({ area }: { area: IFocusArea }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#111827] truncate">
          {area.topic}
        </p>
        <p
          className={twMerge(
            "text-[11px] font-medium",
            ACCURACY_TEXT_STYLES[area.action],
          )}
        >
          {area.accuracy}% Accuracy
        </p>
      </div>
      <button
        type="button"
        className={twMerge(
          "shrink-0 px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-all duration-150 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4F46E5]/40",
          ACTION_STYLES[area.action],
        )}
      >
        {area.action}
      </button>
    </div>
  );
}

function FocusAreasCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">
        Focus Areas
      </p>
      <div className="flex flex-col gap-3">
        {FOCUS_AREAS.map((area) => (
          <FocusAreaRow key={area.id} area={area} />
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

function ActivityGroup({
  group,
  isLast,
}: {
  group: IActivityGroup;
  isLast: boolean;
}) {
  const isToday = group.day === "Today";

  return (
    <div className="relative">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-[7px] top-6 bottom-[-20px] w-0.5 bg-[#F3F4F6]" />
      )}

      {/* Day header */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div
          className={twMerge(
            "w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-black/5",
            isToday ? "bg-[#4F46E5]" : "bg-[#D1D5DB]",
          )}
        />
        <p className="text-[13px] font-bold text-[#111827]">{group.day}</p>
      </div>

      {/* Items list */}
      <ul className="ml-[22px] space-y-2 pb-2">
        {group.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-[13px] text-[#4B5563]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentActivityCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] p-5 shadow-sm">
      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
        Recent Activity
      </p>
      <div className="flex flex-col gap-4">
        {RECENT_ACTIVITY.map((group, i) => (
          <ActivityGroup
            key={group.day}
            group={group}
            isLast={i === RECENT_ACTIVITY.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Right Sidebar Panel ──────────────────────────────────────────────────────

export function DashboardStatsPanel() {
  return (
    <aside
      className="w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5"
      aria-label="Dashboard stats"
    >
      <OverallProgressCard />
      <StudyStreakCard />
      <FocusAreasCard />
      <RecentActivityCard />
    </aside>
  );
}
