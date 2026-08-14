"use client";

import React, { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { getStudents, exportStudentsCSV, getNotificationOptions } from "../api";
import { DownloadIcon } from "./icons"; // Import if needed for export button inside table header

export type ProgressStatus = "Hoàn tất" | "Đang học" | "Chưa bắt đầu" | "Nguy cơ trễ";

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus | string }) {
  let bar = "bg-gray-400";
  let text = "text-gray-600";
  let label = status;
  let bg = "bg-gray-50 border-gray-200";

  if (status === "Hoàn tất" || status === "completed") {
    bar = "bg-emerald-500"; text = "text-emerald-700"; bg = "bg-emerald-50 border-emerald-200"; label = "Hoàn tất";
  } else if (status === "Đang học" || status === "in-progress") {
    bar = "bg-[#4F46E5]"; text = "text-[#4F46E5]"; bg = "bg-indigo-50 border-indigo-200"; label = "Đang học";
  } else if (status === "Nguy cơ trễ" || status === "at-risk") {
    bar = "bg-rose-500"; text = "text-rose-600"; bg = "bg-rose-50 border-rose-200"; label = "Nguy cơ trễ";
  } else if (status === "Chưa bắt đầu") {
    bar = "bg-gray-400"; text = "text-gray-600"; bg = "bg-gray-50 border-gray-200"; label = "Chưa bắt đầu";
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
    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600 text-white text-xs font-black shrink-0 shadow-2xs">
      {initials}
    </div>
  );
}

const COLS = ["Hồ Sơ Học Viên", "Khóa Học Ghi Danh", "Tiến Độ & Trạng Thái", "Điểm Kiểm Tra", "Ngày Ghi Danh"];

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
          "w-full flex items-center justify-between px-3.5 py-2 rounded-xl border bg-white text-xs font-bold text-gray-900 cursor-pointer shadow-2xs transition-all",
          isOpen ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/15" : "border-gray-200 hover:border-indigo-300"
        )}
      >
        <span className="truncate">{selectedOption.name}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="14"
          height="14"
          className={twMerge("text-gray-500 transition-transform duration-200", isOpen && "rotate-180")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
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
                  ? "bg-indigo-50/70 text-[#4F46E5]"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <input
          id="search-student"
          type="search"
          placeholder="🔍 Tìm theo họ tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4F46E5] bg-gray-50/50"
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                {COLS.map((col) => (
                  <th key={col} className="px-6 py-3.5 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-[#4F46E5] rounded-full animate-spin"></div>
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
                  <tr key={st.enrollment_id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={st.name} avatarUrl={st.avatar_url} />
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 truncate">{st.name}</p>
                          <p className="text-[11px] font-medium text-gray-400 truncate">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 whitespace-nowrap">
                        {st.course.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge progress={st.progress} status={st.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={twMerge("font-mono text-xs font-black px-2.5 py-1 rounded-lg border", st.average_score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : (st.average_score !== null ? "text-amber-700 bg-amber-50 border-amber-200" : "text-gray-500 bg-gray-50 border-gray-200"))}>
                        {st.average_score !== null ? `${st.average_score}/100` : "Chưa có"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
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
          <div className="p-4 px-6 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Hiển thị trang <strong className="text-gray-900 font-extrabold">{data.meta.current_page}</strong> trên <strong className="text-gray-900 font-extrabold">{data.meta.last_page}</strong> ({data.meta.total} học viên khớp)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(data.meta.last_page, page + 1))}
                disabled={page >= data.meta.last_page}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}