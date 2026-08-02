"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DASHBOARD_COURSES } from "./constants";
import type { ICourse } from "../courses/types";

function PlayCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── Course Card Component ───────────────────────────────────────────────────

interface CourseCardProps {
  course: ICourse;
}

function CourseCard({ course }: CourseCardProps) {
  const statusColors = {
    "in-progress": "border-[#4F46E5] text-[#4F46E5] bg-[#EEF2FF]",
    "completed": "border-emerald-500 text-emerald-700 bg-emerald-50",
    "abandoned": "border-amber-500 text-amber-700 bg-amber-50",
    "not-started": "border-gray-300 text-gray-600 bg-gray-50",
  };

  const currentStatus = course.status || "in-progress";
  const statusBadgeClass = statusColors[currentStatus as keyof typeof statusColors] || statusColors["in-progress"];

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#4F46E5]/50 overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Thumbnail & Overlays */}
        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={course.id === 1}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient}`} />
          )}

          {/* Dark gradient overlay for typography readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Status & Category Badge */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md border border-white/20">
              {course.category || "Development"}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border backdrop-blur-sm ${statusBadgeClass}`}>
              {currentStatus.replace("-", " ")}
            </span>
          </div>

          {/* Bottom Video Timestamp Left Off */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex flex-col gap-1.5 text-white">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                <ClockIcon />
                <span className="font-mono text-[11px] text-indigo-100">
                  {course.lastWatchedTimestamp || "00:00 / 15:00"}
                </span>
              </div>
              <span className="text-white font-extrabold text-sm">{course.progress}%</span>
            </div>
            {/* Progress Bar (Strictly using #4F46E5 indigo accent) */}
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStatus === "completed"
                    ? "bg-emerald-500"
                    : currentStatus === "abandoned"
                    ? "bg-amber-500"
                    : "bg-[#4F46E5]"
                }`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-base font-extrabold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-2">
            {course.title}
          </h3>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2.5 text-xs text-[#6B7280] font-semibold">
            {currentStatus === "completed" ? (
              <>
                <CheckCircleIcon />
                <span className="text-[#4F46E5] font-bold">Course Fully Mastered</span>
              </>
            ) : currentStatus === "abandoned" ? (
              <>
                <AlertTriangleIcon />
                <span className="text-amber-800 line-clamp-1">Left off at: {course.nextLesson}</span>
              </>
            ) : (
              <>
                <div className="text-[#4F46E5]">
                  <PlayCircleIcon />
                </div>
                <span className="text-[#111827] font-bold line-clamp-1">Up Next: {course.nextLesson}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1">
        <Link
          href="/courses/101"
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-2xs ${
            currentStatus === "completed"
              ? "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] border border-indigo-200 font-extrabold"
              : currentStatus === "abandoned"
              ? "bg-amber-500 hover:bg-amber-600 text-white font-extrabold"
              : "bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold hover:-translate-y-0.5"
          }`}
        >
          {currentStatus === "completed" ? (
            <>
              <span>View Verified Certificate</span>
              <span>🎖️</span>
            </>
          ) : currentStatus === "abandoned" ? (
            <>
              <span>Jump Back In (Reclaim Progress)</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <PlayCircleIcon />
              <span>Resume Video Stream</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContinueLearning() {
  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed" | "abandoned">("all");

  const filteredCourses = DASHBOARD_COURSES.filter((c) => {
    if (activeFilter === "all") return true;
    return c.status === activeFilter;
  });

  return (
    <section aria-labelledby="continue-learning-heading" className="flex flex-col gap-5">
      {/* Widget Header & Filters (Clean white surface per Rule #7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h2 id="continue-learning-heading" className="text-xl font-extrabold text-[#111827] tracking-tight">
            Jump Back In
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
            Resume your learning progress or re-engage with previous courses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto">
          {[
            { id: "all", label: "All (" + DASHBOARD_COURSES.length + ")" },
            { id: "in-progress", label: "Active" },
            { id: "abandoned", label: "Abandoned" },
            { id: "completed", label: "Completed" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveFilter(pill.id as "all" | "in-progress" | "abandoned" | "completed")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === pill.id
                  ? "bg-[#4F46E5] text-white shadow-2xs"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center gap-3 text-gray-500">
          <span className="text-3xl">📭</span>
          <p className="text-sm font-bold text-[#111827]">No courses found matching this criteria.</p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="text-xs text-[#4F46E5] font-extrabold hover:underline cursor-pointer"
          >
            Show all learning history
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
