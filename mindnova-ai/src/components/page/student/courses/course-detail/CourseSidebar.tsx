import Image from "next/image";
import Link from "next/link";
import { COURSE_DETAIL } from "@/src/components/page/student/courses/constants/detail";
import type { ILesson, IModule, IResource } from "@/src/components/page/student/courses/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
    </svg>
  );
}

function FileZipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function getResourceIcon(type: IResource["type"]) {
  switch (type) {
    case "zip": return <FileZipIcon />;
    case "link": return <LinkIcon />;
    case "chat": return <ChatIcon />;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CourseProgressCard() {
  const { progress, lessonsLeftTime } = COURSE_DETAIL;

  // Derive total/completed from modules for accuracy
  const allLessons = COURSE_DETAIL.modules.flatMap((m: IModule) => m.lessons);
  const completedCount = allLessons.filter((l: ILesson) => l.status === "completed").length;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <div className="flex items-end justify-between mb-3">
        <h3 className="text-[14px] font-bold text-[#4F46E5] mb-1">Course Progress</h3>
        <span className="text-[28px] font-bold text-[#4F46E5] leading-none">{progress}%</span>
      </div>

      <div className="h-2 rounded-full bg-[#EEF2FF] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[12px] font-medium text-[#6B7280]">
        <ClockIcon />
        <span>
          {completedCount}/{allLessons.length} lessons completed • {lessonsLeftTime}
        </span>
      </div>
    </div>
  );
}

function AiInsightCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#A5B4FC] p-5 shadow-[0_4px_20px_rgba(79,70,229,0.08)] relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#EEF2FF] rounded-bl-full -z-10" />

      <div className="flex items-center gap-2 mb-3 text-[#4F46E5]">
        <SparkleIcon />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          AI Tutor Insight
        </span>
      </div>

      <p className="text-[13px] text-[#4B5563] leading-relaxed">
        &ldquo;You&apos;re making great progress! Most students find <strong>Route Handlers</strong> challenging but you&apos;ve completed 72% of the prerequisite modules. Would you like a 5-minute summary of the core concepts?&rdquo;
      </p>

      <button
        type="button"
        className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors focus:outline-none"
      >
        Show Summary
      </button>
    </div>
  );
}

function ResourcesCard() {
  const { resources } = COURSE_DETAIL;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
      <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
        Resources
      </h3>
      <ul className="flex flex-col gap-3">
        {resources.map((res: IResource) => (
          <li key={res.id}>
            <a
              href={res.url}
              className="flex items-center gap-3 text-[14px] font-semibold text-[#4B5563] hover:text-[#111827] transition-colors"
            >
              <div className="text-[#6B7280]">{getResourceIcon(res.type)}</div>
              {res.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstructorCard() {
  const { instructor } = COURSE_DETAIL;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col items-center text-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm ring-1 ring-black/5">
        <Image
          src={instructor.avatarUrl}
          alt={instructor.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-[16px] font-bold text-[#111827]">{instructor.name}</h3>
      <p className="text-[13px] text-[#6B7280]">{instructor.role}</p>

      <Link
        href="#"
        className="mt-3 text-[13px] font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CourseSidebar() {
  return (
    <aside className="w-[300px] xl:w-[340px] shrink-0 flex flex-col gap-4">
      <CourseProgressCard />
      <AiInsightCard />
      <ResourcesCard />
      <InstructorCard />
    </aside>
  );
}
