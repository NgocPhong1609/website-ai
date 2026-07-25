"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson, IModule } from "@/src/components/page/student/courses/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PlayCircleIcon({ active }: { active?: boolean }) {
  return (
    <svg className={`w-5 h-5 shrink-0 mt-0.5 ${active ? "text-[#6B6BFF]" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function LockClosedIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonCurriculumSidebar() {
  const router = useRouter();
  const allLessons = COURSE_DETAIL.modules.flatMap((m: IModule) => m.lessons);
  const completedCount = allLessons.filter((l: ILesson) => l.status === "completed").length;
  const totalCount = allLessons.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const [collapsed, setCollapsed] = useState(false);

  const handleLessonClick = useCallback((lesson: ILesson) => {
    if (lesson.status === "locked") return;
    router.push(`/courses/${lesson.id}`);
  }, [router]);

  return (
    <aside className={`${collapsed ? "w-0 overflow-hidden" : "w-[300px]"} shrink-0 border-r border-[#F0F0F8] bg-white h-full overflow-y-auto hidden lg:flex flex-col transition-all duration-300`}>
      <div className="p-6 flex-1">
        {/* Course Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 truncate">{COURSE_DETAIL.title}</h2>
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-2"
            aria-label="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-medium">{completedCount}/{totalCount} lessons</span>
            <span className="text-xs font-semibold text-gray-500">{progressPercent}%</span>
          </div>
          <div className="h-1.5 flex-1 bg-[#E8E8FF] rounded-full overflow-hidden">
            <div className="h-full bg-[#6B6BFF] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Lesson List — grouped by module */}
        <div className="flex flex-col space-y-4">
          {COURSE_DETAIL.modules.map((mod: IModule) => (
            <div key={mod.id}>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
                {mod.title} — {mod.description}
              </p>
              <div className="flex flex-col space-y-0.5">
                {mod.lessons.map((lesson: ILesson) => {
                  const isCompleted = lesson.status === "completed";
                  const isCurrent = lesson.status === "current";
                  const isLocked = lesson.status === "locked";

                  return (
                    <div
                      key={lesson.id}
                      role={isLocked ? "presentation" : "button"}
                      tabIndex={isLocked ? -1 : 0}
                      onClick={() => handleLessonClick(lesson)}
                      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isLocked) handleLessonClick(lesson); }}
                      className={[
                        "flex items-start gap-3 p-3 rounded-xl transition-colors",
                        isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                        isCurrent ? "bg-[#EEF2FF]" : "hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {isCompleted && <CheckCircleIcon />}
                      {isCurrent && <PlayCircleIcon active />}
                      {isLocked && <LockClosedIcon />}
                      {/* Fallback for any other status */}
                      {!isCompleted && !isCurrent && !isLocked && <PlayCircleIcon />}

                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[#6B6BFF]" : isLocked ? "text-gray-400" : "text-gray-700"}`}>
                          {lesson.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${isCurrent ? "text-[#6B6BFF]" : "text-gray-400"}`}>
                          {lesson.duration}
                          {isLocked && " · Locked"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
