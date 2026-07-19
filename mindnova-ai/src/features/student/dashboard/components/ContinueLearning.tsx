import Link from "next/link";
import Image from "next/image";
import { DASHBOARD_COURSES } from "@features/dashboard/constants/data";
import type { ICourse } from "@features/courses/types";

// ─── Sub-component ────────────────────────────────────────────────────────────

function PlayCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

interface CourseCardProps {
  course: ICourse;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F8] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative h-32 w-full bg-gray-100">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${course.thumbnailGradient}`} />
        )}
        
        {/* Progress badge overlaid */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white text-[11px] font-bold text-[#4F46E5] shadow-sm">
          {course.progress}%
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-[#111827] mb-1.5">{course.title}</h3>
        <p className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
          <PlayCircleIcon />
          Next: {course.nextLesson}
        </p>

        <button
          type="button"
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1"
        >
          Resume Lesson
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContinueLearning() {
  return (
    <section aria-labelledby="continue-learning-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="continue-learning-heading"
          className="text-[18px] font-bold text-[#111827]"
        >
          Continue Learning
        </h2>
        <Link
          href="/courses"
          className="text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors flex items-center gap-1"
        >
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {DASHBOARD_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
