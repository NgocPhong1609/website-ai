import Link from "next/link";
import { COURSE_DETAIL } from "@features/courses/constants/detail";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CourseHeader() {
  const { title, level, description, nextLesson } = COURSE_DETAIL;

  return (
    <div className="mb-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280] mb-6">
        <Link href="/courses" className="hover:text-[#111827] transition-colors">
          My Courses
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-[#4F46E5]">{title}</span>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col items-start gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold text-white bg-[#22D3EE] tracking-wide uppercase shadow-sm">
          {level}
        </span>
        <h1 className="text-[32px] md:text-[36px] font-bold text-[#111827] tracking-tight leading-none">
          {title}
        </h1>
        <p className="text-[15px] text-[#4B5563] max-w-3xl leading-relaxed mt-1">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:ring-offset-1 shadow-sm"
        >
          <PlayIcon />
          Continue Learning ({nextLesson})
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:ring-offset-1 shadow-sm"
        >
          <BookmarkIcon />
          Save Course
        </button>
      </div>
    </div>
  );
}
