"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/src/shared/hooks";
import { CoursesHeader } from "./CoursesHeader";
import { ExploreMoreCard } from "./ExploreMoreCard";
import { MyCourseCard } from "./MyCourseCard";
import { useGetMyCourses } from "../api";
import type { CourseTabStatus, MyCourse } from "../types";

const TAB_LABELS: Record<CourseTabStatus, string> = {
 All: "Tất cả",
 "In Progress": "Đang học",
 Completed: "Đã hoàn tất",
 "Not Started": "Chưa bắt đầu",
};

export function FilteredCoursesView() {
 const { data: initialCourses = [], isLoading, isError } = useGetMyCourses();
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


 if (isLoading) {
 return (
 <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
 
 <p className="mt-4 text-[#8A8478] font-medium">Đang tải khoá học...</p>
 </div>
 );
 }

 if (isError) {
 return (
 <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
 <p className="text-[#C0392B] font-medium">Đã xảy ra lỗi khi tải khoá học. Vui lòng thử lại sau.</p>
 </div>
 );
 }

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
 <div className="col-span-full py-12 px-6 text-center bg-white rounded-xl border border-[#E8E2D9] flex flex-col items-center justify-center shadow-sm">
 <h3 className="text-base sm:text-lg font-bold text-[#2C3039] mb-1.5 font-[family-name:var(--font-playfair-display)]">Không tìm thấy khoá học phù hợp</h3>
 <p className="text-xs sm:text-sm font-normal text-[#8A8478] max-w-md mb-5 leading-relaxed">
 Hệ thống không tìm thấy khoá học nào trong mục "{TAB_LABELS[activeTab]}"{searchQuery ? ` với từ khoá "${searchQuery}"` : ""}. Bạn hãy thử thay đổi tiêu chí bộ lọc hoặc tìm kiếm từ khoá khác.
 </p>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => {
 setActiveTab("All");
 setSearchQuery("");
 }}
 className="px-5 py-2.5 rounded-lg bg-white border border-[#E8E2D9] text-[#2C3039] text-xs sm:text-sm font-semibold hover:bg-[#F5F0E8] transition-all"
 >
 Đặt lại bộ lọc
 </button>
 {activeTab === "All" && !searchQuery && (
 <Link
 href="/explore"
 className="px-5 py-2.5 rounded-lg bg-[#2C3039] text-white text-xs sm:text-sm font-semibold hover:bg-[#1C1D23] transition-all text-decoration-none"
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
