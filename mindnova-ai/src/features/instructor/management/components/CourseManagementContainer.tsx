"use client";

// ─── CourseManagementContainer ────────────────────────────────────────────────
// Main content area for the instructor course management page.
// Composes: header, AI banner, revenue card, filter tabs, course grid, pagination.

import { AIBanner } from "./AIBanner";
import { RevenueCard } from "./RevenueCard";
import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";
import { useInstructorCourses } from "../api/courses";

export function CourseManagementContainer() {
  const { data: courses, isLoading, isError } = useInstructorCourses();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] w-full mx-auto">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Quản lý khóa học
          </h1>
          <p className="mt-1 text-sm text-[#9090B0]">
            Theo dõi và tinh chỉnh nội dung giáo dục AI của bạn.
          </p>
        </div>

        {/* Filter tabs */}
        <CourseFilterTabs />
      </div>

      {/* ── Banner + Revenue row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
        <AIBanner />
        <RevenueCard />
      </div>

      {/* ── Course grid ──────────────────────────────────────────────── */}
      <section aria-label="Danh sách khóa học">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 flex items-center justify-center text-[#9090B0]">
              Đang tải dữ liệu...
            </div>
          ) : isError ? (
            <div className="col-span-full py-12 flex items-center justify-center text-red-500">
              Lỗi khi tải danh sách khóa học
            </div>
          ) : (
            <>
              {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {/* "Create new" placeholder card */}
              <CreateCourseCard />
            </>
          )}
        </div>
      </section>

      {/* ── Pagination ───────────────────────────────────────────────── */}
      <CoursePagination />
    </div>
  );
}
