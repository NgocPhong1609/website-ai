"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/src/shared/hooks";
import { CoursesHeader } from "./CoursesHeader";
import { ExploreMoreCard } from "./ExploreMoreCard";
import { MyCourseCard } from "./MyCourseCard";
import type { CourseTabStatus, MyCourse } from "../types";

const TAB_LABELS: Record<CourseTabStatus, string> = {
  All: "Tất cả",
  "In Progress": "Đang học",
  Completed: "Đã hoàn tất",
  "Not Started": "Chưa bắt đầu",
};

interface FilteredCoursesViewProps {
  initialCourses: MyCourse[];
}

export function FilteredCoursesView({ initialCourses }: FilteredCoursesViewProps) {
  const [activeTab, setActiveTab] = useState<CourseTabStatus>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Debounce both status selection and search text by 300ms using custom hook
  const debouncedTab = useDebounce(activeTab, 300);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Calculate exact counts for all tabs
  const counts = useMemo<Record<CourseTabStatus, number>>(() => {
    const inProg = initialCourses.filter((c) => c.status === "in-progress").length;
    const comp = initialCourses.filter((c) => c.status === "completed").length;
    const notSt = initialCourses.filter((c) => c.status === "not-started").length;
    return {
      All: initialCourses.length,
      "In Progress": inProg,
      Completed: comp,
      "Not Started": notSt,
    };
  }, [initialCourses]);

  // Filter courses based on debounced tab status and debounced search keyword
  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesStatus =
        debouncedTab === "All" ||
        (debouncedTab === "In Progress" && course.status === "in-progress") ||
        (debouncedTab === "Completed" && course.status === "completed") ||
        (debouncedTab === "Not Started" && course.status === "not-started");

      const matchesSearch =
        debouncedQuery.trim() === "" ||
        course.title.toLowerCase().includes(debouncedQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [initialCourses, debouncedTab, debouncedQuery]);


  return (
    <div className="flex flex-col">
      <CoursesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Courses Grid with 3-column layout from lg screen width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full py-12 px-6 text-center bg-white rounded-2xl border border-[#EAEAF4] flex flex-col items-center justify-center shadow-sm">
            <span className="text-4xl mb-3" role="img" aria-label="empty">🔍</span>
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A2E] mb-1.5">Không tìm thấy khoá học phù hợp</h3>
            <p className="text-xs sm:text-sm font-normal text-[#64647A] max-w-md mb-5 leading-relaxed">
              Hệ thống không tìm thấy khoá học nào trong mục &quot;{TAB_LABELS[activeTab]}&quot;{searchQuery ? ` với từ khoá "${searchQuery}"` : ""}. Bạn hãy thử thay đổi tiêu chí bộ lọc hoặc tìm kiếm từ khoá khác.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#EAEAF4] text-[#64647A] text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#F4F4FA] transition-all"
              >
                Đặt lại bộ lọc
              </button>
              {activeTab === "All" && !searchQuery && (
                <Link
                  href="/explore"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] text-white text-xs sm:text-sm font-semibold shadow-sm hover:opacity-95 transition-all"
                >
                  Khám phá Khóa học
                </Link>
              )}
            </div>
          </div>
        )}
        <ExploreMoreCard />
      </div>
    </div>
  );
}
