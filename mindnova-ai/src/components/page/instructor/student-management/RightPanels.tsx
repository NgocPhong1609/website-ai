"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, TrendUpIcon, PlusIcon } from "./icons";

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
    avatarInitials: "NĐ",
    avatarColor: "bg-indigo-600",
    message: "\"Thưa thầy, làm sao để tối ưu hóa Prompt cho GPT-4 trong...\"",
    time: "1 phút trước",
  },
  {
    id: "d2",
    name: "Phương Vy",
    avatarInitials: "PV",
    avatarColor: "bg-teal-600",
    message: "\"Bài tập 3 chương 2 có lỗi logic ở phần thuật toán không ạ?\"",
    time: "2 giờ trước",
  },
  {
    id: "d3",
    name: "Khánh Hoàng",
    avatarInitials: "KH",
    avatarColor: "bg-purple-600",
    message: "\"Cảm ơn thầy và tài liệu bổ trợ hữu ích!\"",
    time: "Hôm qua",
  },
];

function DiscussionAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={twMerge("w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-2xs", color)}>
      <span>{initials}</span>
    </div>
  );
}

function DiscussionPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <span className="text-xs font-black text-gray-900 tracking-wider uppercase">
          Thảo luận mới nhất
        </span>
        <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black">
          3 CHƯA ĐỌC
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {DISCUSSIONS.map((d) => (
          <div key={d.id} className="flex items-start gap-3 p-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer">
            <DiscussionAvatar initials={d.avatarInitials} color={d.avatarColor} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-extrabold text-gray-900 truncate">{d.name}</span>
                <span className="text-[10px] text-gray-400 font-medium shrink-0">{d.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-0.5 italic">
                {d.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 border-t border-gray-100 text-center bg-gray-50/50">
        <Link href="/instructor/discussions" className="text-xs font-bold text-[#4F46E5] hover:underline block w-full">
          Xem tất cả thảo luận học viên ➔
        </Link>
      </div>
    </div>
  );
}

const QUICK_TAGS = ["Động viên học tập", "Nhắc lịch kiểm tra", "Cập nhật bài giảng mới"];

function AIAnnouncementPanel({ onOpenModal }: { onOpenModal: () => void }) {
  const [topic, setTopic] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-indigo-100 flex items-center gap-2 bg-indigo-50/50">
        <span className="text-[#4F46E5]"><SparklesIcon size={16} /></span>
        <span className="text-xs font-black text-[#4F46E5] tracking-wide uppercase">Trợ lý Thông báo AI</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          Soạn thảo và gửi thông báo khích lệ tự động tới toàn bộ cohort bằng sức mạnh AI MindNova.
        </p>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập ý chính hoặc chủ đề cần phát đi..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] resize-none shadow-2xs"
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={twMerge(
                "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer",
                activeTag === tag
                  ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                  : "border-gray-200 text-gray-600 bg-white hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              + {tag}
            </button>
          ))}
        </div>

        <button
          type="button"
          id="btn-ai-announcement"
          onClick={onOpenModal}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer mt-1"
        >
          <PlusIcon size={14} />
          <span>Tạo Thông Báo Bằng AI Ngay</span>
        </button>
      </div>
    </div>
  );
}

interface StatBarProps {
  label: string;
  value: string;
  percent: number;
  color: "blue" | "red" | "purple";
}

function StatBar({ label, value, percent, color }: StatBarProps) {
  const barColor = {
    blue: "bg-[#4F46E5]",
    red: "bg-rose-500",
    purple: "bg-indigo-400",
  }[color];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 font-bold">{label}</span>
        <span className={twMerge("text-xs font-black font-mono", color === "red" ? "text-rose-600" : "text-indigo-900")}>
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={twMerge("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ProgressStatsPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <span className="text-xs font-black text-gray-900 tracking-wider uppercase">
          Thống Kê Tổng Quan Khóa Học
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <StatBar label="Tỷ lệ hoàn thành trung bình" value="68%" percent={68} color="blue" />
        <StatBar label="Tỷ lệ rớt chứng chỉ dự kiến" value="4.2%" percent={4.2} color="red" />
        <StatBar label="Học viên tích cực (Tuần qua)" value="1,240" percent={75} color="purple" />

        <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 flex items-start gap-2.5">
          <span className="text-emerald-600 mt-0.5 shrink-0"><TrendUpIcon size={16} /></span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">Gợi ý Tối ưu AI</span>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Tỷ lệ thảo luận tăng 15%. Nên ưu tiên giải đáp các câu hỏi chưa đọc để duy trì tỷ lệ giữ chân học viên!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RightPanels({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <DiscussionPanel />
      <AIAnnouncementPanel onOpenModal={onOpenModal} />
      <ProgressStatsPanel />
    </div>
  );
}
