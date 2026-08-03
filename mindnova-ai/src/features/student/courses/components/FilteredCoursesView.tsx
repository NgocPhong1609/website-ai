"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/src/shared/hooks";
import { CoursesHeader } from "./CoursesHeader";
import { ExploreMoreCard } from "./ExploreMoreCard";
import { MyCourseCard } from "./MyCourseCard";
import type { CourseTabStatus, MyCourse } from "../types";

interface FilteredCoursesViewProps {
  initialCourses: MyCourse[];
}

/**
 * Client Component leaf node (Rule #2) handling interactive debounced status filtering and search.
 * Uses custom useDebounce hook (Rule #1) to optimize performance and prevent re-render thrashing.
 */
export function FilteredCoursesView({ initialCourses }: FilteredCoursesViewProps) {
  const [activeTab, setActiveTab] = useState<CourseTabStatus>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Debounce both status selection and search text by 300ms using our custom hook
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
      // Status match logic
      const matchesStatus =
        debouncedTab === "All" ||
        (debouncedTab === "In Progress" && course.status === "in-progress") ||
        (debouncedTab === "Completed" && course.status === "completed") ||
        (debouncedTab === "Not Started" && course.status === "not-started");

      // Title search match logic
      const matchesSearch =
        debouncedQuery.trim() === "" ||
        course.title.toLowerCase().includes(debouncedQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [initialCourses, debouncedTab, debouncedQuery]);

  const isFiltering = activeTab !== debouncedTab || searchQuery !== debouncedQuery;

  return (
    <div className="flex flex-col">
      <CoursesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Courses Grid with gentle opacity transition during debounced filtering */}
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12 transition-opacity duration-200 ${isFiltering ? "opacity-60" : "opacity-100"}`}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full py-12 px-4 text-center bg-[#F8FAFC] rounded-2xl border border-[#EAEAF4] flex flex-col items-center justify-center">
            <span className="text-4xl mb-3" role="img" aria-label="empty">🔍</span>
            <h3 className="text-base font-bold text-[#111827] mb-1">No courses matched your filter</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mb-4">
              We couldn&apos;t find any courses matching your criteria &quot;{activeTab}&quot;{searchQuery ? ` with title "${searchQuery}"` : ""}.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-sm hover:bg-[#4338CA] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
        <ExploreMoreCard />
      </div>
    </div>
  );
}
