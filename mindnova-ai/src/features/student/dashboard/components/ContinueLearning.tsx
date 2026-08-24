import Link from "next/link";
import Image from "next/image";
import type { DashboardCourse } from "../types";
import { DASHBOARD_COURSES } from "../constants";

function PlayCircleIcon() {
  return (
    <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center shrink-0 group-hover/card:bg-[#5052EE] group-hover/card:text-white transition-all duration-300 shadow-2xs">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" className="ml-0.5">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  );
}

function CourseCard({ course }: { course: DashboardCourse }) {
  const nextLessonTitle = course.next_lesson ?? course.nextLesson ?? "Tiếp tục bài học";
  const thumbnail = course.thumbnail_url ?? course.thumbnailUrl;
  const isAiPlan = String(course.id).startsWith("ai-custom-");
  const detailLink = isAiPlan ? "/study-plan" : "/courses/detail";
  const lessonLink = isAiPlan ? "/study-plan" : "/courses/lesson";

  return (
    <div className={`group/card bg-white border rounded-2xl flex flex-col justify-between h-full transition-all duration-300 overflow-hidden relative ${
      isAiPlan 
        ? "border-[#4CD7F6]/50 shadow-[0_0_15px_rgba(76,215,246,0.15)] hover:shadow-[0_0_25px_rgba(76,215,246,0.25)] hover:border-[#6B6BFF]/70"
        : "border-[#EAEAF4] shadow-sm hover:shadow-md hover:border-[#5052EE]/40"
    }`}>
      {/* Compact Thumbnail Container matching /courses clean style */}
      <div className="relative h-44 w-full bg-[#1A1A2E] overflow-hidden shrink-0">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.96] group-hover/card:brightness-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-tr ${isAiPlan ? "from-[#1A1A2E] via-[#4648D4] to-[#4CD7F6]" : "from-[#1E1B4B] via-[#4648D4] to-[#6B6BFF]"}`} />
        )}
        
        {/* Gentle veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 via-transparent to-transparent opacity-80" />
        
        {/* Progress badge pill overlaid cleanly at top right */}
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-[#0D9488] shadow-sm border border-white/50 flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{course.progress}% hoàn thành</span>
        </div>

        {/* Special AI Badge */}
        {isAiPlan && (
          <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4648D4] to-[#0D9488] text-white text-[10px] font-bold shadow-sm border border-white/20 flex items-center gap-1.5 z-10 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            ✨ AI Roadmap
          </div>
        )}
      </div>

      {/* Interactive Progress Bar under thumbnail */}
      <div className="w-full bg-[#F4F4FA] h-1.5 overflow-hidden p-0 border-b border-[#EAEAF4]">
        <div 
          className="h-full bg-gradient-to-r from-[#4CD7F6] via-[#6B6BFF] to-[#10B981] transition-all duration-700 shadow-2xs group-hover/card:brightness-110" 
          style={{ width: `${course.progress}%` }}
        />
      </div>

      {/* Clean White Content Body (Proportional padding and typography) */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
        <div>
          <Link href={detailLink} className="block text-decoration-none focus:outline-none min-w-0 group/title">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] leading-snug line-clamp-1 group-hover/card:text-[#5052EE] group-hover/title:text-[#5052EE] transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Compact Up Next tile */}
          <div className="mt-3 bg-[#F8FAFC] rounded-xl p-3 flex items-center gap-3 border border-[#EAEAF4]/80 group-hover/card:border-[#5052EE]/25 group-hover/card:bg-[#EEF2FF]/20 transition-all duration-200">
            <PlayCircleIcon />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-[#7878A0] block mb-0.5">Bài tiếp theo</span>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1A2E] truncate">{nextLessonTitle}</p>
            </div>
          </div>
        </div>

        <Link
          href={lessonLink}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#5052EE] bg-[#EEF2FF] hover:bg-gradient-to-r hover:from-[#4648D4] hover:to-[#0D9488] hover:text-white border border-[#5052EE]/20 hover:border-transparent transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 group/btn mt-auto text-decoration-none"
        >
          <span>{isAiPlan ? "Xem lộ trình AI" : "Vào học tiếp"}</span>
          <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
        </Link>
      </div>
    </div>
  );
}

interface ContinueLearningProps {
  courses?: DashboardCourse[];
}

export function ContinueLearning({ courses = DASHBOARD_COURSES as unknown as DashboardCourse[] }: ContinueLearningProps) {
  const items = courses && courses.length > 0 ? courses : (DASHBOARD_COURSES as unknown as DashboardCourse[]);

  return (
    <section aria-labelledby="continue-learning-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#F0F0F8] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-6 rounded-full bg-gradient-to-b from-[#4648D4] via-[#5052EE] to-[#0D9488]" />
          <div>
            <h2
              id="continue-learning-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-[#1A1A2E]"
            >
              Tiếp tục học tập
            </h2>
            <p className="text-xs font-normal text-[#64647A]">Nhanh chóng quay lại các học phần bạn đang theo đuổi</p>
          </div>
        </div>
        
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] hover:bg-[#E0E0FF] border border-[#5052EE]/20 transition-all text-decoration-none w-fit shrink-0"
        >
          <span>Xem tất cả khoá học ➔</span>
        </Link>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
