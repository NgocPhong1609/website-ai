import React from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { IMyCourse } from "@/src/components/page/student/courses/types";

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10c.6 0 1 .4 1 1v6c0 3.3-2.7 6-6 6s-6-2.7-6-6V5c0-.6.4-1 1-1Z" />
      <path d="M5 9c-1.7 0-3-1.3-3-3s1.3-3 3-3" />
      <path d="M19 9c1.7 0 3-1.3 3-3s-1.3-3-3-3" />
    </svg>
  );
}

export function MyCourseCard({ course }: { course: IMyCourse }) {
  const isCompleted = course.status === "completed";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Thumbnail Header */}
      <div className="relative h-44 w-full bg-gray-100 overflow-hidden shrink-0">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient}`} />
        )}

        {/* Status Badge */}
        <div
          className={twMerge(
            "absolute top-3 left-3 px-3 py-1 rounded-xl text-white text-[11px] font-extrabold shadow-sm tracking-wide uppercase",
            isCompleted ? "bg-emerald-600" : "bg-[#4F46E5]"
          )}
        >
          {course.status === "in-progress"
            ? "Đang học"
            : isCompleted
            ? "Đã hoàn thành"
            : "Chưa bắt đầu"}
        </div>

        {/* AI Recommendation Tag */}
        {course.isAiRecommended && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#4F46E5] text-[10px] font-extrabold shadow-sm border border-indigo-100">
            <SparkleIcon />
            <span>✨ AI ĐỀ XUẤT</span>
          </div>
        )}

        {/* Category Badge if present */}
        {course.category && (
          <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
            {course.category}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        {/* Title & Instructor */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-black text-gray-900 leading-snug group-hover:text-[#4F46E5] transition-colors line-clamp-2">
              {course.title}
            </h3>
            <span
              className={twMerge(
                "text-sm font-black shrink-0 font-mono",
                isCompleted ? "text-emerald-600" : "text-[#4F46E5]"
              )}
            >
              {course.progress}%
            </span>
          </div>
          {course.instructorName && (
            <p className="text-xs text-gray-500 font-semibold mt-1">
              👨‍🏫 Giảng viên: <span className="text-gray-700 font-bold">{course.instructorName}</span>
            </p>
          )}
        </div>

        {/* Lessons count and Progress Bar */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{course.lessonsCompleted}/{course.totalLessons} bài học đã hoàn tất</span>
            {course.avgScore !== undefined && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] font-black font-mono">
                Điểm trung bình: {course.avgScore}/100
              </span>
            )}
          </div>

          <div className="h-2 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            <div
              className={twMerge(
                "h-full rounded-full transition-all duration-500",
                isCompleted ? "bg-emerald-500" : "bg-[#4F46E5]"
              )}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Next Lesson / Completion Block */}
        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex items-center gap-3">
          <div className={twMerge("shrink-0", isCompleted ? "text-emerald-600" : "text-[#4F46E5]")}>
            {isCompleted ? <TrophyIcon /> : <PlayCircleIcon />}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">
              {isCompleted ? "Bảo Trợ Chứng Nhận AI" : "Bài Học Tiếp Theo"}
            </p>
            <p className="text-xs font-bold text-gray-900 truncate" title={course.nextLesson}>
              {course.nextLesson}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href={`/courses/detail?courseId=${course.id}`}
            className={twMerge(
              "w-full py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-2xs cursor-pointer block text-center uppercase tracking-wider",
              isCompleted
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.99]"
            )}
          >
            {isCompleted ? "Xem lại & Tải chứng chỉ ➔" : "Tiếp tục bài giảng ➔"}
          </Link>
        </div>
      </div>
    </div>
  );
}
