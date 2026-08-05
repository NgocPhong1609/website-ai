"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics, getEngagementChart } from "../api";
import { EngagementChart } from "./EngagementChart";

export function EngagementDashboard({ onSelectStudent }: { onSelectStudent: (id: string) => void }) {
  const [timeRange, setTimeRange] = useState(7);

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["engagement-chart", timeRange],
    queryFn: () => getEngagementChart({ days: timeRange })
  });

  const metrics = metricsData?.data || { total_learning_hours: 0, total_certificates: 0, new_students: [] };
  const chart = chartData?.data || [];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Section: Chart & Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-stretch">
        <div className="min-h-[300px] w-full">
          {chartLoading ? (
            <div className="w-full h-full bg-white rounded-2xl border border-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <EngagementChart data={chart} timeRange={timeRange} setTimeRange={setTimeRange} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col justify-center h-full shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-indigo-950 mb-1">
              {metricsLoading ? "..." : metrics.total_learning_hours} Giờ
            </h2>
            <p className="text-xs font-bold text-indigo-900/60 uppercase tracking-wider">Tổng Thời Gian Học Tập</p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-center h-full shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5-9-5-9 5-2-5" />
                <circle cx="12" cy="8" r="5" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-emerald-950 mb-1">
              {metricsLoading ? "..." : metrics.total_certificates} Chứng Chỉ
            </h2>
            <p className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider">Hoàn Thành Xuất Sắc</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: New Students List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">Danh Sách Học Viên Mới Gia Nhập</h3>
            <p className="text-xs text-gray-500 mt-1">Theo dõi hồ sơ và tiến độ chi tiết của học viên mới ghi danh trong 30 ngày qua.</p>
          </div>
          <button className="text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer">
            Xem Toàn Bộ Học Viên &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider w-1/3">Học viên ghi danh</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Trạng thái tương tác</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Khóa học gia nhập</th>
                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metricsLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">Đang tải dữ liệu...</td></tr>
              ) : metrics.new_students.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">Chưa có học viên mới nào trong 30 ngày qua</td></tr>
              ) : (
                metrics.new_students.map((st: any, index: number) => (
                  <tr key={`${st.id}-${index}`} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => onSelectStudent(st.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                          {st.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{st.name}</p>
                          <p className="text-xs text-gray-500">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {st.status === 'ĐANG HOẠT ĐỘNG' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                          ĐANG HOẠT ĐỘNG
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                          TẠM VẮNG MẶT
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-gray-700">{st.course_name}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-xs text-gray-500 font-medium">{st.enrolled_at}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
