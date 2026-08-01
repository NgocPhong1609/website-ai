"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson, IModule } from "@/src/components/page/student/courses/types";
import {
  SidebarProvider,
  Sidebar as RootSidebar,
  SidebarHeader,
  useSidebar,
  type SidebarGroupConfig,
} from "@/src/components/ui";

// ─── Icons (Styled for White Theme) ───────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PlayCircleIcon({ active }: { active?: boolean }) {
  return (
    <svg className={`w-5 h-5 shrink-0 ${active ? "text-[#4648D4] animate-pulse" : "text-gray-400 group-hover:text-gray-700"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function LockClosedIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Inner Data-Driven Content Component ──────────────────────────────────────

function CurriculumSidebarInner() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  const allLessons = COURSE_DETAIL.modules.flatMap((m: IModule) => m.lessons);
  const completedCount = allLessons.filter((l: ILesson) => l.status === "completed").length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleLessonClick = useCallback(
    (lesson: ILesson) => {
      if (lesson.status === "locked") return;
      router.push(`/courses/${lesson.id}`);
    },
    [router]
  );

  // TRUYỀN DATA BẰNG PROPS: Chuyển đổi danh sách module/bài học thành groups
  const curriculumGroups: SidebarGroupConfig[] = COURSE_DETAIL.modules.map((mod: IModule) => ({
    title: `${mod.title} — ${mod.description}`,
    items: mod.lessons.map((lesson: ILesson) => {
      const isCompleted = lesson.status === "completed";
      const isCurrent = lesson.status === "current";
      const isLocked = lesson.status === "locked";

      let iconComponent = <PlayCircleIcon />;
      if (isCompleted) iconComponent = <CheckCircleIcon />;
      else if (isCurrent) iconComponent = <PlayCircleIcon active />;
      else if (isLocked) iconComponent = <LockClosedIcon />;

      const labelContent = (
        <div className="flex flex-col min-w-0 leading-tight">
          <span className={`text-sm font-extrabold truncate ${isCurrent ? "text-[#4648D4]" : "text-gray-800"}`}>
            {lesson.title}
          </span>
          <span className="text-[11px] text-gray-500 font-bold truncate mt-0.5">
            {lesson.duration} {isLocked ? "• Khóa" : ""}
          </span>
        </div>
      );

      return {
        label: isCollapsed ? `${lesson.title} (${lesson.duration})` : labelContent,
        icon: iconComponent,
        isActive: isCurrent,
        disabled: isLocked,
        onClick: () => handleLessonClick(lesson),
        className: "py-3.5",
      };
    }),
  }));

  const headerBlock = (
    <SidebarHeader className="h-auto py-4 flex-col items-start gap-3 border-b-2 border-gray-100 w-full">
      {!isCollapsed ? (
        <div className="w-full space-y-3">
          <h2 className="text-base font-black text-gray-900 truncate tracking-tight" title={COURSE_DETAIL.title}>
            {COURSE_DETAIL.title}
          </h2>
          <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
            <div className="flex justify-between items-center text-xs font-extrabold text-gray-700">
              <span>Tiến độ bài học: {completedCount}/{totalCount}</span>
              <span className="text-[#4648D4] font-black">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4648D4] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-2 gap-1" title={`Tiến độ: ${progressPercent}% (${completedCount}/${totalCount} bài)`}>
          <span className="text-[11px] font-black text-[#4648D4] bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 shadow-2xs">
            {progressPercent}%
          </span>
        </div>
      )}
    </SidebarHeader>
  );

  return (
    <RootSidebar
      width="w-80"
      className="h-full min-h-[500px] border-r-2 border-gray-200 bg-white"
      header={headerBlock}
      groups={curriculumGroups}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonCurriculumSidebar() {
  return (
    <SidebarProvider defaultOpen={true}>
      <CurriculumSidebarInner />
    </SidebarProvider>
  );
}
