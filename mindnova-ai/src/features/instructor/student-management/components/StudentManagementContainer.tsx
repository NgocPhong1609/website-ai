"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StudentTable } from "./StudentTable";
import { RightPanels } from "./RightPanels";
import { AINotificationModal } from "./AINotificationModal";
import { exportStudentsCSV } from "../api";
import { Download, Sparkles, Loader2 } from "lucide-react";

function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm w-fit">
      <Link
        href="/instructor/students"
        className={twMerge(
          "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
          active === "students"
            ? "bg-blue-500 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        Danh sách &amp; Chăm sóc Học viên
      </Link>

      <Link
        href="/instructor/analytics"
        className={twMerge(
          "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
          active === "analytics"
            ? "bg-blue-500 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        Phân tích Tương tác &amp; AI Insights
      </Link>
    </div>
  );
}

function PageHeader({ onOpenModal, onExport }: { onOpenModal: () => void, onExport: () => void }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
          Danh Sách &amp; Quản Trị Học Viên
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tiến độ học tập, điểm trắc nghiệm và gửi thông báo khích lệ học viên trên hệ thống MindNova AI.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <button
          type="button"
          id="btn-export-report"
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <Download size={14} />
          )}
          <span>{isExporting ? "Đang xuất..." : "Xuất Danh Sách CSV"}</span>
        </button>

        <button
          type="button"
          id="btn-send-notification"
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles size={14} />
          <span>Gửi Thông Báo AI</span>
        </button>
      </div>
    </div>
  );
}

export function StudentManagementContainer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTopic, setInitialTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("TẤT CẢ");
  const [page, setPage] = useState(1);

  const handleExport = async () => {
    await exportStudentsCSV({
      search: searchTerm || undefined,
      course_id: filterCourse === "TẤT CẢ" ? undefined : filterCourse
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 py-6 flex flex-col gap-6 pb-16">
          <StudentNavigationTabs active="students" />
          <PageHeader onOpenModal={() => { setInitialTopic(""); setModalOpen(true); }} onExport={handleExport} />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="min-w-0">
              <StudentTable 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCourse={filterCourse}
                setFilterCourse={setFilterCourse}
                page={page}
                setPage={setPage}
              />
            </div>

            <div className="flex flex-col gap-4">
              <RightPanels onOpenModal={(t) => { setInitialTopic(t || ""); setModalOpen(true); }} courseId={filterCourse} />
            </div>
          </div>
        </div>
      </div>

      <AINotificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTopic={initialTopic} />
    </div>
  );
}