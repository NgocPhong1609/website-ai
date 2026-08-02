"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export type ProgressStatus = "completed" | "in-progress" | "at-risk";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  course: string;
  progress: number;
  status: ProgressStatus;
  joinDate: string;
  lastActive: string;
  quizAverage: number;
  currentStudyNode: string;
}

const STUDENTS: Student[] = [
  { id: "s1", name: "An Nguyễn", email: "an.nguyen@example.com", avatarInitials: "AN", avatarColor: "bg-indigo-600", course: "AI Foundations", progress: 89, status: "completed", joinDate: "12/10/2026", lastActive: "2 giờ trước", quizAverage: 94, currentStudyNode: "Chuyên đề 3: Enterprise AI" },
  { id: "s2", name: "Minh Trần", email: "minh.tran@gmail.com", avatarInitials: "MT", avatarColor: "bg-teal-600", course: "Data Science AI", progress: 42, status: "in-progress", joinDate: "05/11/2026", lastActive: "1 ngày trước", quizAverage: 78, currentStudyNode: "Chuyên đề 2: Mô hình Hóa Dữ liệu" },
  { id: "s3", name: "Linh Hoàng", email: "linh.h@web.vn", avatarInitials: "LH", avatarColor: "bg-rose-600", course: "AI Foundations", progress: 95, status: "completed", joinDate: "15/09/2026", lastActive: "5 phút trước", quizAverage: 98, currentStudyNode: "Dự án tốt nghiệp Capstone" },
  { id: "s4", name: "Bảo Lê", email: "bao.le@company.com", avatarInitials: "BL", avatarColor: "bg-amber-600", course: "Prompt Engineering", progress: 12, status: "at-risk", joinDate: "01/12/2026", lastActive: "8 ngày trước", quizAverage: 52, currentStudyNode: "Chuyên đề 1: Kiến trúc Nền tảng" },
  { id: "s5", name: "Hà Phạm", email: "ha.pham@email.vn", avatarInitials: "HP", avatarColor: "bg-sky-600", course: "AI Foundations", progress: 67, status: "in-progress", joinDate: "20/10/2026", lastActive: "3 giờ trước", quizAverage: 82, currentStudyNode: "Chuyên đề 2: Tinh chỉnh LLM" },
  { id: "s6", name: "Duy Ngô", email: "duy.ngo@dev.io", avatarInitials: "DN", avatarColor: "bg-violet-600", course: "Data Science AI", progress: 78, status: "in-progress", joinDate: "08/11/2026", lastActive: "4 giờ trước", quizAverage: 85, currentStudyNode: "Chuyên đề 3: Trực quan hóa AI" },
  { id: "s7", name: "Trang Vũ", email: "trang.vu@studio.vn", avatarInitials: "TV", avatarColor: "bg-pink-600", course: "Prompt Engineering", progress: 100, status: "completed", joinDate: "30/09/2026", lastActive: "Hôm qua", quizAverage: 91, currentStudyNode: "Đã hoàn tất chứng chỉ" },
  { id: "s8", name: "Khoa Đặng", email: "khoa.dang@mail.com", avatarInitials: "KĐ", avatarColor: "bg-emerald-600", course: "AI Foundations", progress: 55, status: "in-progress", joinDate: "14/11/2026", lastActive: "6 giờ trước", quizAverage: 74, currentStudyNode: "Chuyên đề 2: Tinh chỉnh LLM" },
  { id: "s9", name: "Mai Đinh", email: "mai.dinh@uni.edu", avatarInitials: "MĐ", avatarColor: "bg-cyan-600", course: "Data Science AI", progress: 31, status: "at-risk", joinDate: "22/10/2026", lastActive: "14 ngày trước", quizAverage: 48, currentStudyNode: "Chuyên đề 1: Python Data Prep" },
  { id: "s10", name: "Phúc Bùi", email: "phuc.bui@startup.io", avatarInitials: "PB", avatarColor: "bg-red-600", course: "Prompt Engineering", progress: 84, status: "in-progress", joinDate: "03/12/2026", lastActive: "Vừa mới xong", quizAverage: 89, currentStudyNode: "Chuyên đề 3: Tự động hóa Agentic" },
];

const COLS = ["Hồ Sơ Học Viên", "Khóa Học Ghi Danh", "Tiến Độ & Trạng Thái", "Điểm Kiểm Tra", "Hoạt Động Gần Nhất", "Chuyên Đề Đang Theo"];

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus }) {
  const colorMap: Record<ProgressStatus, { bar: string; text: string; label: string }> = {
    completed: { bar: "bg-emerald-500", text: "text-emerald-700", label: "Hoàn tất" },
    "in-progress": { bar: "bg-[#4F46E5]", text: "text-[#4F46E5]", label: "Đang học" },
    "at-risk": { bar: "bg-rose-500", text: "text-rose-600", label: "Nguy cơ trễ" },
  };
  const { bar, text, label } = colorMap[status];

  return (
    <div className="flex flex-col gap-1.5 min-w-[95px]">
      <div className="flex items-center justify-between gap-2">
        <span className={twMerge("text-xs font-black font-mono", text)}>{progress}%</span>
        <span className={twMerge("text-[10px] font-extrabold px-2 py-0.5 rounded-md leading-none border", status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "in-progress" ? "bg-indigo-50 text-[#4F46E5] border-indigo-200" : "bg-rose-50 text-rose-700 border-rose-200")}>
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-2xs", color)}>
      {initials}
    </div>
  );
}

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("TẤT CẢ");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "TẤT CẢ" || s.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  const moduleDist = [
    { module: "Chuyên đề 1: Nền tảng Core AI", count: 3, percentage: 30, color: "bg-indigo-400" },
    { module: "Chuyên đề 2: Tinh chỉnh & RAG", count: 4, percentage: 40, color: "bg-[#4F46E5]" },
    { module: "Chuyên đề 3: Đồ án Thực tiễn", count: 3, percentage: 30, color: "bg-emerald-500" },
  ];

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn">
      {/* Top Banner & Privacy Guarantee */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span>👥 Quản Trị &amp; Theo Dõi Tiến Độ Tranh Đua Học Viên</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Phân tích tỷ lệ tương tác, tần suất nộp bài và hiệu suất hoàn thành chứng chỉ theo thời gian thực.
          </p>
        </div>

        {/* Strict Data Exemption Tag */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs font-extrabold shrink-0">
          <span className="text-base">🔒</span>
          <span>Bảo mật quyền riêng tư: Thông tin thanh toán &amp; mật khẩu được bảo vệ an toàn</span>
        </div>
      </div>

      {/* Cohort Heatmap Distribution */}
      <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>🔥 Bản Đồ Nhiệt Phân Bổ Tiến Độ Học Tập Trắc Nghiệm</span>
            </h4>
            <p className="text-xs text-indigo-100 mt-0.5">Biểu đồ tổng hợp cho thấy phần lớn học viên của bạn đang tích cực theo học ở chuyên đề nào.</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 font-mono text-xs font-black text-white border border-white/20 shrink-0">
            Tổng Sĩ Số: 2,482 Học Viên
          </span>
        </div>

        {/* Visual Bar Stack */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-8 rounded-xl bg-white/10 overflow-hidden flex p-1 gap-1 border border-white/10">
            {moduleDist.map((m) => (
              <div
                key={m.module}
                className={twMerge("h-full rounded-lg transition-all flex items-center justify-center font-black text-[11px] text-white shadow-2xs truncate px-2", m.color)}
                style={{ width: `${m.percentage}%` }}
              >
                {m.module} ({m.percentage}%)
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-100 px-1">
            <span>Giai đoạn Khởi tạo (30%)</span>
            <span>Thực hành Chuyên sâu (40%)</span>
            <span>Đồ án Tốt nghiệp Capstone (30%)</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <input
          id="search-student"
          type="search"
          placeholder="🔍 Tìm theo họ tên hoặc email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4F46E5] bg-gray-50/50"
        />

        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {["TẤT CẢ", "AI Foundations", "Data Science AI", "Prompt Engineering"].map((crs) => (
            <button
              key={crs}
              type="button"
              onClick={() => {
                setFilterCourse(crs);
                setPage(1);
              }}
              className={twMerge(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                filterCourse === crs ? "bg-[#4F46E5] text-white shadow-2xs font-extrabold" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              )}
            >
              {crs}
            </button>
          ))}
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
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-xs font-bold text-gray-400">
                    Không tìm thấy hồ sơ học viên nào khớp với tiêu chí lựa chọn của bạn.
                  </td>
                </tr>
              ) : (
                displayed.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={st.avatarInitials} color={st.avatarColor} />
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 truncate">{st.name}</p>
                          <p className="text-[11px] font-medium text-gray-400 truncate">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 whitespace-nowrap">
                        {st.course}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge progress={st.progress} status={st.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={twMerge("font-mono text-xs font-black px-2.5 py-1 rounded-lg border", st.quizAverage >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200")}>
                        {st.quizAverage}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-xs text-gray-500 whitespace-nowrap">
                      ⏱️ {st.lastActive}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-gray-800">
                      📍 {st.currentStudyNode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 px-6 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">
            Hiển thị trang <strong className="text-gray-900 font-extrabold">{page}</strong> trên <strong className="text-gray-900 font-extrabold">{totalPages}</strong> ({filtered.length} học viên khớp)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Trang trước"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <button
              type="button"
              aria-label="Trang sau"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
