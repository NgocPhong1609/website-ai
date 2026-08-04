import Image from "next/image";
import type { IMyCourse } from "@features/student/courses/types";

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

export function MyCourseCard({ course }: { course: IMyCourse }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col group">
      {/* Thumbnail Header */}
      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
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

        {/* Badges */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#4F46E5] text-white text-[11px] font-bold shadow-sm">
          {course.status === "in-progress" ? "In Progress" : course.status === "completed" ? "Completed" : "Not Started"}
        </div>

        {course.isAiRecommended && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#4F46E5] text-[10px] font-bold shadow-sm">
            <SparkleIcon />
            AI RECOMMENDED
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Progress % */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[17px] font-bold text-[#111827] leading-snug line-clamp-1">
            {course.title}
          </h3>
          <span className="text-[15px] font-bold text-[#4F46E5] shrink-0">
            {course.progress}%
          </span>
        </div>

        {/* Lessons count */}
        <p className="text-[13px] text-[#6B7280]">
          {course.lessonsCompleted}/{course.totalLessons} lessons completed
        </p>

        {/* Progress bar */}
        <div className="mt-3.5 h-1.5 rounded-full bg-[#EEF2FF] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4F46E5]"
            style={{ width: `${course.progress}%` }}
          />
        </div>

        {/* Next Lesson Block */}
        <div className="mt-5 bg-[#F8FAFC] rounded-xl p-3.5 flex items-center gap-3">
          <div className="text-[#4F46E5]">
            <PlayCircleIcon />
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
              Next Lesson
            </p>
            <p className="text-[13px] font-bold text-[#111827] truncate">
              {course.nextLesson}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
