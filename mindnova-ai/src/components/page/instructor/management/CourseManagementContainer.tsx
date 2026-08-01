// ─── CourseManagementContainer ────────────────────────────────────────────────
// Main content area for the instructor course management page.

import { AIBanner } from "./AIBanner";
import { RevenueCard } from "./RevenueCard";
import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";
import { MOCK_COURSES } from "./constants/data";

export function CourseManagementContainer() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-[1200px] w-full mx-auto pb-20">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight">
            Quản lý khóa học
          </h1>
          <p className="mt-1.5 text-[14px] text-[#6B7280] font-medium">
            Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn.
          </p>
        </div>

        {/* Filter tabs */}
        <CourseFilterTabs />
      </div>

      {/* ── Banner + Revenue row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <AIBanner />
        <RevenueCard />
      </div>

      {/* ── Course grid ──────────────────────────────────────────────── */}
      <section aria-label="Danh sách khóa học" className="mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {/* "Create new" placeholder card */}
          <CreateCourseCard />
        </div>
      </section>

      {/* ── Pagination ───────────────────────────────────────────────── */}
      <CoursePagination />
    </div>
  );
}
