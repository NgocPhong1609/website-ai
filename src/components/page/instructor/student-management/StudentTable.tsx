"use client";

// ─── StudentTable ──────────────────────────────────────────────────────────────
// Bảng danh sách học viên với avatar, khóa học, tiến độ và ngày tham gia.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { id: "s1",  name: "An Nguyễn",    email: "an.nguyen@example.com",    avatarInitials: "AN", avatarColor: "from-violet-400 to-purple-600",  course: "AI Foundations",     progress: 89, status: "completed",   joinDate: "12/10/2023" },
  { id: "s2",  name: "Minh Trần",    email: "minh.tran@gmail.com",       avatarInitials: "TM", avatarColor: "from-teal-400 to-emerald-600",   course: "Data Science AI",    progress: 42, status: "in-progress", joinDate: "05/11/2023" },
  { id: "s3",  name: "Linh Hoàng",   email: "linh.h@web.vn",             avatarInitials: "HL", avatarColor: "from-rose-400 to-pink-600",      course: "AI Foundations",     progress: 95, status: "completed",   joinDate: "15/09/2023" },
  { id: "s4",  name: "Bảo Lê",       email: "bao.le@company.com",        avatarInitials: "BL", avatarColor: "from-amber-400 to-orange-600",   course: "Prompt Engineering", progress: 12, status: "at-risk",     joinDate: "01/12/2023" },
  { id: "s5",  name: "Hà Phạm",      email: "ha.pham@email.vn",          avatarInitials: "HP", avatarColor: "from-sky-400 to-blue-600",       course: "AI Foundations",     progress: 67, status: "in-progress", joinDate: "20/10/2023" },
  { id: "s6",  name: "Duy Ngô",      email: "duy.ngo@dev.io",            avatarInitials: "DN", avatarColor: "from-indigo-400 to-violet-600",  course: "Data Science AI",    progress: 78, status: "in-progress", joinDate: "08/11/2023" },
  { id: "s7",  name: "Trang Vũ",     email: "trang.vu@studio.vn",        avatarInitials: "TV", avatarColor: "from-fuchsia-400 to-pink-600",   course: "Prompt Engineering", progress: 100,status: "completed",   joinDate: "30/09/2023" },
  { id: "s8",  name: "Khoa Đặng",    email: "khoa.dang@mail.com",        avatarInitials: "KD", avatarColor: "from-lime-400 to-green-600",     course: "AI Foundations",     progress: 55, status: "in-progress", joinDate: "14/11/2023" },
  { id: "s9",  name: "Mai Đinh",     email: "mai.dinh@uni.edu",          avatarInitials: "MD", avatarColor: "from-cyan-400 to-teal-600",      course: "Data Science AI",    progress: 31, status: "at-risk",     joinDate: "22/10/2023" },
  { id: "s10", name: "Phúc Bùi",     email: "phuc.bui@startup.io",       avatarInitials: "PB", avatarColor: "from-red-400 to-rose-600",       course: "Prompt Engineering", progress: 84, status: "in-progress", joinDate: "03/12/2023" },
];

const TOTAL = 2482;
const PAGE_SIZE = 10;

// ─── Progress Badge ────────────────────────────────────────────────────────────

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus }) {
  const colorMap: Record<ProgressStatus, { bar: string; text: string; label: string }> = {
    completed:   { bar: "bg-[#6B6BFF]",   text: "text-[#4648D4]",  label: "Hoàn thành" },
    "in-progress": { bar: "bg-blue-400",  text: "text-blue-600",   label: "Đang học"   },
    "at-risk":   { bar: "bg-rose-400",    text: "text-rose-600",   label: "Nguy cơ"    },
  };
  const { bar, text, label } = colorMap[status];
  return (
    <div className="flex flex-col gap-1 min-w-[72px]">
      <div className="flex items-center justify-between">
        <span className={twMerge("text-[10px] font-bold", text)}>{progress}%</span>
        <span className={twMerge("text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none", 
          status === "completed"   ? "bg-[#EEF0FF] text-[#4648D4]" :
          status === "in-progress" ? "bg-blue-50 text-blue-600" :
          "bg-rose-50 text-rose-600"
        )}>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#F0F0F8] overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge(
      "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm",
      color,
    )}>
      {initials}
    </div>
  );
}

// ─── Table Header ─────────────────────────────────────────────────────────────

const COLS = ["Học viên", "Khóa học", "Tiến độ", "Ngày tham gia"];

function TableHeader() {
  return (
    <thead>
      <tr className="border-b border-[#F0F0F8]">
        {COLS.map((col) => (
          <th key={col} className="px-4 py-3 text-left text-[11px] font-bold text-[#9090B0] tracking-wide uppercase whitespace-nowrap">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function StudentRow({ student }: { student: Student }) {
  return (
    <tr className="group hover:bg-[#FAFAFE] transition-colors duration-100 border-b border-[#F4F4FA] last:border-0">
      {/* Student info */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={student.avatarInitials} color={student.avatarColor} />
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-[#1A1A2E] truncate">{student.name}</span>
            <span className="text-[11px] text-[#9090B0] truncate">{student.email}</span>
          </div>
        </div>
      </td>

      {/* Course */}
      <td className="px-4 py-3">
        <span className="text-[12px] text-[#464554] font-medium whitespace-nowrap">{student.course}</span>
      </td>

      {/* Progress */}
      <td className="px-4 py-3 min-w-[120px]">
        <ProgressBadge progress={student.progress} status={student.status} />
      </td>

      {/* Join date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[12px] text-[#64647A]">{student.joinDate}</span>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, onPage }: { page: number; onPage: (p: number) => void }) {
  const from = (page - 1) * PAGE_SIZE + 1;
  const to   = Math.min(page * PAGE_SIZE, TOTAL);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0F8]">
      <span className="text-[12px] text-[#9090B0]">
        Hiển thị {from}–{to} trong{" "}
        <span className="font-semibold text-[#464554]">{TOTAL.toLocaleString("vi-VN")}</span> học viên
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
        >
          <ChevronLeftIcon size={14} />
        </button>
        <button
          type="button"
          aria-label="Trang sau"
          onClick={() => onPage(page + 1)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Filter Dropdowns ─────────────────────────────────────────────────────────

function FilterDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#EAEAF4] bg-white cursor-pointer hover:border-[#C5C6FF] transition-all duration-150 group">
      <span className="text-[11px] font-semibold text-[#9090B0] uppercase tracking-wide">{label}:</span>
      <span className="text-[12px] font-semibold text-[#1A1A2E]">{value}</span>
      <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="text-[#9090B0] group-hover:text-[#4648D4] transition-colors" aria-hidden>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─── Main Table Component ─────────────────────────────────────────────────────

export function StudentTable() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-[#9090B0]" aria-hidden>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span className="text-[12px] font-semibold text-[#9090B0] mr-1">Bộ lọc:</span>
        <FilterDropdown label="" value="Tất cả khóa học" />
        <FilterDropdown label="" value="Hoạt động gần đây" />
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Table header row (above table) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F8]">
          <span className="text-[13px] font-bold text-[#1A1A2E]">Danh sách học viên</span>
          <span className="px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[11px] font-bold text-[#4648D4]">
            {TOTAL.toLocaleString("vi-VN")} học viên
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader />
            <tbody>
              {STUDENTS.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={page} onPage={setPage} />
      </div>
    </div>
  );
}
