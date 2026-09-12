"use client";

import React, { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { getStudents, exportStudentsCSV, getNotificationOptions } from "../api";
import { StudentDetailSidebar, type StudentDetailData } from "./StudentDetailSidebar";
import { DownloadIcon } from "./icons"; // Import if needed for export button inside table header

export type ProgressStatus = "Hoàn tất" | "Đang học" | "Chưa bắt đầu" | "Nguy cơ trễ";

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus | string }) {
 let bar = "bg-gray-400";
 let text = "text-[#64748B]";
 let label = status;
 let bg = "bg-[#F8FAFC] border-[#E2E8F0]";

 if (status === "Hoàn tất" || status === "completed") {
 bar = "bg-[#10B981]"; text = "text-[#047857]"; bg = "bg-emerald-50 border-emerald-200"; label = "Hoàn tất";
 } else if (status === "Đang học" || status === "in-progress") {
 bar = "bg-[#3B82F6]"; text = "text-[#2563EB]"; bg = "bg-blue-50 border-[#DBEAFE]"; label = "Đang học";
 } else if (status === "Nguy cơ trễ" || status === "at-risk") {
 bar = "bg-rose-500"; text = "text-rose-600"; bg = "bg-rose-50 border-rose-200"; label = "Nguy cơ trễ";
 } else if (status === "Chưa bắt đầu") {
 bar = "bg-gray-400"; text = "text-[#64748B]"; bg = "bg-[#F8FAFC] border-[#E2E8F0]"; label = "Chưa bắt đầu";
 }

 return (
 <div className="flex flex-col gap-1.5 min-w-[95px]">
 <div className="flex items-center justify-between gap-2">
 <span className={twMerge("text-xs font-black font-mono", text)}>{progress}%</span>
 <span className={twMerge("text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-none border", text, bg)}>
 {label}
 </span>
 </div>
 <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
 <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
 </div>
 </div>
 );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
 if (avatarUrl) {
 return <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-xl shadow-2xs object-cover shrink-0" />;
 }
 const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
 return (
 <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EFF6FF] text-[#2563EB] text-xs font-black shrink-0 shadow-2xs">
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
 "w-full flex items-center justify-between px-3.5 py-2 rounded-xl border bg-white text-xs font-bold text-[#0F172A] cursor-pointer shadow-2xs transition-all",
 isOpen ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/15" : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
 )}
 >
 <span className="truncate">{selectedOption.name}</span>
 <></>
 </button>

 {isOpen && (
 <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden py-1 animate-fadeIn">
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
 ? "bg-blue-50/70 text-[#3B82F6]"
 : "text-gray-700 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
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
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
 <input
 id="search-student"
 type="search"
 placeholder=" Tìm theo họ tên hoặc email..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#3B82F6] bg-[#F8FAFC]/50"
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
 <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[640px]">
 <thead>
 <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/70 text-[11px] font-black text-[#64748B] uppercase tracking-wider">
 {COLS.map((col) => (
 <th key={col} className="px-4 py-3.5 whitespace-normal break-words">
 {col}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-xs font-medium">
 {isLoading ? (
 <tr>
 <td colSpan={5} className="py-14 text-center">
 
 <p className="mt-2 font-bold text-gray-400">Đang tải dữ liệu học viên...</p>
 </td>
 </tr>
 ) : isError ? (
 <tr>
 <td colSpan={5} className="py-14 text-center text-xs font-bold text-rose-500">
 Lỗi tải dữ liệu. Vui lòng thử lại.
 </td>
 </tr>
 ) : !data || data.data.length === 0 ? (
 <tr>
 <td colSpan={5} className="py-14 text-center text-xs font-bold text-gray-400">
 Không tìm thấy hồ sơ học viên nào khớp với tiêu chí lựa chọn.
 </td>
 </tr>
 ) : (
 data.data.map((st: any) => (
 <tr key={st.enrollment_id} onClick={() => setSelectedStudent(st)} className="hover:bg-[#F8FAFC]/80 transition-colors cursor-pointer">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={st.name} avatarUrl={st.avatar_url} />
 <div className="min-w-0">
 <p className="font-extrabold text-[#0F172A] truncate">{st.name}</p>
 <p className="text-[11px] font-medium text-gray-400 truncate">{st.email}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="text-xs font-extrabold text-[#3B82F6] bg-blue-50 px-2.5 py-1 rounded-lg border-[#E2E8F0] whitespace-nowrap">
 {st.course.title}
 </span>
 </td>
 <td className="px-6 py-4">
 <ProgressBadge progress={st.progress} status={st.status} />
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col gap-1.5 items-start">
 <div className="flex items-center gap-2 whitespace-nowrap">
 <span className={twMerge("font-mono text-xs font-black px-2.5 py-1 rounded-lg border shadow-2xs whitespace-nowrap shrink-0", st.average_score >= 80 ? "text-[#047857] bg-emerald-50 border-emerald-200" : (st.average_score !== null ? "text-amber-700 bg-amber-50 border-amber-200" : "text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]"))}>
 {st.average_score !== null ? `${st.average_score}/100` : "Chưa có"}
 </span>
 <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#3B82F6] border-[#E2E8F0] text-[10px] font-black font-mono whitespace-nowrap shrink-0">
 {st.total_credits ? `${st.total_credits} tín` : "0 tín"}
 </span>
 </div>

 {/* Quiz Breakdown Tooltip / List */}
 {Array.isArray(st.quiz_scores) && st.quiz_scores.length > 0 && (
 <div className="flex flex-col gap-1 mt-0.5 w-full">
 {st.quiz_scores.map((q: any) => (
 <div key={q.quiz_id} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B] whitespace-nowrap">
 <span className="truncate max-w-[130px] shrink-1" title={q.title}>{q.title}:</span>
 <span className="font-mono font-bold text-[#0F172A] shrink-0">{q.score}/100</span>
 <span className={`px-1.5 py-0.5 rounded font-black text-[9px] whitespace-nowrap shrink-0 ${q.type === 'capability_assessment' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
 {q.credits} tín
 </span>
 </div>
 ))}
 </div>
 )}
 </div>
 </td>
 <td className="px-4 py-4 text-xs font-bold text-[#64748B] whitespace-nowrap">
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
 <div className="p-4 px-6 bg-[#F8FAFC]/60 border-t border-gray-100 flex items-center justify-between">
 <span className="text-xs font-bold text-[#64748B]">
 Hiển thị trang <strong className="text-[#0F172A] font-extrabold">{data.meta.current_page}</strong> trên <strong className="text-[#0F172A] font-extrabold">{data.meta.last_page}</strong> ({data.meta.total} học viên khớp)
 </span>
 <div className="flex items-center gap-1.5">
 <button
 type="button"
 onClick={() => setPage(Math.max(1, page - 1))}
 disabled={page === 1}
 className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
 >
 <ChevronLeftIcon size={16} />
 </button>
 <button
 type="button"
 onClick={() => setPage(Math.min(data.meta.last_page, page + 1))}
 disabled={page >= data.meta.last_page}
 className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
 >
 <ChevronRightIcon size={16} />
 </button>
 </div>
 </div>
 )}
 </div>
 <StudentDetailSidebar student={selectedStudent} onClose={() => setSelectedStudent(null)} />
 </div>
 );
}