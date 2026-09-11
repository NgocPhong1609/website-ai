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

 const uniqueCourses = useMemo(() => {
   const seen = new Set<string | number>();
   return initialCourses.filter((c) => {
     if (seen.has(c.id)) return false;
     seen.add(c.id);
     return true;
   });
 }, [initialCourses]);

 // Debounce both status selection and search text by 300ms using custom hook
 const debouncedTab = useDebounce(activeTab, 300);
 const debouncedQuery = useDebounce(searchQuery, 300);

 // Calculate exact counts for all tabs
 const counts = useMemo<Record<CourseTabStatus, number>>(() => {
   const inProg = uniqueCourses.filter((c) => c.status === "in-progress").length;
   const comp = uniqueCourses.filter((c) => c.status === "completed").length;
   const notSt = uniqueCourses.filter((c) => c.status === "not-started").length;
   return {
     All: uniqueCourses.length,
     "In Progress": inProg,
     Completed: comp,
     "Not Started": notSt,
   };
 }, [uniqueCourses]);

 // Filter courses based on debounced tab status and debounced search keyword
 const filteredCourses = useMemo(() => {
   return uniqueCourses.filter((course) => {
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
 }, [uniqueCourses, debouncedTab, debouncedQuery]);


 if (isLoading) {
 return (
 <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
 
 <p className="mt-4 text-slate-500 font-medium">Đang tải khoá học...</p>
 </div>
 );
 }

 if (isError) {
 return (
 <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
 <p className="text-red-500 font-medium">Đã xảy ra lỗi khi tải khoá học. Vui lòng thử lại sau.</p>
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
 filteredCourses.map((course, idx) => (
 <MyCourseCard key={`${course.id}-${idx}`} course={course} />
 ))
 ) : (
 <div className="col-span-full py-12 px-6 text-center bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
 <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Không tìm thấy khoá học phù hợp</h3>
 <p className="text-xs sm:text-sm font-normal text-slate-500 max-w-md mb-5 leading-relaxed">
 Hệ thống không tìm thấy khoá học nào trong mục "{TAB_LABELS[activeTab]}"{searchQuery ? ` với từ khoá "${searchQuery}"` : ""}. Bạn hãy thử thay đổi tiêu chí bộ lọc hoặc tìm kiếm từ khoá khác.
 </p>
 <div className="flex gap-3">

 {activeTab === "All" && !searchQuery && (
 <Link
 href="/explore"
 className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all text-decoration-none shadow-sm"
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
