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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
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

interface CourseCardProps {
  course: ICourse;
}

function CourseCard({ course }: CourseCardProps) {
  const statusColors = {
    "in-progress": "border-indigo-200 text-[#4F46E5] bg-indigo-50",
    "completed": "border-emerald-200 text-emerald-800 bg-emerald-50",
    "abandoned": "border-amber-200 text-amber-800 bg-amber-50",
    "not-started": "border-gray-200 text-gray-600 bg-gray-50",
  };

  const currentStatus = course.status || "in-progress";
  const statusBadgeClass = statusColors[currentStatus as keyof typeof statusColors] || statusColors["in-progress"];

  const statusTextMap: Record<string, string> = {
    "in-progress": "⚡ Đang học",
    "completed": "✓ Hoàn tất 100%",
    "abandoned": "⚠️ Đứt đoạn lộ trình",
    "not-started": "⏳ Chưa bắt đầu",
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-indigo-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Thumbnail Area */}
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
            <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient || "from-indigo-500 to-slate-800"}`} />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
              {course.category || "Development"}
            </span>
            <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-extrabold uppercase border shadow-2xs ${statusBadgeClass}`}>
              {statusTextMap[currentStatus] || currentStatus}
            </span>
          </div>

          {/* Bottom Timestamp & Progress Overlay */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex flex-col gap-1.5 text-white">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                <ClockIcon />
                <span className="font-mono text-[11px] text-indigo-200">
                  {course.lastWatchedTimestamp || "08:15 / 25:00"}
                </span>
              </div>
              <span className="text-white font-black text-xs font-mono">{course.progress}% Hoàn thành</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
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

        {/* Content Details */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-base font-black text-gray-900 group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-2">
            {course.title}
          </h3>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2.5 text-xs text-gray-600 font-semibold">
            {currentStatus === "completed" ? (
              <>
                <CheckCircleIcon />
                <span className="text-emerald-700 font-black">Khóa học đã được xác thực tốt nghiệp</span>
              </>
            ) : currentStatus === "abandoned" ? (
              <>
                <AlertTriangleIcon />
                <span className="text-amber-800 font-extrabold line-clamp-1">Đứt đoạn tại: {course.nextLesson}</span>
              </>
            ) : (
              <>
                <div className="text-[#4F46E5]">
                  <PlayCircleIcon />
                </div>
                <span className="text-gray-900 font-extrabold line-clamp-1">Bài kế tiếp: {course.nextLesson}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Button Footer */}
      <div className="px-5 pb-5 pt-1">
        <Link
          href="/courses/detail?courseId=101"
          className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all shadow-2xs uppercase cursor-pointer ${
            currentStatus === "completed"
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              : currentStatus === "abandoned"
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-[#4F46E5] hover:bg-[#4338CA] text-white active:scale-[0.99]"
          }`}
        >
          {currentStatus === "completed" ? (
            <>
              <span>Xem Chứng chỉ Trí tuệ Nhân tạo</span>
              <span>🎖️</span>
            </>
          ) : currentStatus === "abandoned" ? (
            <>
              <span>Khôi phục tiến độ học tập</span>
              <span>➔</span>
            </>
          ) : (
            <>
              <PlayCircleIcon />
              <span>Tiếp tục phát video bài giảng</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

export function ContinueLearning() {
  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed" | "abandoned">("all");

  const filteredCourses = DASHBOARD_COURSES.filter((c) => {
    if (activeFilter === "all") return true;
    return c.status === activeFilter;
  });

  return (
    <section aria-labelledby="continue-learning-heading" className="flex flex-col gap-6">
      {/* Widget Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h2 id="continue-learning-heading" className="text-lg font-black text-gray-900 tracking-tight">
            Tiếp Tục Lộ Trình Học Tập (Continue Learning)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Trở lại ngay bài giảng đang theo đuổi hoặc khôi phục các chuyên đề đã đứt đoạn trước đó.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto shrink-0">
          {[
            { id: "all", label: "Tất cả (" + DASHBOARD_COURSES.length + ")" },
            { id: "in-progress", label: "Đang học" },
            { id: "abandoned", label: "Cần khôi phục" },
            { id: "completed", label: "Đã tốt nghiệp" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveFilter(pill.id as "all" | "in-progress" | "abandoned" | "completed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === pill.id
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center gap-3 text-gray-500 shadow-2xs">
          <span className="text-3xl">📭</span>
          <p className="text-sm font-bold text-gray-900">Không có khóa học nào thuộc tiêu chí lọc này.</p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="text-xs text-[#4F46E5] font-extrabold hover:underline cursor-pointer"
          >
            Hiển thị lại toàn bộ lịch sử khóa học
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
