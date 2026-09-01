import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { MyCourse } from "../types";

export function MyCourseCard({ course }: { course: MyCourse }) {
 const isCompleted = course.status === "completed";
 const isNotStarted = course.status === "not-started";

 const statusBadgeStyle = isCompleted
 ? "bg-[#27AE60] text-white border-transparent"
 : isNotStarted
 ? "bg-[#8A8478] text-white border-transparent"
 : "bg-[#2C3039] text-white border-transparent";

 const buttonStyle = isCompleted
 ? "bg-[#F5F0E8] text-[#2C3039] hover:bg-[#E8E2D9] border border-[#E8E2D9]"
 : isNotStarted
 ? "bg-[#2C3039] text-white hover:bg-[#1C1D23] border border-[#2C3039]"
 : "bg-[#C0392B] text-white hover:bg-[#A93226] border border-[#C0392B]";

 const buttonText = isCompleted ? "Ôn tập khoá học" : isNotStarted ? "Bắt đầu học ngay" : "Vào học tiếp";
 
 const labelText = isCompleted ? "Trạng thái" : isNotStarted ? "Bài học mở đầu" : "Bài học tiếp theo";

 return (
 <div className="group/card bg-white border border-[#E8E2D9] rounded-xl flex flex-col justify-between h-full hover:border-[#B8B0A3] transition-all duration-300 overflow-hidden">
 {/* Thumbnail Header */}
 <div className="relative h-44 w-full bg-[#2C3039] overflow-hidden shrink-0">
 {course.thumbnailUrl ? (
 <Image
 src={course.thumbnailUrl}
 alt={course.title}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 className="object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-[0.96] group-hover/card:brightness-100"
 />
 ) : (
 <div className="w-full h-full bg-[#4A4F5C]" />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

 {/* Top Badges */}
 <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
 <div className={twMerge("px-2.5 py-1 rounded-full text-xs font-semibold tracking-normal border flex items-center gap-1.5", statusBadgeStyle)}>
 {isCompleted ? "Đã hoàn tất" : isNotStarted ? "Chưa bắt đầu" : "Đang học"}
 </div>
 </div>

 {course.isAiRecommended && (
 <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#C0392B] text-[10px] font-bold border border-[#E8E2D9] z-10 uppercase tracking-wider">
 <span>AI Đề xuất</span>
 </div>
 )}

 {/* Overlaid Lesson Progress Counter */}
 <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-white z-10">
 <span className="text-xs font-medium tracking-wide bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-white/25 text-white">
 {course.lessonsCompleted}/{course.totalLessons} bài học
 </span>
 <span className="text-sm font-bold text-white drop-shadow-md">
 {course.progress}%
 </span>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-[#F5F0E8] h-1.5 overflow-hidden border-b border-[#E8E2D9]">
 <div
 className="h-full transition-all duration-700 bg-[#2C3039]"
 style={{ width: `${course.progress}%` }}
 role="progressbar"
 aria-valuenow={course.progress}
 aria-valuemin={0}
 aria-valuemax={100}
 />
 </div>

 {/* Body Content */}
 <div className="p-5 flex flex-col flex-1 bg-white justify-between gap-4">
 <div>
 <Link href={`/courses/detail?courseId=${course.id}`} className="block text-decoration-none focus:outline-none min-w-0 group/title">
 <h3 className="text-base sm:text-lg font-bold text-[#2C3039] leading-snug line-clamp-1 group-hover/card:text-[#C0392B] group-hover/title:text-[#C0392B] transition-colors font-[family-name:var(--font-playfair-display)]">
 {course.title}
 </h3>
 </Link>

 {/* Next Lesson Tile */}
 <div className="mt-3 bg-[#FAF7F2] rounded-lg p-3 flex items-center gap-3 border border-[#E8E2D9] group-hover/card:border-[#B8B0A3] transition-all duration-200">
 <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] text-[#C0392B] flex items-center justify-center shrink-0 group-hover/card:bg-[#C0392B] group-hover/card:text-white transition-all duration-300 text-xs font-bold">
 {isCompleted ? "C" : "N"}
 </div>
 <div className="min-w-0 flex-1">
 <span className="text-xs font-medium block mb-0.5 text-[#8A8478]">
 {labelText}
 </span>
 <p className="text-xs sm:text-sm font-semibold text-[#2C3039] truncate">
 {course.nextLesson === "Course Completed " ? "Đã hoàn thành khóa học" : course.nextLesson}
 </p>
 </div>
 </div>
 </div>

 <Link
 href={`/courses/lesson?courseId=${course.id}`}
 className={twMerge(
 "w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center text-center text-decoration-none mt-auto",
 buttonStyle
 )}
 >
 <span>{buttonText}</span>
 </Link>
 </div>
 </div>
 );
}
