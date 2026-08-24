import Link from "next/link";
import Image from "next/image";
import type { DashboardCourse } from "../types";

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

  return (
    <div className="group/card bg-white border border-[#EAEAF4] rounded-2xl flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-[#5052EE]/40 transition-all duration-300 overflow-hidden">
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
          <div className="w-full h-full bg-gradient-to-tr from-[#1E1B4B] via-[#4648D4] to-[#6B6BFF]" />
        )}
        
        {/* Gentle veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 via-transparent to-transparent opacity-80" />
        
        {/* Progress badge pill overlaid cleanly at top right */}
        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-[#0D9488] shadow-sm border border-white/50 flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{course.progress}% hoàn thành</span>
        </div>
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
          <Link href="/courses/detail" className="block text-decoration-none focus:outline-none min-w-0 group/title">
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
          href={`/courses/lesson?courseId=${course.id}`}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#5052EE] bg-[#EEF2FF] hover:bg-gradient-to-r hover:from-[#4648D4] hover:to-[#0D9488] hover:text-white border border-[#5052EE]/20 hover:border-transparent transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 group/btn mt-auto text-decoration-none"
        >
          <span>Vào học tiếp</span>
          <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
        </Link>
      </div>
    </div>
  );
}

interface ContinueLearningProps {
  courses?: DashboardCourse[];
}

export function ContinueLearning({ courses = [] }: ContinueLearningProps) {
  const items = courses || [];

  if (items.length === 0) {
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
            href="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] hover:bg-[#E0E0FF] border border-[#5052EE]/20 transition-all text-decoration-none w-fit shrink-0"
          >
            <span>Khám phá khoá học ➔</span>
          </Link>
        </div>

        <div className="w-full bg-white border border-[#EAEAF4] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#5052EE] flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Bạn chưa bắt đầu khóa học nào</h3>
          <p className="text-sm text-[#64647A] max-w-md mb-6">Hãy khám phá thư viện khóa học của chúng tôi và bắt đầu hành trình học tập của bạn ngay hôm nay.</p>
          <Link
            href="/explore"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#4648D4] to-[#0D9488] hover:shadow-md hover:opacity-90 transition-all text-decoration-none"
          >
            Tìm khóa học
          </Link>
        </div>
      </section>
    );
  }

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
          href="/explore"
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
