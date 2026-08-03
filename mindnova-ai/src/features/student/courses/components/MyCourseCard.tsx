import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { MyCourse } from "../types";
import { Card } from "@/src/shared/components";

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin-slow">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
    </svg>
  );
}

function PlayCircleIcon({ completed }: { completed: boolean }) {
  return (
    <div className={twMerge(
      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 shadow-2xs",
      completed 
        ? "bg-[#D1FAE5] text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white" 
        : "bg-[#EEF2FF] text-[#4648D4] group-hover:bg-gradient-to-br group-hover:from-[#6B6BFF] group-hover:to-[#4648D4] group-hover:text-white"
    )}>
      {completed ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5">
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
    ? "bg-[#10B981]/90 text-white border-white/20"
    : isNotStarted
    ? "bg-[#64748B]/90 text-white border-white/20"
    : "bg-[#4648D4]/90 text-white border-white/20";

  const buttonStyle = isCompleted
    ? "bg-[#10B981] hover:bg-[#059669] shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] focus:ring-[#10B981]/40"
    : isNotStarted
    ? "bg-[#475569] hover:bg-[#334155] shadow-2xs focus:ring-slate-400"
    : "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_16px_rgba(107,107,255,0.35)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.5)] focus:ring-[#6B6BFF]/40";

  const buttonText = isCompleted ? "Review Course" : isNotStarted ? "Start Learning" : "Resume Course";

  return (
    <Card variant="default" hoverEffect="lift" padding="none" className="group border-[#EAEAF4] flex flex-col justify-between h-full">
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full bg-[#1A1A2E] overflow-hidden">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.96] group-hover:brightness-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient}`} />
        )}

        {/* Delicate dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/85 via-[#1A1A2E]/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
          <div className={twMerge("px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md border shadow-sm flex items-center gap-1.5", statusBadgeStyle)}>
            {!isCompleted && !isNotStarted && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CD7F6] animate-ping" />
            )}
            {!isCompleted && !isNotStarted && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CD7F6] absolute" />
            )}
            {isCompleted ? "🏆 Completed" : isNotStarted ? "Not Started" : "In Progress"}
          </div>
        </div>

        {course.isAiRecommended && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#4648D4] text-[10px] font-bold shadow-sm border border-[#6B6BFF]/20 z-10">
            <SparkleIcon />
            <span>AI RECOMMENDED</span>
          </div>
        )}

        {/* Overlaid Lesson Progress Counter */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-white z-10">
          <span className="text-xs font-semibold tracking-wide bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
            📚 {course.lessonsCompleted}/{course.totalLessons} lessons
          </span>
          <span className="text-sm sm:text-base font-bold text-[#4CD7F6] drop-shadow-md">
            {course.progress}%
          </span>
        </div>
      </div>

      {/* Shimmering Progress Bar */}
      <div className="w-full bg-[#EEF2FF] h-1.5 overflow-hidden">
        <div
          className={twMerge(
            "h-full transition-all duration-700 shadow-2xs group-hover:brightness-110",
            isCompleted
              ? "bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669]"
              : "bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#4648D4]"
          )}
          style={{ width: `${course.progress}%` }}
          role="progressbar"
          aria-valuenow={course.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between gap-5">
        <div>
          {/* Title */}
          <Link href="/courses/detail" className="block focus:outline-none min-w-0 group/title">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] leading-snug line-clamp-1 group-hover/title:text-[#4648D4] group-hover:text-[#4648D4] transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Next Lesson Tile */}
          <div className="mt-4 bg-[#F6F6FB] rounded-xl p-3 flex items-center gap-3.5 border border-[#EAEAF4]/80 group-hover:border-[#6B6BFF]/30 group-hover:bg-[#EEF2FF]/30 transition-all duration-200">
            <PlayCircleIcon completed={isCompleted} />
            <div className="min-w-0 flex-1">
              <span className={twMerge(
                "text-[10px] font-bold uppercase tracking-wider block mb-0.5",
                isCompleted ? "text-[#10B981]" : "text-[#6B6BFF]"
              )}>
                {isCompleted ? "Status" : isNotStarted ? "Up First" : "Next Lesson"}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1A2E] truncate">
                {course.nextLesson}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/courses/lesson"
          className={twMerge(
            "group/btn w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-1",
            buttonStyle
          )}
        >
          <span>{buttonText}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 transition-transform duration-200">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Card>
  );
}
