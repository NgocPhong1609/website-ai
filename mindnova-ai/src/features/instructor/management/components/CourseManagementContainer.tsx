"use client";

import { useInstructorCourses } from "../api/courses";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NoData } from "@/src/shared/components/ui/NoData";
import { Loader } from "@/src/shared/components/ui/Loader";

import { CourseFilterTabs } from "./CourseFilterTabs";
import { CourseCard } from "./CourseCard";
import { CreateCourseCard } from "./CreateCourseCard";
import { CoursePagination } from "./CoursePagination";

const PAGE_SIZE = 9;

function CourseManagementContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const { data: courses, isLoading, isError } = useInstructorCourses(urlSearch || undefined);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price_high" | "price_low" | "title_az">("newest");

  const totalCourses = courses?.length || 0;
  const activeCourses = courses?.filter((c) => c.status === "published" || c.status === "approved").length || 0;
  const pendingCourses = courses?.filter((c) => c.status === "pending" || c.status === "pending_review" || c.status === "pending_approval" || c.status === "under_review").length || 0;
  const draftCourses = courses?.filter((c) => c.status === "draft" || (!c.status && c.status !== "published" && c.status !== "pending" && c.status !== "pending_review")).length || 0;

  const counts = {
    all: totalCourses,
    active: activeCourses,
    pending: pendingCourses,
    draft: draftCourses,
  };

  const processedCourses = useMemo(() => {
    if (!courses) return [];

    let list = courses.filter((c) => {
      const isPublished = c.status === "published" || c.status === "approved";
      const isPending = c.status === "pending" || c.status === "pending_review" || c.status === "pending_approval" || c.status === "under_review";
      const isDraft = c.status === "draft" || (!c.status && !isPublished && !isPending);

      if (filter === "active" && !isPublished) return false;
      if (filter === "pending" && !isPending) return false;
      if (filter === "draft" && !isDraft) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = c.title?.toLowerCase().includes(q);
        const matchDesc = (c as any).description?.toLowerCase()?.includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "newest") return Number(b.id || 0) - Number(a.id || 0);
      if (sortBy === "oldest") return Number(a.id || 0) - Number(b.id || 0);
      if (sortBy === "price_high") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "price_low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "title_az") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });
  }, [courses, filter, searchQuery, sortBy]);

  const allItems = [...processedCourses, "CREATE_CARD"];
  const paginatedItems = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(newFilter: "all" | "active" | "pending" | "draft") {
    setFilter(newFilter);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#F4F4F8] font-sans">
      <div className="max-w-[1200px] w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 pb-20 animate-fadeIn">
        {/* ── Page Header & Filter Tabs ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#2C3039] tracking-tight">
              Quản lý khóa học
            </h1>
            <p className="mt-1.5 text-xs text-[#8A8478] font-medium max-w-xl leading-relaxed">
              Theo dõi, phân tích và tối ưu hóa hệ thống tài liệu giáo dục của bạn với sự hỗ trợ của trí tuệ nhân tạo MindNova AI.
            </p>
          </div>

          <CourseFilterTabs counts={counts} onFilterChange={handleFilterChange} />
        </div>

        {/* ── Search & Sort Bar ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#8A8478]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FEFCF9] text-xs font-semibold text-[#2C3039] placeholder:text-[#8A8478] focus:outline-none focus:ring-2 focus:ring-[#C0392B] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8A8478] shrink-0">
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FEFCF9] text-xs font-bold text-[#2C3039] focus:outline-none focus:ring-2 focus:ring-[#C0392B] cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_high">Giá: Cao đến Thấp</option>
              <option value="price_low">Giá: Thấp đến Cao</option>
              <option value="title_az">Tên: A → Z</option>
            </select>
          </div>
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
                  description={
                    searchQuery
                      ? `Không tìm thấy khóa học nào phù hợp với từ khóa "${searchQuery}".`
                      : "Bạn chưa có khóa học nào. Hãy tạo khóa học đầu tiên nhé!"
                  }
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