"use client";

import React, { useState } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "system" | "course" | "user";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Bảo trì hệ thống máy chủ AI",
    message: "Hệ thống sẽ bảo trì nhẹ từ 02:00 đến 03:00 sáng mai để nâng cấp GPU.",
    date: "Hôm nay, 14:30",
    type: "system",
  },
  {
    id: "2",
    title: "Khóa học mới chờ phê duyệt",
    message: "Giảng viên Minh Tâm vừa nộp bản thảo khóa học LangChain Mastery.",
    date: "Hôm qua, 09:15",
    type: "course",
  },
];

export function AdminNotificationsPage() {
  const [notifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Trung tâm Thông báo</h1>
          <p className="text-[14px] font-medium text-[#6B7280] mt-1">
            Gửi và quản lý thông báo tới toàn thể học viên và giảng viên
          </p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          + Tạo thông báo mới
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <h2 className="text-[16px] font-bold text-[#111827] mb-4">Lịch sử thông báo ({notifications.length})</h2>

        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Chưa có thông báo nào được phát hành.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.id} className="p-5 rounded-xl border border-gray-200 hover:border-[#4F46E5]/40 bg-gray-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      item.type === "system" 
                        ? "bg-amber-50 text-amber-700 border border-amber-200" 
                        : "bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100"
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="font-bold text-[15px] text-[#111827]">{item.title}</h3>
                  </div>
                  <p className="text-[13px] text-[#6B7280] font-medium">{item.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-medium text-gray-400">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
