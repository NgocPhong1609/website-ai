"use client";

import { useInstructorCourses } from "../api/courses";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { NoData } from "@/src/shared/components/ui/NoData";
import { Loader } from "@/src/shared/components/ui/Loader";

import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";

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

  const allItems = [...(filteredCourses || []), "CREATE_CARD"];
  const paginatedItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(newFilter: "all" | "active" | "draft") {
    setFilter(newFilter);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#F4F4F8] font-sans">
      <div className="max-w-[1200px] w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 pb-20 animate-fadeIn">
        {/* ── Page Header & Filter Tabs ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Quản lý khóa học
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 font-medium max-w-xl leading-relaxed">
              Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn với sự hỗ trợ của trí tuệ nhân tạo MindNova AI.
            </p>
          </div>

          <CourseFilterTabs counts={counts} onFilterChange={handleFilterChange} />
        </div>



        {/* ── Course Grid ──────────────────────────────────────────────────────── */}
        <section aria-label="Danh sách khóa học">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-12 flex items-center justify-center">
                <Loader size="md" />
              </div>
            ) : isError ? (
              <div className="col-span-full py-12 flex items-center justify-center text-red-500">
                Lỗi khi tải danh sách khóa học
              </div>
            ) : allItems.length === 1 && allItems[0] === "CREATE_CARD" ? (
              <div className="col-span-full">
                <NoData
                  title="Chưa có khóa học"
                  description={search ? `Không tìm thấy khóa học nào phù hợp với từ khóa "${search}".` : "Bạn chưa có khóa học nào. Hãy tạo khóa học đầu tiên nhé!"}
                  action={<CreateCourseCard />}
                  className="py-16"
                />
              </div>
            ) : (
              <>
                {paginatedItems.map((item) => {
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

        {/* ── Pagination ───────────────────────────────────────────────────────── */}
        <CoursePagination 
          currentPage={page}
          totalItems={allItems.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export function CourseManagementContainer() {
  return (
    <Suspense fallback={<div className="flex-1 bg-[#F4F4F8] min-h-screen" />}>
      <CourseManagementContent />
    </Suspense>
  );
}