"use client";

import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../api";
import {
  CalendarIcon,
  DownloadIcon,
  TrendUpIcon,
  TrendRightIcon,
} from "./icons";

function RevenueNavigationTabs({ active }: { active: "overview" | "report" | "history" }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xs w-fit">
      <Link
        href="/instructor/revenue"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "overview"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📊 Tổng quan Doanh thu</span>
      </Link>

      <Link
        href="/instructor/revenue/sales-report"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "report"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📈 Báo cáo Bán hàng</span>
      </Link>

      <Link
        href="/instructor/revenue/history"
        className={twMerge(
          "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
          active === "history"
            ? "bg-[#4F46E5] text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <span>📜 Lịch sử Giao dịch</span>
      </Link>
    </div>
  );
}

function DatePickerHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Báo cáo Bán hàng &amp; Chuyển đổi</h1>
        <p className="text-xs text-gray-500 mt-1">
          Phân tích chi tiết lượt xem, doanh số thuần và tỷ lệ chuyển đổi học viên từ các nền tảng quảng bá.
        </p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-2xs">
          <CalendarIcon />
          <span>Tháng hiện tại</span>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
          <DownloadIcon />
          <span>Xuất CSV</span>
        </button>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-sm transition-all cursor-pointer">
          <DownloadIcon />
          <span>Xuất Báo cáo PDF</span>
        </button>
      </div>
    </div>
  );
}

function StatCards({ overview }: { overview: any }) {
  const getDiffText = (growth: number) => {
    if (growth > 0) return `+${growth}%`;
    if (growth < 0) return `${growth}%`;
    return "0%";
  };

  const getWidth = (growth: number) => {
    if (growth >= 100) return 100;
    if (growth <= -100) return 0;
    return 50 + (growth / 2); // Map -100..100 to 0..100
  };

  const stats = [
    { label: "Tổng Doanh Thu", val: `${overview?.total_sales.toLocaleString('vi-VN') || 0}đ`, diff: getDiffText(overview?.sales_growth || 0), isUp: (overview?.sales_growth || 0) >= 0, color: "bg-emerald-500", width: getWidth(overview?.sales_growth || 0) },
    { label: "Tổng Lượt Bán", val: `${overview?.total_enrollments || 0}`, diff: getDiffText(overview?.enrollments_growth || 0), isUp: (overview?.enrollments_growth || 0) >= 0, color: "bg-[#4F46E5]", width: getWidth(overview?.enrollments_growth || 0) },
    { label: "Tổng Lượt Xem", val: `${overview?.total_views || 0}`, diff: getDiffText(overview?.views_growth || 0), isUp: (overview?.views_growth || 0) >= 0, color: "bg-rose-500", width: getWidth(overview?.views_growth || 0) },
    { label: "Tỷ Lệ Chuyển Đổi TB", val: `${overview?.avg_conversion_rate || 0}%`, diff: getDiffText(overview?.conversion_growth || 0), isUp: (overview?.conversion_growth || 0) >= 0, color: "bg-indigo-400", width: getWidth(overview?.conversion_growth || 0) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{s.label}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-xl font-black text-gray-900 leading-tight">{s.val}</span>
            <span className={twMerge("text-xs font-black", s.isUp ? "text-emerald-600" : "text-rose-600")}>
              {s.diff}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className={twMerge("h-full rounded-full transition-all duration-500", s.color)} style={{ width: `${s.width}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueVsRefundsChart({ chartData }: { chartData: any[] }) {
  // Find max value to scale the chart bars dynamically
  const maxVal = Math.max(...(chartData || []).map((d) => d.revenue + d.refund), 1000); // at least 1000 to avoid dividing by zero

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-gray-900">Biểu Đồ Tương Quan Doanh Thu vs Hoàn Tiền</h3>
          <p className="text-xs text-gray-500 mt-0.5">Theo dõi luồng dòng tiền hàng ngày và tỷ lệ giữ chân học viên.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
            <span className="text-xs font-bold text-gray-700">Doanh thu bán mới</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-gray-700">Hoàn tiền</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="min-h-[220px] flex items-end justify-between gap-3 pt-4 border-t border-gray-100 px-2 sm:px-6">
        {(chartData || []).map((item, idx) => {
          // Scale to max height of ~160px
          const revHeight = (item.revenue / maxVal) * 160;
          const refHeight = (item.refund / maxVal) * 160;

          return (
            <div key={idx} className="flex flex-col items-center w-full max-w-[48px] group">
              <div className="w-full flex items-end justify-center gap-1">
                <div 
                  className="w-full rounded-t-lg bg-[#4F46E5] transition-all group-hover:opacity-85 relative" 
                  style={{ height: `${Math.max(4, revHeight)}px` }}
                  title={`Doanh thu: ${item.revenue.toLocaleString('vi-VN')}đ`}
                />
                <div 
                  className="w-1.5 rounded-t-lg bg-rose-400 relative" 
                  style={{ height: `${Math.max(4, refHeight)}px` }}
                  title={`Hoàn tiền: ${item.refund.toLocaleString('vi-VN')}đ`}
                />
              </div>
              <span className="mt-2 text-xs font-extrabold text-gray-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoursePerformanceTable({ courses }: { courses: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-2">
        <div>
          <h3 className="text-sm font-black text-gray-900">Hiệu Năng Từng Khóa Học</h3>
          <p className="text-xs text-gray-500">Dữ liệu phân bổ lượt xem và tỷ lệ chốt đơn theo từng khóa học của bạn.</p>
        </div>
        <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
          ✨ Cập nhật theo thời gian thực
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Khóa Học</th>
              <th className="px-6 py-3.5">Giá Bán</th>
              <th className="px-6 py-3.5">Lượt Xem (Views)</th>
              <th className="px-6 py-3.5">Ghi Danh (Enroll)</th>
              <th className="px-6 py-3.5">Tỷ Lệ Chuyển Đổi</th>
              <th className="px-6 py-3.5">Doanh Thu Tổng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {courses?.length > 0 ? courses.map((c, i) => (
              <tr key={c.course_id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-extrabold text-gray-900">{c.course_name}</div>
                      <div className="text-[11px] text-gray-500">ID: {c.course_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{c.price.toLocaleString('vi-VN')}đ</td>
                <td className="px-6 py-4 font-bold text-gray-700">{c.views}</td>
                <td className="px-6 py-4 font-extrabold text-indigo-900">{c.enrollments}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-gray-900 w-12">{c.conversion_rate}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${Math.min(100, c.conversion_rate * 5)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black font-mono text-emerald-600">{c.revenue.toLocaleString('vi-VN')}đ</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">
                  Chưa có dữ liệu bán hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SalesReportContainer() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales-report"],
    queryFn: getSalesReport,
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-[#4F46E5] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold text-sm">Đang tải báo cáo bán hàng...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans items-center justify-center">
        <p className="text-rose-500 font-bold">Đã có lỗi xảy ra khi tải dữ liệu báo cáo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <RevenueNavigationTabs active="report" />
          <DatePickerHeader />
          <StatCards overview={data.overview} />
          <RevenueVsRefundsChart chartData={data.chart_data} />
          <CoursePerformanceTable courses={data.courses} />
        </div>
      </main>
    </div>
  );
}