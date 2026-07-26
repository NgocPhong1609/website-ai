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
  quizAverage: number; // e.g., 88 out of 100
  currentStudyNode: string;
}

const STUDENTS: Student[] = [
  { id: "s1", name: "An Nguyễn", email: "an.nguyen@example.com", avatarInitials: "AN", avatarColor: "from-violet-400 to-purple-600", course: "AI Foundations", progress: 89, status: "completed", joinDate: "12/10/2023", lastActive: "2 hours ago", quizAverage: 94, currentStudyNode: "Module 3: Enterprise Observability" },
  { id: "s2", name: "Minh Trần", email: "minh.tran@gmail.com", avatarInitials: "TM", avatarColor: "from-teal-400 to-emerald-600", course: "Data Science AI", progress: 42, status: "in-progress", joinDate: "05/11/2023", lastActive: "1 day ago", quizAverage: 78, currentStudyNode: "Module 2: Edge Caching" },
  { id: "s3", name: "Linh Hoàng", email: "linh.h@web.vn", avatarInitials: "HL", avatarColor: "from-rose-400 to-pink-600", course: "AI Foundations", progress: 95, status: "completed", joinDate: "15/09/2023", lastActive: "5 mins ago", quizAverage: 98, currentStudyNode: "Capstone Project" },
  { id: "s4", name: "Bảo Lê", email: "bao.le@company.com", avatarInitials: "BL", avatarColor: "from-amber-400 to-orange-600", course: "Prompt Engineering", progress: 12, status: "at-risk", joinDate: "01/12/2023", lastActive: "8 days ago", quizAverage: 52, currentStudyNode: "Module 1: Architecture Foundations" },
  { id: "s5", name: "Hà Phạm", email: "ha.pham@email.vn", avatarInitials: "HP", avatarColor: "from-sky-400 to-blue-600", course: "AI Foundations", progress: 67, status: "in-progress", joinDate: "20/10/2023", lastActive: "3 hours ago", quizAverage: 82, currentStudyNode: "Module 2: Edge Caching" },
  { id: "s6", name: "Duy Ngô", email: "duy.ngo@dev.io", avatarInitials: "DN", avatarColor: "from-indigo-400 to-violet-600", course: "Data Science AI", progress: 78, status: "in-progress", joinDate: "08/11/2023", lastActive: "4 hours ago", quizAverage: 85, currentStudyNode: "Module 3: Enterprise Observability" },
  { id: "s7", name: "Trang Vũ", email: "trang.vu@studio.vn", avatarInitials: "TV", avatarColor: "from-fuchsia-400 to-pink-600", course: "Prompt Engineering", progress: 100, status: "completed", joinDate: "30/09/2023", lastActive: "Yesterday", quizAverage: 91, currentStudyNode: "Completed" },
  { id: "s8", name: "Khoa Đặng", email: "khoa.dang@mail.com", avatarInitials: "KD", avatarColor: "from-lime-400 to-green-600", course: "AI Foundations", progress: 55, status: "in-progress", joinDate: "14/11/2023", lastActive: "6 hours ago", quizAverage: 74, currentStudyNode: "Module 2: Edge Caching" },
  { id: "s9", name: "Mai Đinh", email: "mai.dinh@uni.edu", avatarInitials: "MD", avatarColor: "from-cyan-400 to-teal-600", course: "Data Science AI", progress: 31, status: "at-risk", joinDate: "22/10/2023", lastActive: "14 days ago", quizAverage: 48, currentStudyNode: "Module 1: Architecture Foundations" },
  { id: "s10", name: "Phúc Bùi", email: "phuc.bui@startup.io", avatarInitials: "PB", avatarColor: "from-red-400 to-rose-600", course: "Prompt Engineering", progress: 84, status: "in-progress", joinDate: "03/12/2023", lastActive: "Just now", quizAverage: 89, currentStudyNode: "Module 3: Enterprise Observability" },
];

const COLS = ["Student Profile", "Enrolled Course", "Progress & Status", "Quiz Avg", "Last Active", "Current Study Milestone"];

function ProgressBadge({ progress, status }: { progress: number; status: ProgressStatus }) {
  const colorMap: Record<ProgressStatus, { bar: string; text: string; label: string }> = {
    completed: { bar: "bg-emerald-500", text: "text-emerald-700", label: "Completed" },
    "in-progress": { bar: "bg-[#6B6BFF]", text: "text-[#4648D4]", label: "Active" },
    "at-risk": { bar: "bg-rose-500", text: "text-rose-600", label: "At Risk" },
  };
  const { bar, text, label } = colorMap[status];

  return (
    <div className="flex flex-col gap-1 min-w-[86px]">
      <div className="flex items-center justify-between">
        <span className={twMerge("text-xs font-black", text)}>{progress}%</span>
        <span className={twMerge("text-[10px] font-extrabold px-2 py-0.5 rounded-full leading-none", status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : status === "in-progress" ? "bg-[#EEF0FF] text-[#4648D4]" : "bg-rose-50 text-rose-700 border border-rose-200")}>{label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-500", bar)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm", color)}>
      {initials}
    </div>
  );
}

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "ALL" || s.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Heatmap statistics computation
  const moduleDist = [
    { module: "Module 1: Foundations", count: 3, percentage: 30, color: "bg-indigo-400" },
    { module: "Module 2: Edge Caching", count: 4, percentage: 40, color: "bg-[#6B6BFF]" },
    { module: "Module 3: Enterprise", count: 3, percentage: 30, color: "bg-emerald-500" },
  ];

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Top Banner & Privacy Lock Guarantee (Section 3.1) */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAF4] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#1A1A2E] flex items-center gap-2">
            <span>👥 Enrolled Cohort Performance Tracking</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Evaluate aggregated engagement and individual diagnostic progress across active enrollments.
          </p>
        </div>

        {/* Strict Data Exemption Tag */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shrink-0">
          <span className="text-base">🔒</span>
          <span>Privacy Enforced: Sensitive passwords &amp; payment records excluded (Section 3.1 Rule)</span>
        </div>
      </div>

      {/* Cohort Heatmap Distribution (Section 3.1) */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-[#1A1A2E] via-[#24264A] to-[#141624] text-white border border-indigo-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>🔥 Cohort Study Heatmap &amp; Milestone Distribution</span>
            </h4>
            <p className="text-xs text-gray-300 mt-0.5">Visual concentration chart showing where the majority of your cohort is actively studying.</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/10 font-mono text-xs font-extrabold text-indigo-200 border border-white/10">
            Total Enrolled: 2,482 Students
          </span>
        </div>

        {/* Visual Bar Stack */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-7 rounded-2xl bg-white/10 overflow-hidden flex p-1 gap-1">
            {moduleDist.map((m) => (
              <div
                key={m.module}
                className={twMerge("h-full rounded-xl transition-all flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm truncate px-2", m.color)}
                style={{ width: `${m.percentage}%` }}
                title={`${m.module} (${m.percentage}%)`}
              >
                {m.module} ({m.percentage}%)
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-400 px-2">
            <span>Beginner Phase (30%)</span>
            <span>Intermediate Workshop (40%)</span>
            <span>Advanced Capstone &amp; Certification (30%)</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EAEAF4] shadow-2xs">
        <input
          type="text"
          placeholder="🔍 Search name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF]"
        />

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "AI Foundations", "Data Science AI", "Prompt Engineering"].map((crs) => (
            <button
              key={crs}
              type="button"
              onClick={() => {
                setFilterCourse(crs);
                setPage(1);
              }}
              className={twMerge(
                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer",
                filterCourse === crs ? "bg-[#6B6BFF] text-white shadow-sm" : "bg-[#F4F4FA] text-gray-600 hover:bg-gray-200"
              )}
            >
              {crs}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAEAF4] bg-[#FAF8FF]">
                {COLS.map((col) => (
                  <th key={col} className="px-5 py-4 text-[11px] font-black text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAF4]">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-bold text-gray-400">
                    No student records found matching your search filters.
                  </td>
                </tr>
              ) : (
                displayed.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FAF8FF] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={st.avatarInitials} color={st.avatarColor} />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1A1A2E] truncate">{st.name}</p>
                          <p className="text-xs font-medium text-gray-400 truncate">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 whitespace-nowrap">
                        {st.course}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ProgressBadge progress={st.progress} status={st.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={twMerge("font-mono text-sm font-black px-2.5 py-1 rounded-lg", st.quizAverage >= 80 ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50")}>
                        {st.quizAverage}/100
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-xs text-gray-500 whitespace-nowrap">
                      ⏱️ {st.lastActive}
                    </td>
                    <td className="px-5 py-4 text-xs font-black text-[#1A1A2E]">
                      📍 {st.currentStudyNode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 px-6 bg-[#FAF8FF] border-t border-[#EAEAF4] flex items-center justify-between">
          <span className="text-xs font-extrabold text-gray-500">
            Showing page <strong className="text-[#1A1A2E]">{page}</strong> of <strong>{totalPages}</strong> ({filtered.length} matching students)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 transition-all"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 transition-all"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
