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
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 9;

function CourseManagementContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  
  const { data: courses, isLoading, isError } = useInstructorCourses(search);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");

  const totalCourses = courses?.length || 0;
  const activeCourses = courses?.filter(c => c.status === "published").length || 0;
  const draftCourses = courses?.filter(c => c.status === "draft").length || 0;

  const counts = {
    all: totalCourses,
    active: activeCourses,
    draft: draftCourses,
  };

  const filteredCourses = courses?.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.status === "published";
    if (filter === "draft") return c.status === "draft";
    return true;
  });

  // Combine courses and a placeholder for the "Create New Course" card
  const allItems = [...(filteredCourses || []), "CREATE_CARD"];
  
  const paginatedItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(newFilter: "all" | "active" | "draft") {
    setFilter(newFilter);
    setPage(1); // Reset to page 1 on filter change
  }

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
        <CourseFilterTabs counts={counts} onFilterChange={handleFilterChange} />
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
          ) : allItems.length === 1 && allItems[0] === "CREATE_CARD" ? (
            <div className="col-span-full flex items-center justify-center py-16 text-[13px] text-[#B0B0C8]">
              {search ? `Không tìm thấy khóa học nào phù hợp với từ khóa "${search}".` : "Bạn chưa có khóa học nào. Hãy tạo khóa học đầu tiên nhé!"}
            </div>
          ) : (
            <>
              {paginatedItems.map((item, index) => {
                if (item === "CREATE_CARD") {
                  return <CreateCourseCard key="create-card" />;
                }
                // @ts-ignore
                return <CourseCard key={item.id} course={item} />;
              })}
            </>
          )}
        </div>
      </section>

      {/* ── Pagination ───────────────────────────────────────────────── */}
      <CoursePagination 
        currentPage={page}
        totalItems={allItems.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

export function CourseManagementContainer() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CourseManagementContent />
    </Suspense>
  );
}