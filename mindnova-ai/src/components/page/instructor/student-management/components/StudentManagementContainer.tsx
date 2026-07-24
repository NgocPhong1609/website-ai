"use client";

// ─── StudentManagementContainer ────────────────────────────────────────────────
// Root container: topbar + page header + two-column layout (table | right panels).

import { useState } from "react";
import Link from "next/link";
import { StudentTable } from "./StudentTable";
import { RightPanels } from "./RightPanels";
import { AINotificationModal } from "./AINotificationModal";
import {
  SearchIcon,
  BellIcon,
  MessageIcon,
  DownloadIcon,
  SparklesIcon,
} from "./icons";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-6 bg-white border-b border-[#F0F0F8]">
      {/* Search */}
      <div className="relative flex-1 max-w-[360px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0C8] pointer-events-none">
          <SearchIcon size={14} />
        </span>
        <input
          id="student-search"
          type="search"
          placeholder="Tìm kiếm học viên, thảo luận..."
          className="w-full pl-9 pr-4 h-9 rounded-xl text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Thông báo" className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <BellIcon size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
        </button>
        <button type="button" aria-label="Tin nhắn" className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7878A0] hover:bg-[#F4F4FA] hover:text-[#4648D4] transition-all duration-150">
          <MessageIcon size={17} />
        </button>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2.5 pl-2 border-l border-[#EAEAF4]">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[12px] font-bold text-[#1A1A2E]">Dr. Alex Nguyen</span>
          <span className="text-[10px] text-[#9090B0]">Senior Instructor</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-[13px] font-bold shadow-[0_2px_8px_rgba(245,158,11,0.4)] cursor-pointer hover:shadow-[0_4px_14px_rgba(245,158,11,0.5)] transition-all duration-150">
          A
        </div>
      </div>
    </header>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-[24px] font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
          Quản lý học viên
        </h1>
        <p className="text-[13px] text-[#9090B0] mt-1">
          Theo dõi, hỗ trợ và tương tác với cộng đồng học viên MindNova AI.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Export */}
        <button
          type="button"
          id="btn-export-report"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DDDDF0] text-[13px] font-semibold text-[#464554] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
        >
          <DownloadIcon size={14} />
          Xuất báo cáo
        </button>

        {/* Notify */}
        <button
          type="button"
          id="btn-send-notification"
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <SparklesIcon size={13} />
          Gửi thông báo mới
        </button>
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

export function StudentManagementContainer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8FF]">
      <Topbar />

      {/* ── Page body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-6 py-6 flex flex-col gap-5">
          <PageHeader onOpenModal={() => setModalOpen(true)} />

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
            {/* Left: main content */}
            <div className="min-w-0">
              <StudentTable />
            </div>

            {/* Right: panels */}
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
