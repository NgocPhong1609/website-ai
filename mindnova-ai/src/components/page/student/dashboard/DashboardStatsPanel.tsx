"use client";

import React from "react";

export function DashboardStatsPanel() {
  const focusAreas = [
    { id: "1", topic: "React Server Actions & Mutation", accuracy: 68, action: "Ôn luyện", type: "review" },
    { id: "2", topic: "Redis Distributed Cache Invalidation", accuracy: 84, action: "Thực chiến", type: "practice" },
    { id: "3", topic: "RAG Embeddings & Vector Search", accuracy: 72, action: "Ôn luyện", type: "review" },
  ];

  const recentActivity = [
    {
      day: "Hôm nay",
      isToday: true,
      items: ["Hoàn tất bài kiểm tra Route Handlers (Đạt 90%)", "Trò chuyện với Gia sư AI về Server Actions"],
    },
    {
      day: "Hôm qua",
      isToday: false,
      items: ["Xem video: Kiến trúc App Router & Suspense", "Hoàn tất module 1 trong lộ trình Fullstack"],
    },
    {
      day: "3 ngày trước",
      isToday: false,
      items: ["Đăng ký khóa học Fullstack Development & AI"],
    },
  ];

  return (
    <aside className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6" aria-label="Dashboard stats panel">
      {/* Overall Progress Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest font-mono">
            Tiến Độ Lộ Trình Chung
          </span>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-mono">
            +4.2% tuần này
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-[#4F46E5] font-mono leading-none">
            72%
          </span>
          <span className="text-xs font-bold text-gray-500">Hoàn thành chứng chỉ</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden border border-gray-200/60">
          <div
            className="h-full rounded-full bg-[#4F46E5] transition-all duration-500"
            style={{ width: "72%" }}
          />
        </div>
      </div>

      {/* Study Streak Card */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-widest font-mono">
            Chuỗi Ngày Học Tích Cực
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-3xl font-black text-gray-900 font-mono leading-none">
            3 Ngày
          </span>
          <span className="text-2xl">🔥</span>
        </div>
        <p className="text-xs text-gray-600 font-semibold leading-relaxed">
          Phong độ học tập rất xuất sắc! Hãy hoàn thành thêm 1 bài giảng hôm nay để bảo vệ chuỗi điểm thưởng AI.
        </p>
      </div>

      {/* Focus Areas Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-1.5">
          <span>🎯</span>
          <span>Trọng Tâm Cần Ôn Luyện</span>
        </h4>
        <div className="flex flex-col gap-3.5">
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate mb-0.5">
                  {area.topic}
                </p>
                <p className={`text-[11px] font-extrabold font-mono ${area.type === "review" ? "text-amber-600" : "text-emerald-600"}`}>
                  Độ chính xác hiện tại: {area.accuracy}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = "/study-plan"}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs ${
                  area.type === "review"
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {area.action} ➔
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 font-mono flex items-center gap-1.5">
          <span>📜</span>
          <span>Lịch Sử Hoạt Động Gần Đây</span>
        </h4>
        <div className="flex flex-col gap-6">
          {recentActivity.map((group, idx) => (
            <div key={group.day} className="relative">
              {idx < recentActivity.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-[-22px] w-0.5 bg-gray-200" />
              )}
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm shrink-0 ${
                    group.isToday ? "bg-[#4F46E5] ring-2 ring-indigo-100" : "bg-gray-300"
                  }`}
                />
                <p className="text-xs font-black text-gray-900 font-mono">{group.day}</p>
              </div>
              <ul className="ml-[22px] flex flex-col gap-2.5">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
