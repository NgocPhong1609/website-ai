import Link from "next/link";
import { twMerge } from "tailwind-merge";
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
 <section className="relative overflow-hidden rounded-2xl bg-[#FEFCF9] border border-[#E8E2D9] p-6 sm:p-7 transition-all duration-300 w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-3 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] text-xs font-semibold text-[#C0392B]">
 Danh mục Đào tạo • AI Co-Pilot
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3039] leading-tight font-[family-name:var(--font-playfair-display)]">
 Khóa học của bạn
 </h1>

 <p className="text-xs sm:text-sm text-[#8A8478] leading-relaxed font-normal">
 Quản lý và tiếp tục rèn luyện các chuyên đề đào tạo AI được cá nhân hoá theo năng lực. Hệ thống hiện đang theo dõi và đồng bộ tiến độ học tập thực tế của bạn.
 </p>
 </div>

 {/* Editorial Mastery Card */}
 <div className="group shrink-0 bg-white rounded-2xl p-5 border border-[#E8E2D9] flex flex-col justify-center min-w-[320px] sm:min-w-[380px] hover:border-[#B8B0A3] transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-semibold text-[#8A8478] group-hover:text-[#C0392B] transition-colors">Tiến độ tổng thể</span>
 <span className="text-[11px] font-bold text-[#2C3039] bg-[#E8F6F3] px-2.5 py-0.5 rounded-full border border-[#2C3039]/20">
 Đúng lộ trình
 </span>
 </div>

 <div className="text-3xl font-bold text-[#2C3039] my-1 flex items-baseline justify-between gap-6 font-[family-name:var(--font-playfair-display)]">
 <div>
 <span className="text-[#C0392B]">{completionPercentage}%</span>
 <span className="text-xs font-medium text-[#B8B0A3] ml-1.5">hoàn thành</span>
 </div>
 <span className="text-xs font-semibold text-[#8A8478]">
 {completedCount} / {totalCount} khoá học
 </span>
 </div>

 <div className="w-full h-1.5 bg-[#F5F0E8] rounded-full mt-2 overflow-hidden p-0 border border-[#E8E2D9]">
 <div
 className="h-full bg-[#2C3039] transition-all duration-1000"
 style={{ width: `${Math.max(completionPercentage, 12)}%` }}
 />
 </div>

 <p className="text-xs font-semibold text-[#C0392B] mt-3 flex items-center justify-between gap-4">
 <span>{inProgressCount} chuyên đề đang học tích cực</span>
 <Link href="/study-plan" className="text-[#2C3039] font-bold hover:underline text-decoration-none focus:outline-none">
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
 className="w-full pl-4 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#2C3039] bg-white border border-[#E8E2D9] placeholder:text-[#B8B0A3] focus:outline-none focus:ring-2 focus:ring-[#E8E2D9] focus:border-[#B8B0A3] transition-all duration-200"
 />
 {searchQuery && (
 <button
 type="button"
 onClick={() => onSearchChange?.("")}
 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#B8B0A3] hover:text-[#2C3039] font-bold focus:outline-none"
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
 "group whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 focus:outline-none flex items-center gap-2",
 isActive
 ? "bg-[#2C3039] text-white font-semibold"
 : "bg-white text-[#8A8478] font-medium hover:text-[#2C3039] hover:bg-[#F5F0E8] border border-[#E8E2D9]"
 )}
 >
 <span>{tab.label}</span>
 <span
 className={twMerge(
 "px-2 py-0.5 rounded-md text-[11px] transition-colors font-bold",
 isActive
 ? "bg-white/20 text-white"
 : "bg-[#F5F0E8] text-[#8A8478] group-hover:bg-[#E8E2D9] group-hover:text-[#2C3039]"
 )}
 >
 {count}
 </span>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 );
}
