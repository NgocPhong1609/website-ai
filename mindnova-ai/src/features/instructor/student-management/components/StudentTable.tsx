"use client";

import React, { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { getStudents, exportStudentsCSV, getNotificationOptions } from "../api";
import { StudentDetailSidebar, type StudentDetailData } from "./StudentDetailSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

export type ProgressStatus = "Hoàn tất" | "Đang học" | "Chưa bắt đầu" | "Nguy cơ trễ";

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus | string }) {
 let bar = "bg-slate-400";
 let text = "text-slate-500";
 let label = status;
 let bg = "bg-slate-50 border-slate-200";

 if (status === "Hoàn tất" || status === "completed") {
 bar = "bg-emerald-500"; text = "text-emerald-700"; bg = "bg-emerald-50 border-emerald-200"; label = "Hoàn tất";
 } else if (status === "Đang học" || status === "in-progress") {
 bar = "bg-blue-500"; text = "text-blue-600"; bg = "bg-blue-50 border-blue-100"; label = "Đang học";
 } else if (status === "Nguy cơ trễ" || status === "at-risk") {
 bar = "bg-rose-500"; text = "text-rose-600"; bg = "bg-rose-50 border-rose-200"; label = "Nguy cơ trễ";
 } else if (status === "Chưa bắt đầu") {
 bar = "bg-slate-400"; text = "text-slate-500"; bg = "bg-slate-50 border-slate-200"; label = "Chưa bắt đầu";
 }

 return (
 <div className="flex flex-col gap-1.5 min-w-[95px]">
 <div className="flex items-center justify-between gap-2">
 <span className={twMerge("text-xs font-bold font-mono", text)}>{progress}%</span>
 <span className={twMerge("text-[10px] font-semibold px-2 py-0.5 rounded-md leading-none border", text, bg)}>
 {label}
 </span>
 </div>
 <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
 <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
 </div>
 </div>
 );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
 if (avatarUrl) {
 return <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-lg shadow-sm object-cover shrink-0" />;
 }
 const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
 return (
 <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 text-xs font-bold shrink-0 shadow-sm">
 {initials}
 </div>
 );
}

const COLS = ["Hồ Sơ Học Viên", "Khóa Học Ghi Danh", "Tiến Độ & Trạng Thái", "Điểm & Tín Chỉ", "Ngày Ghi Danh"];

// ─── Custom Select Component ──────────────────────────────────────────────────
function CustomSelect({
 value,
 onChange,
 options,
}: {
 value: string;
 onChange: (val: string) => void;
 options: { id: string; name: string }[];
}) {
 const [isOpen, setIsOpen] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
 setIsOpen(false);
 }
 };
 if (isOpen) document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [isOpen]);

 const selectedOption = options.find((o) => o.id === value) || options[0];

 return (
 <div className="relative w-full sm:w-56" ref={containerRef}>
 <button
 type="button"
 onClick={() => setIsOpen(!isOpen)}
 className={twMerge(
 "w-full flex items-center justify-between px-3.5 py-2 rounded-lg border bg-white text-xs font-bold text-slate-900 cursor-pointer shadow-sm transition-all",
 isOpen ? "border-blue-500 ring-2 ring-blue-500/15" : "border-slate-200 hover:bg-slate-50"
 )}
 >
 <span className="truncate">{selectedOption.name}</span>
 <></>
 </button>

 {isOpen && (
 <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden py-1 animate-fadeIn">
 {options.map((opt) => (
 <button
 key={opt.id}
 type="button"
 onClick={() => {
 onChange(opt.id);
 setIsOpen(false);
 }}
 className={twMerge(
 "w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
 value === opt.id
 ? "bg-blue-50/70 text-blue-500"
 : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
 )}
 >
 {opt.name}
 </button>
 ))}
 </div>
 )}
 </div>
 );
}

// ─── StudentTable Component ───────────────────────────────────────────────────
export function StudentTable({ 
 searchTerm, 
 setSearchTerm, 
 filterCourse, 
 setFilterCourse, 
 page, 
 setPage 
}: { 
 searchTerm: string, setSearchTerm: (v: string) => void,
 filterCourse: string, setFilterCourse: (v: string) => void,
 page: number, setPage: (v: number) => void
}) {
 const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
 const [selectedStudent, setSelectedStudent] = useState<StudentDetailData | null>(null);

 useEffect(() => {
 const timer = setTimeout(() => {
 setDebouncedSearch(searchTerm);
 setPage(1);
 }, 500);
 return () => clearTimeout(timer);
 }, [searchTerm, setPage]);

 const { data, isLoading, isError } = useQuery({
 queryKey: ["students", debouncedSearch, filterCourse, page],
 queryFn: () => getStudents({
 search: debouncedSearch || undefined,
 course_id: filterCourse === "TẤT CẢ" ? undefined : filterCourse,
 page,
 per_page: 10
 }),
 staleTime: 5000,
 });

 const { data: coursesData } = useQuery({
 queryKey: ["instructorCoursesFilter"],
 queryFn: () => getNotificationOptions(),
 staleTime: 60000,
 });

 const coursesArray = Array.isArray(coursesData) ? coursesData : (coursesData?.data || []);

 const courseOptions = [
 { id: "TẤT CẢ", name: "TẤT CẢ KHÓA HỌC" },
 ...coursesArray.map((c: any) => ({
 id: String(c.value || c.id),
 name: c.title,
 })),
 ];

 return (
 <div className="w-full flex flex-col gap-5 animate-fadeIn">

 {/* Filter Toolbar */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
 <input
 id="search-student"
 type="search"
 placeholder=" Tìm theo họ tên hoặc email..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full sm:w-72 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 bg-slate-50/50"
 />

 <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto relative z-10">
 <CustomSelect
 value={filterCourse}
 onChange={(val) => {
 setFilterCourse(val);
 setPage(1);
 }}
 options={courseOptions}
 />
 </div>
 </div>

 {/* Main Table Grid */}
 <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[640px]">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
 {COLS.map((col) => (
 <th key={col} className="px-4 py-3.5 whitespace-normal break-words">
 {col}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-xs font-medium">
 {isLoading ? (
 Array.from({ length: 6 }).map((_, i) => (
 <tr key={i} aria-busy="true">
 <td className="px-5 py-4"><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full shrink-0" /><div className="space-y-2"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-40" /></div></div></td>
 <td className="px-5 py-4"><Skeleton className="h-3.5 w-40" /></td>
 <td className="px-5 py-4"><Skeleton className="h-2 w-28" /></td>
 <td className="px-5 py-4"><Skeleton className="h-3.5 w-20" /></td>
 <td className="px-5 py-4"><Skeleton className="h-7 w-16 ml-auto" /></td>
 </tr>
 ))
 ) : isError ? (
 <tr>
 <td colSpan={5} className="py-14 text-center text-xs font-bold text-rose-500">
 Lỗi tải dữ liệu. Vui lòng thử lại.
 </td>
 </tr>
 ) : !data || data.data.length === 0 ? (
 <tr>
 <td colSpan={5} className="py-14 text-center text-xs font-bold text-slate-400">
 Không tìm thấy hồ sơ học viên nào khớp với tiêu chí lựa chọn.
 </td>
 </tr>
 ) : (
 data.data.map((st: any) => (
 <tr key={st.enrollment_id} onClick={() => setSelectedStudent(st)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={st.name} avatarUrl={st.avatar_url} />
 <div className="min-w-0">
 <p className="font-semibold text-slate-900 truncate">{st.name}</p>
 <p className="text-[11px] font-medium text-slate-400 truncate">{st.email}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg border-slate-200 whitespace-nowrap">
 {st.course.title}
 </span>
 </td>
 <td className="px-6 py-4">
 <ProgressBadge progress={st.progress} status={st.status} />
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col gap-1.5 items-start">
 <div className="flex items-center gap-2 whitespace-nowrap">
 <span className={twMerge("font-mono text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm whitespace-nowrap shrink-0", st.average_score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : (st.average_score !== null ? "text-amber-700 bg-amber-50 border-amber-200" : "text-slate-500 bg-slate-50 border-slate-200"))}>
 {st.average_score !== null ? `${st.average_score}/100` : "Chưa có"}
 </span>
 <span className="px-2 py-0.5 rounded-md bg-sky-50 text-blue-500 border-slate-200 text-[10px] font-bold font-mono whitespace-nowrap shrink-0">
 {st.total_credits ? `${st.total_credits} tín` : "0 tín"}
 </span>
 </div>

 {/* Quiz Breakdown Tooltip / List */}
 {Array.isArray(st.quiz_scores) && st.quiz_scores.length > 0 && (
 <div className="flex flex-col gap-1 mt-0.5 w-full">
 {st.quiz_scores.map((q: any) => (
 <div key={q.quiz_id} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 whitespace-nowrap">
 <span className="truncate max-w-[130px] shrink-1" title={q.title}>{q.title}:</span>
 <span className="font-mono font-bold text-slate-900 shrink-0">{q.score}/100</span>
 <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] whitespace-nowrap shrink-0 ${q.type === 'capability_assessment' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
 {q.credits} tín
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 </td>
 <td className="px-4 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">
 {st.enrolled_at ? new Date(st.enrolled_at).toLocaleDateString("vi-VN") : "N/A"}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination Controls */}
 {data && data.meta && (
 <div className="p-4 px-6 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
 <span className="text-xs font-bold text-slate-500">
 Hiển thị trang <strong className="text-slate-900 font-semibold">{data.meta.current_page}</strong> trên <strong className="text-slate-900 font-semibold">{data.meta.last_page}</strong> ({data.meta.total} học viên khớp)
 </span>
 <div className="flex items-center gap-1.5">
 <button
 type="button"
 onClick={() => setPage(Math.max(1, page - 1))}
 disabled={page === 1}
 className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
 >
 <ChevronLeft size={16} />
 </button>
 <button
 type="button"
 onClick={() => setPage(Math.min(data.meta.last_page, page + 1))}
 disabled={page >= data.meta.last_page}
 className="p-2 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 </div>
 )}
 </div>
 <StudentDetailSidebar student={selectedStudent} onClose={() => setSelectedStudent(null)} />
 </div>
 );
}