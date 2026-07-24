"use client";

// ─── RightPanels ──────────────────────────────────────────────────────────────
// Right sidebar panels: Thảo luận mới + AI Announcement + Thống kê tiến độ.

import { twMerge } from "tailwind-merge";
import { SparklesIcon, TrendUpIcon, PlusIcon } from "./icons";
import { useState } from "react";

// ─── Discussion Panel ─────────────────────────────────────────────────────────

interface Discussion {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  message: string;
  time: string;
}

const DISCUSSIONS: Discussion[] = [
  {
    id: "d1",
    name: "Nam Đặng",
    avatarInitials: "ND",
    avatarColor: "from-violet-400 to-purple-600",
    message: "\"Thưa thầy, làm sao để tối ưu hóa Prompt cho GPT-4 trong...\"",
    time: "1 phút trước",
  },
  {
    id: "d2",
    name: "Phương Vy",
    avatarInitials: "PV",
    avatarColor: "from-sky-400 to-blue-600",
    message: "\"Bài tập 3 chương 2 có lỗi logic ở phần thuật toán không ạ?\"",
    time: "2 giờ trước",
  },
  {
    id: "d3",
    name: "Khánh Hoàng",
    avatarInitials: "KH",
    avatarColor: "bg-[#E0E0EC]",
    message: "\"Cảm ơn thầy và tài liệu bổ trợ hữu ích!\"",
    time: "Hôm qua",
  },
];

function DiscussionAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge(
      "w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm",
      color.startsWith("from-") ? `bg-gradient-to-br ${color}` : color,
    )}>
      <span className={color === "bg-[#E0E0EC]" ? "text-[#9090B0]" : ""}>{initials}</span>
    </div>
  );
}

function DiscussionPanel() {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F8]">
        <span className="text-[11px] font-extrabold text-[#1A1A2E] tracking-widest uppercase">
          Thảo luận mới
        </span>
        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
          3 CHƯA ĐỌC
        </span>
      </div>

      {/* Discussion items */}
      <div className="divide-y divide-[#F4F4FA]">
        {DISCUSSIONS.map((d) => (
          <div key={d.id} className="flex items-start gap-2.5 px-4 py-3 hover:bg-[#FAFAFE] transition-colors cursor-pointer">
            <DiscussionAvatar initials={d.avatarInitials} color={d.avatarColor} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12px] font-semibold text-[#1A1A2E] truncate">{d.name}</span>
                <span className="text-[10px] text-[#B0B0C8] shrink-0">{d.time}</span>
              </div>
              <p className="text-[11px] text-[#64647A] leading-relaxed line-clamp-2 mt-0.5 italic">
                {d.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#F0F0F8]">
        <button
          type="button"
          className="text-[12px] font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors w-full text-center hover:underline focus:outline-none"
        >
          Xem tất cả thảo luận
        </button>
      </div>
    </div>
  );
}

// ─── AI Announcement Panel ────────────────────────────────────────────────────

const QUICK_TAGS = ["Khởi học tập", "Nhắc lịch thi"];

function AIAnnouncementPanel({ onOpenModal }: { onOpenModal: () => void }) {
  const [topic, setTopic] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[#C5C6FF] bg-white shadow-[0_2px_10px_rgba(107,107,255,0.08)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#F0F0F8] flex items-center gap-2">
        <span className="animate-pulse text-[#6B6BFF]"><SparklesIcon size={14} /></span>
        <span className="text-[12px] font-bold text-[#6B6BFF] tracking-wide">AI Announcement</span>
        <span className="ml-auto text-[#D0D0E8]">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Description */}
        <p className="text-[11px] text-[#64647A] leading-relaxed">
          Soạn thông báo mạnh cho toàn bộ học viên bằng AI của MindNova.
        </p>

        {/* Input */}
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập chủ đề hoặc ý chính..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-[#EAEAF4] bg-[#FAFAFE] text-[12px] text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150 resize-none leading-relaxed"
        />

        {/* Quick tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={twMerge(
                "px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150 focus:outline-none",
                activeTag === tag
                  ? "bg-[#6B6BFF] text-white border-[#6B6BFF]"
                  : "border-[#EAEAF4] text-[#64647A] hover:border-[#C5C6FF] hover:text-[#4648D4]",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Update content link */}
        <button type="button" className="text-[11px] text-[#9090B0] hover:text-[#4648D4] transition-colors text-left font-medium">
          Cập nhật nội dung
        </button>

        {/* CTA */}
        <button
          type="button"
          id="btn-ai-announcement"
          onClick={onOpenModal}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          <PlusIcon size={12} />
          Tạo thông báo bằng AI
        </button>
      </div>
    </div>
  );
}

// ─── Progress Stats Panel ─────────────────────────────────────────────────────

interface StatBarProps {
  label: string;
  value: string;
  percent: number;
  color: "blue" | "red" | "purple";
}

function StatBar({ label, value, percent, color }: StatBarProps) {
  const barColor = {
    blue:   "bg-[#6B6BFF]",
    red:    "bg-red-400",
    purple: "bg-[#6B6BFF]",
  }[color];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#64647A] font-medium leading-snug">{label}</span>
        <span className={twMerge(
          "text-[13px] font-extrabold",
          color === "red" ? "text-red-500" : "text-[#4648D4]",
        )}>{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#F0F0F8] overflow-hidden">
        <div
          className={twMerge("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ProgressStatsPanel() {
  return (
    <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#F0F0F8]">
        <span className="text-[11px] font-extrabold text-[#1A1A2E] tracking-widest uppercase">
          Thống kê tiến độ
        </span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <StatBar
          label="Tỷ lệ hoàn thành trung bình"
          value="68%"
          percent={68}
          color="blue"
        />
        <StatBar
          label="Tỷ lệ rớt môn dự kiến"
          value="4.2%"
          percent={4.2}
          color="red"
        />
        <StatBar
          label="Học viên tích cực (Tuần qua)"
          value="1,240"
          percent={75}
          color="purple"
        />

        {/* AI tip */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-start gap-2">
          <span className="text-emerald-600 mt-0.5 shrink-0"><TrendUpIcon size={12} /></span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Gợi ý</span>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Tỷ lệ thảo luận tăng 15%. Nên phản hồi các câu hỏi chưa đọc sớm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function RightPanels({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <DiscussionPanel />
      <AIAnnouncementPanel onOpenModal={onOpenModal} />
      <ProgressStatsPanel />
    </div>
  );
}
