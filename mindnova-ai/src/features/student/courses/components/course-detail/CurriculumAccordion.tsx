"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { NoData } from "@/src/shared/components/ui/NoData";
import type { CourseDetailModuleItem, CourseDetailLessonItem } from "../../types";

// ─── Icons ────────────────────────────────────────────────────────────────────
function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#10B981]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#5052EE]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function LockCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#9090B0]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`text-[#64647A] transition-transform duration-200 ${expanded ? "rotate-180 text-[#5052EE]" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Lesson Item Row ──────────────────────────────────────────────────────────
function LessonItemRow({ lesson, courseId }: { lesson: CourseDetailLessonItem; courseId: string | number }) {
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isLocked = lesson.status === "locked";

  const content = (
    <div className={twMerge(
      "flex items-center justify-between py-3.5 px-5 rounded-xl border transition-all duration-200 text-decoration-none group/lesson",
      isCurrent 
        ? "bg-gradient-to-r from-[#EEF2FF] via-white to-[#F0F2FF] border-[#5052EE]/40 shadow-2xs hover:border-[#5052EE]/60" 
        : isCompleted
          ? "bg-white border-[#EAEAF4] hover:bg-[#F8FAFC] hover:border-[#10B981]/30"
          : "bg-[#F9FAFB]/80 border-dashed border-[#EAEAF4] hover:bg-[#F8FAFC] cursor-not-allowed opacity-85"
    )}>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#EAEAF4] flex items-center justify-center shrink-0 shadow-2xs group-hover/lesson:scale-105 transition-transform">
          {isCompleted && <CheckCircleIcon />}
          {isCurrent && (
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5052EE] animate-ping absolute" />
              <PlayCircleIcon />
            </div>
          )}
          {isLocked && <LockCircleIcon />}
        </div>

        <div className="min-w-0">
          <span className={twMerge(
            "text-xs sm:text-sm font-semibold truncate block transition-colors",
            isLocked ? "text-[#7878A0]" : (isCurrent ? "text-[#4648D4] group-hover/lesson:text-[#3738A5]" : "text-[#1A1A2E] group-hover/lesson:text-[#10B981]")
          )}>
            {lesson.title}
          </span>
          {isCurrent && (
            <span className="text-[11px] font-medium text-[#5052EE] bg-[#EEF2FF] px-2 py-0.5 rounded-md inline-block border border-[#5052EE]/20 mt-1">
              ▶ Đang học dở (Current Step)
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2.5 ml-4">
        {isCompleted && (
          <span className="text-[11px] font-medium text-[#10B981] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#10B981]/20 hidden sm:inline-block">
            Đã hoàn thành
          </span>
        )}
        {isLocked && (
          <span className="text-[11px] font-normal text-[#9090B0] bg-[#F3F4F8] px-2 py-0.5 rounded-md hidden sm:inline-block border border-[#EAEAF4]">
            🔒 Khóa
          </span>
        )}
        <span className={twMerge(
          "text-xs font-medium px-2.5 py-1 rounded-lg border",
          isCurrent 
            ? "text-[#4648D4] bg-[#EEF2FF] border-[#5052EE]/20 font-semibold" 
            : "text-[#64647A] bg-[#F8FAFC] border-[#EAEAF4]"
        )}>
          {lesson.duration}
        </span>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div 
        onClick={() => alert("🔒 Vui lòng hoàn tất các bài học trước để tự động mở khóa bài học này!")}
        className="block"
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={`/courses/lesson?courseId=${courseId}&lessonId=${lesson.id}`} className="text-decoration-none block">
      {content}
    </Link>
  );
}

// ─── Main Accordion Component ─────────────────────────────────────────────────
export function CurriculumAccordion({ modules = [], courseId = 1 }: { modules?: CourseDetailModuleItem[], courseId?: string | number }) {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  // Automatically expand all modules on initial render so user sees full curriculum
  useEffect(() => {
    if (modules && modules.length > 0) {
      const initMap: Record<string, boolean> = {};
      modules.forEach((mod, idx) => {
        initMap[String(mod.id || idx)] = true;
      });
      setExpandedMap(initMap);
    }
  }, [modules]);

  const toggleModule = (modKey: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [modKey]: !prev[modKey],
    }));
  };

  const totalLessons = modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);

  return (
    <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 sm:p-7 shadow-2xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#F0F0F8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#5052EE]/20">
              📚 Giáo trình & Học phần
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
            <span className="text-xs font-medium text-[#7878A0]">Cập nhật liên tục 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
            Nội dung chương trình đào tạo
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] text-xs font-medium text-[#64647A] shadow-2xs">
            {modules.length} Modules • <strong className="text-[#5052EE] font-semibold">{totalLessons} Bài giảng</strong>
          </div>

          <button
            type="button"
            onClick={() => {
              const allExpanded = Object.values(expandedMap).every(Boolean);
              const newMap: Record<string, boolean> = {};
              modules.forEach((mod, idx) => {
                newMap[String(mod.id || idx)] = !allExpanded;
              });
              setExpandedMap(newMap);
            }}
            className="text-xs font-medium text-[#5052EE] hover:text-[#3738A5] hover:underline px-2.5 py-1 rounded-lg bg-[#EEF2FF]/60 transition-colors cursor-pointer"
          >
            {Object.values(expandedMap).every(Boolean) ? "Thu nhỏ tất cả" : "Mở rộng tất cả"}
          </button>
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modules && modules.length > 0 ? (
          modules.map((module, modIdx) => {
            const modKey = String(module.id || modIdx);
            const isExpanded = !!expandedMap[modKey];
            const completedInMod = module.lessons?.filter(l => l.status === 'completed').length || 0;
            const totalInMod = module.lessons?.length || 0;

            return (
              <div 
                key={modKey} 
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-[#6B6BFF]/30 shadow-2xs bg-[#F8FAFC]/50" : "border-[#EAEAF4] bg-white hover:border-[#6B6BFF]/25"
                }`}
              >
                {/* Module Toggle Bar */}
                <button
                  type="button"
                  onClick={() => toggleModule(modKey)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5052EE] font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 border border-[#5052EE]/20 shadow-2xs">
                      {String(modIdx + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1A2E] truncate group-hover:text-[#5052EE]">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#7878A0]">
                        <span>{totalInMod} Bài giảng</span>
                        <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                        <span>{module.duration || "2.5 giờ"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border hidden sm:inline-block ${
                      completedInMod === totalInMod && totalInMod > 0
                        ? "bg-[#EAF8F5] text-[#10B981] border-[#10B981]/20"
                        : "bg-[#EEF2FF] text-[#5052EE] border-[#5052EE]/15"
                    }`}>
                      {completedInMod}/{totalInMod} Đã học
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#EAEAF4] flex items-center justify-center shrink-0">
                      <ChevronIcon expanded={isExpanded} />
                    </div>
                  </div>
                </button>

                {/* Expanded Lesson Items */}
                {isExpanded && (
                  <div className="p-4 pt-1 space-y-2.5 bg-[#F8FAFC]/60 border-t border-[#F0F0F8]">
                    {module.lessons && module.lessons.map((lesson, lessonIdx) => (
                      <LessonItemRow key={lesson.id || lessonIdx} lesson={lesson} courseId={courseId} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <NoData title="Chưa có bài giảng" description="Hiện chưa có danh sách bài giảng cho học phần này." />
        )}
      </div>
    </div>
  );
}
