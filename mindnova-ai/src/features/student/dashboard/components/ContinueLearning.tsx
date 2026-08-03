import Link from "next/link";
import Image from "next/image";
<<<<<<< HEAD
import type { DashboardCourse } from "../types";
import { DASHBOARD_COURSES } from "../constants";
import { Card } from "@/src/shared/components";
=======
import { DASHBOARD_COURSES } from "../constants";
import { ICourse } from "../../courses";

// ─── Sub-component ────────────────────────────────────────────────────────────
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

function PlayCircleIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4648D4] flex items-center justify-center shrink-0 group-hover/card:scale-110 group-hover/card:bg-[#4648D4] group-hover/card:text-white transition-all duration-300 shadow-2xs">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="8 5 19 12 8 19 8 5" />
      </svg>
    </div>
  );
}

function CourseCard({ course }: { course: DashboardCourse }) {
  const nextLessonTitle = course.next_lesson ?? course.nextLesson ?? "Continue Learning";
  const thumbnail = course.thumbnail_url ?? course.thumbnailUrl;

  return (
    <Card variant="default" hoverEffect="lift" padding="none" className="group/card border-[#E8E8F2] flex flex-col justify-between h-full min-h-[420px] shadow-sm overflow-hidden">
      {/* Thumbnail Container (Standardized to h-52 across all dashboard courses) */}
      <div className="relative h-52 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.95] group-hover/card:brightness-100"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#1E1B4B] via-[#4648D4] to-[#6B6BFF]" />
        )}
        
        {/* Soft elegant gradient veil for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/95 via-[#1A1A2E]/30 to-transparent opacity-90 group-hover/card:opacity-80 transition-opacity" />
        
        {/* Progress badge pill overlaid */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#4648D4] shadow-md border border-white/50 flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{course.progress}% Completed</span>
        </div>

        {/* Course Title overlaid on bottom of image with fixed 2-line height alignment */}
        <div className="absolute bottom-4 left-5 right-5 z-10">
          <Link href="/courses/detail" className="block focus:outline-none">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md line-clamp-2 group-hover/card:text-[#4CD7F6] transition-colors">{course.title}</h3>
          </Link>
        </div>
      </div>

      {/* Interactive Progress Bar under image */}
      <div className="w-full bg-[#F4F4FA] h-2 overflow-hidden p-0">
        <div 
          className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#4648D4] transition-all duration-700 shadow-[0_0_8px_rgba(107,107,255,0.4)] group-hover/card:brightness-110" 
          style={{ width: `${course.progress}%` }}
        />
      </div>

      {/* Content Body (Standardized p-6 spacing) */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-5 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F9FE] border border-[#EAEAF4] hover:border-[#6B6BFF]/30 transition-colors shadow-2xs">
          <PlayCircleIcon />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6BFF] block mb-0.5">Up Next</span>
            <p className="text-xs sm:text-sm font-bold text-[#1A1A2E] truncate">{nextLessonTitle}</p>
          </div>
        </div>

        <Link
          href="/courses/lesson"
          className="w-full py-3.5 px-5 rounded-2xl text-sm font-bold text-[#4648D4] bg-[#EEF2FF] hover:bg-gradient-to-r hover:from-[#5052EE] hover:via-[#6669F6] hover:to-[#4CD7F6] hover:text-white border border-[#6B6BFF]/25 hover:border-transparent transition-all duration-200 shadow-2xs hover:shadow-[0_6px_20px_rgba(96,99,238,0.35)] flex items-center justify-center gap-2 group/btn mt-auto"
        >
          <span>Resume Session</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 transition-transform duration-200">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Card>
  );
}

interface ContinueLearningProps {
  courses?: DashboardCourse[];
}

export function ContinueLearning({ courses = DASHBOARD_COURSES as unknown as DashboardCourse[] }: ContinueLearningProps) {
  const items = courses && courses.length > 0 ? courses : (DASHBOARD_COURSES as unknown as DashboardCourse[]);

  return (
    <section aria-labelledby="continue-learning-heading" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#6B6BFF] to-[#4648D4] shadow-2xs" />
          <div>
            <h2
              id="continue-learning-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-[#1A1A2E]"
            >
              Continue Learning
            </h2>
            <p className="text-xs text-[#64647A]">Jump right back into your active course modules</p>
          </div>
        </div>
        
        <Link
          href="/courses"
          className="group/link inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#4648D4] bg-[#EEF2FF] hover:bg-[#6B6BFF]/20 border border-[#6B6BFF]/30 transition-all hover:shadow-2xs w-fit"
        >
          <span>Browse All Courses</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-1 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {items.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}





