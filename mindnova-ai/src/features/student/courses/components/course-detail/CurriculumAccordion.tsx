"use client";

import { twMerge } from "tailwind-merge";
import { COURSE_DETAIL } from "@features/student/courses/constants/detail";
import type { IModule, ILesson } from "@features/student/courses/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ─── Lesson Item ──────────────────────────────────────────────────────────────

function LessonItem({ lesson }: { lesson: ILesson }) {
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";

  return (
    <div
      className={twMerge(
        "flex items-center justify-between py-3 px-4 rounded-xl relative",
        isCurrent ? "bg-[#EEF2FF] ml-[-16px] mr-[-16px] pl-[32px] pr-[32px]" : "",
      )}
    >
      {/* Current Indicator Line */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4F46E5] rounded-r-full" />
      )}

      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className={twMerge(
          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
          isCompleted ? "bg-[#4F46E5] text-white" : "",
          isCurrent ? "text-[#4F46E5]" : "",
          isLocked ? "border-2 border-gray-300 text-transparent" : "",
        )}>
          {isCompleted && <CheckIcon />}
          {isCurrent && <PlayCircleIcon />}
          {/* Locked is just an empty border circle as per design */}
        </div>

        {/* Title */}
        <span className={twMerge(
          "text-[14px] font-semibold",
          isLocked ? "text-[#9CA3AF]" : (isCurrent ? "text-[#4F46E5]" : "text-[#111827]")
        )}>
          {lesson.title}
        </span>
      </div>

      {/* Right side (Duration / Badge) */}
      <div className="flex items-center gap-3">
        {isCurrent && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#4F46E5] uppercase tracking-wider">
            Current
          </span>
        )}
        <span className={twMerge(
          "text-[12px] font-medium",
          isLocked ? "text-[#9CA3AF]" : "text-[#6B7280]"
        )}>
          {lesson.duration}
        </span>
      </div>
    </div>
  );
}

// ─── Module Item ──────────────────────────────────────────────────────────────

function ModuleItem({ mod, moduleIndex }: { mod: IModule; moduleIndex: number }) {
  // Simple heuristic for module status based on lessons
  const isLocked = mod.lessons.every((l: ILesson) => l.status === "locked");
  const isCompleted = mod.lessons.every((l: ILesson) => l.status === "completed");
  const isCurrent = mod.lessons.some((l: ILesson) => l.status === "current");

  return (
    <div className={twMerge(
      "rounded-2xl border p-5 mb-4 transition-colors",
      isCurrent ? "bg-[#F8FAFC] border-[#A5B4FC]" : "bg-white border-[#E5E7EB]"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between cursor-pointer group">
        <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div className={twMerge(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0",
            isCompleted ? "bg-[#4F46E5] text-white" : "",
            isCurrent ? "bg-white border-2 border-[#4F46E5] text-[#4F46E5]" : "",
            isLocked ? "bg-gray-100 text-gray-400" : ""
          )}>
            {isCompleted ? <CheckIcon /> : (isLocked ? <LockIcon /> : moduleIndex + 1)}
          </div>

          <div>
            <p className={twMerge(
              "text-[11px] font-bold uppercase tracking-wider",
              isLocked ? "text-gray-400" : "text-[#4F46E5]"
            )}>
              {mod.title}
            </p>
            <h3 className={twMerge(
              "text-[18px] font-bold mt-0.5",
              isLocked ? "text-gray-400" : "text-[#111827]"
            )}>
              {mod.description}
            </h3>
          </div>
        </div>

        <button className="text-[#9CA3AF] group-hover:text-[#4B5563] transition-colors p-1">
          <ChevronIcon className={twMerge("transition-transform", mod.isExpanded ? "rotate-180" : "")} />
        </button>
      </div>

      {/* Lessons List */}
      {mod.isExpanded && (
        <div className="mt-4 flex flex-col gap-1 border-t border-[#E5E7EB] pt-4">
          {mod.lessons.map((lesson: ILesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CurriculumAccordion() {
  const { modules } = COURSE_DETAILL;

  return (
    <div className="mt-10">
      <h2 className="text-[20px] font-bold text-[#111827] mb-5">Curriculum</h2>
      <div className="flex flex-col">
        {modules.map((mod: IModule, i: number) => (
          <ModuleItem key={mod.id} mod={mod} moduleIndex={i} />
        ))}
      </div>
    </div>
  );
}
