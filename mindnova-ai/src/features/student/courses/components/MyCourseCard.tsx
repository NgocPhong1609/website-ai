import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { MyCourse } from "../types";

function PlayCircleIcon({ completed }: { completed: boolean }) {
  return (
    <div className={twMerge(
      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover/card:scale-105 shadow-2xs",
      completed 
        ? "bg-[#D1FAE5] text-[#0D9488] group-hover/card:bg-[#0D9488] group-hover/card:text-white" 
        : "bg-[#EEF2FF] text-[#5052EE] group-hover/card:bg-[#5052EE] group-hover/card:text-white"
    )}>
      {completed ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" className="ml-0.5">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </div>
  );
}

export function MyCourseCard({ course }: { course: MyCourse }) {
  const isCompleted = course.status === "completed";
  const isNotStarted = course.status === "not-started";

  const statusBadgeStyle = isCompleted
    ? "bg-[#0D9488]/95 text-white border-white/20 shadow-xs"
    : isNotStarted
    ? "bg-[#475569]/90 text-white border-white/20 shadow-xs"
    : "bg-[#5052EE]/95 text-white border-white/20 shadow-xs";

  const buttonStyle = isCompleted
    ? "bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white hover:from-[#0B7A70] hover:to-[#0D9488] shadow-[0_4px_14px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.45)]"
    : isNotStarted
    ? "bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white shadow-[0_4px_14px_rgba(80,82,238,0.3)] hover:shadow-[0_6px_20px_rgba(80,82,238,0.45)]"
    : "bg-[#EEF2FF] text-[#5052EE] hover:bg-gradient-to-r hover:from-[#4648D4] hover:to-[#0D9488] hover:text-white border border-[#5052EE]/20 hover:border-transparent shadow-2xs";

  const buttonText = isCompleted ? "Ôn tập khoá học" : isNotStarted ? "Bắt đầu học ngay" : "Vào học tiếp";
  
  const labelText = isCompleted ? "Trạng thái" : isNotStarted ? "Bài học mở đầu" : "Bài học tiếp theo";

  return (
    <div className="group/card bg-white border border-[#EAEAF4] rounded-2xl flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-[#5052EE]/40 transition-all duration-300 overflow-hidden">
      {/* Compact Thumbnail Header matching h-44 ratio */}
      <div className="relative h-44 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.96] group-hover/card:brightness-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient || "from-[#1E1B4B] to-[#4648D4]"}`} />
        )}

        {/* Gentle veil for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
          <div className={twMerge("px-2.5 py-1 rounded-full text-xs font-semibold tracking-normal backdrop-blur-md border flex items-center gap-1.5", statusBadgeStyle)}>
            {!isCompleted && !isNotStarted && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            )}
            {isCompleted ? "🏆 Đã hoàn tất" : isNotStarted ? "⏳ Chưa bắt đầu" : "Đang học"}
          </div>
        </div>

        {course.isAiRecommended && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#5052EE] text-xs font-semibold shadow-xs border border-[#5052EE]/20 z-10">
            <span>✨ AI gợi ý</span>
          </div>
        )}

        {/* Overlaid Lesson Progress Counter */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-white z-10">
          <span className="text-xs font-medium tracking-wide bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/15">
            📚 {course.lessonsCompleted}/{course.totalLessons} bài học
          </span>
          <span className="text-sm font-bold text-[#4CD7F6] drop-shadow-md">
            {course.progress}%
          </span>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="w-full bg-[#F4F4FA] h-1.5 overflow-hidden border-b border-[#EAEAF4]">
        <div
          className={twMerge(
            "h-full transition-all duration-700 shadow-2xs group-hover/card:brightness-110",
            isCompleted
              ? "bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669]"
              : "bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981]"
          )}
          style={{ width: `${course.progress}%` }}
          role="progressbar"
          aria-valuenow={course.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Clean White Body Content */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between gap-4">
        <div>
          <Link href={`/courses/detail?courseId=${course.id}`} className="block text-decoration-none focus:outline-none min-w-0 group/title">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] leading-snug line-clamp-1 group-hover/card:text-[#5052EE] group-hover/title:text-[#5052EE] transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Next Lesson Tile */}
          <div className="mt-3 bg-[#F8FAFC] rounded-xl p-3 flex items-center gap-3 border border-[#EAEAF4]/80 group-hover/card:border-[#5052EE]/25 group-hover/card:bg-[#EEF2FF]/20 transition-all duration-200">
            <PlayCircleIcon completed={isCompleted} />
            <div className="min-w-0 flex-1">
              <span className={twMerge(
                "text-xs font-medium block mb-0.5",
                isCompleted ? "text-[#0D9488]" : "text-[#7878A0]"
              )}>
                {labelText}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1A2E] truncate">
                {course.nextLesson === "Course Completed 🎉" ? "Đã hoàn thành khóa học 🎉" : course.nextLesson}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/courses/lesson?courseId=${course.id}`}
          className={twMerge(
            "w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 text-decoration-none mt-auto group/btn",
            buttonStyle
          )}
        >
          <span>{buttonText}</span>
          <span className="group-hover/btn:translate-x-1 transition-transform duration-200">➔</span>
        </Link>
      </div>
    </div>
  );
}
