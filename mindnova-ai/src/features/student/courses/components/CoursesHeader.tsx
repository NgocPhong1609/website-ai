import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FilterX } from "lucide-react";
import type { CourseTabStatus } from "../types";

const TABS: { id: CourseTabStatus; label: string }[] = [
 { id: "All", label: "Tất cả" },
 { id: "In Progress", label: "Đang học" },
 { id: "Completed", label: "Đã hoàn tất" },
 { id: "Not Started", label: "Chưa bắt đầu" },
];

interface CoursesHeaderProps {
 activeTab?: CourseTabStatus;
 onTabChange?: (tab: CourseTabStatus) => void;
 searchQuery?: string;
 onSearchChange?: (query: string) => void;
 counts?: Record<CourseTabStatus, number>;
}

export function CoursesHeader({
 activeTab = "All",
 onTabChange,
 searchQuery = "",
 onSearchChange,
 counts = { All: 0, "In Progress": 0, Completed: 0, "Not Started": 0 },
}: CoursesHeaderProps) {
 const totalCount = counts["All"] ?? 0;
 const inProgressCount = counts["In Progress"] ?? 0;
 const completedCount = counts["Completed"] ?? 0;
 const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

 return (
 <div className="flex flex-col gap-8 mb-6">
 {/* ─── Editorial Hero Banner ─── */}
 <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 sm:p-7 transition-all duration-300 w-full shadow-sm">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-3 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600">
 Danh mục Đào tạo • AI Co-Pilot
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
 Khóa học của bạn
 </h1>

 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Quản lý và tiếp tục rèn luyện các chuyên đề đào tạo AI được cá nhân hoá theo năng lực. Hệ thống hiện đang theo dõi và đồng bộ tiến độ học tập thực tế của bạn.
 </p>
 </div>

 {/* Editorial Mastery Card */}
 <div className="group shrink-0 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center min-w-[320px] sm:min-w-[380px] hover:border-slate-200 hover:shadow-sm transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">Tiến độ tổng thể</span>
 <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
 Đúng lộ trình
 </span>
 </div>

 <div className="text-3xl font-bold text-slate-900 my-1 flex items-baseline justify-between gap-6">
 <div>
 <span className="text-blue-600">{completionPercentage}%</span>
 <span className="text-xs font-medium text-slate-400 ml-1.5">hoàn thành</span>
 </div>
 <span className="text-xs font-semibold text-slate-500">
 {completedCount} / {totalCount} khoá học
 </span>
 </div>

 <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden p-0 border border-slate-100">
 <div
 className="h-full bg-blue-500 transition-all duration-1000"
 style={{ width: `${Math.max(completionPercentage, 12)}%` }}
 />
 </div>

 <p className="text-xs font-semibold text-blue-600 mt-3 flex items-center justify-between gap-4">
 <span>{inProgressCount} chuyên đề đang học tích cực</span>
 <Link href="/study-plan" className="text-slate-900 font-bold hover:underline text-decoration-none focus:outline-none">
 Vào học ngay
 </Link>
 </p>
 </div>
 </div>
 </section>

 {/* ─── Search & Status Tab Controls ─── */}
 <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
 <div className="relative flex-1 max-w-md">
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => onSearchChange?.(e.target.value)}
 placeholder="Tìm kiếm khoá học theo tên..."
 className="w-full pl-4 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-slate-900 bg-white border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm"
 />
 {searchQuery && (
 <button
 type="button"
 onClick={() => onSearchChange?.("")}
 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 font-bold focus:outline-none"
 aria-label="Xóa tìm kiếm"
 >
 Xóa
 </button>
 )}
 </div>

 <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
 {TABS.map((tab) => {
 const isActive = tab.id === activeTab;
 const count = counts[tab.id] ?? 0;

 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => onTabChange?.(tab.id)}
 className={twMerge(
 "group whitespace-nowrap px-3.5 py-1.5 text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 rounded-lg",
 isActive
 ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200 shadow-sm"
 : "bg-white text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
 )}
 >
 <span>{tab.label}</span>
 <span
 className={twMerge(
 "px-1.5 py-0.5 rounded-md text-[10px] transition-colors font-bold",
 isActive
 ? "bg-white text-blue-600 border border-blue-100"
 : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
 )}
 >
 {count}
 </span>
 </button>
 );
 })}
 
 <button
 type="button"
 onClick={() => {
 if (activeTab !== "All" || searchQuery !== "") {
 onTabChange?.("All");
 onSearchChange?.("");
 }
 }}
 className={twMerge(
 "flex items-center justify-center p-2 rounded-lg transition-all focus:outline-none ml-1 shrink-0",
 (activeTab !== "All" || searchQuery !== "")
 ? "text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
 : "text-slate-300 cursor-not-allowed"
 )}
 title="Đặt lại bộ lọc"
 disabled={activeTab === "All" && searchQuery === ""}
 >
 <FilterX size={20} strokeWidth={2.5} />
 </button>
 </div>
 </div>
 </div>
 );
}
