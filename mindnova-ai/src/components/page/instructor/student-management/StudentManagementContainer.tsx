"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StudentTable } from "./StudentTable";
import { RightPanels } from "./RightPanels";
import { AINotificationModal } from "./AINotificationModal";
import { DownloadIcon, SparklesIcon } from "./icons";

function StudentNavigationTabs({ active }: { active: "students" | "analytics" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/students"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "students"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>👥 Danh sách &amp; Chăm sóc Học viên</span>
      </Link>

      <Link
        href="/instructor/analytics"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "analytics"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Phân tích Tương tác &amp; AI Insights</span>
      </Link>
    </div>
  );
}

function PageHeader({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
          Danh Sách &amp; Quản Trị Học Viên
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi tiến độ học tập, điểm trắc nghiệm và gửi thông báo khích lệ học viên trên hệ thống MindNova AI.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <button
          type="button"
          id="btn-export-report"
          onClick={() => alert("Đang tải xuống báo cáo danh sách học viên CSV...")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
        >
          <DownloadIcon size={14} />
          <span>Xuất Danh Sách CSV</span>
        </button>

        <button
          type="button"
          id="btn-send-notification"
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer"
        >
          <SparklesIcon size={14} />
          <span>Gửi Thông Báo AI</span>
        </button>
      </div>
    </div>
  );
}

export function StudentManagementContainer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <StudentNavigationTabs active="students" />
          <PageHeader onOpenModal={() => setModalOpen(true)} />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="min-w-0">
              <StudentTable />
            </div>

            <div className="flex flex-col gap-4">
              <RightPanels onOpenModal={() => setModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <AINotificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
