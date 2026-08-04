"use client";

import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
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

function StatCards() {
  const stats = [
    { label: "Tổng Doanh Thu", val: "128,450,000đ", diff: "+12.5%", isUp: true, color: "bg-emerald-500", width: 82 },
    { label: "Doanh Thu Ròng", val: "115,200,000đ", diff: "+8.2%", isUp: true, color: "bg-[#4F46E5]", width: 75 },
    { label: "Hoàn Tiền (Refund)", val: "1,450,000đ", diff: "-2.1%", isUp: false, color: "bg-rose-500", width: 40 },
    { label: "Giá Trị Đơn Trung Bình", val: "1,850,000đ", diff: "+5.4%", isUp: true, color: "bg-indigo-400", width: 65 },
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

function RevenueVsRefundsChart() {
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
        {[45, 60, 30, 85, 90, 75, 95].map((h, idx) => (
          <div key={idx} className="flex flex-col items-center w-full max-w-[48px] group">
            <div className="w-full flex items-end justify-center gap-1">
              <div className="w-full rounded-t-lg bg-[#4F46E5] transition-all group-hover:opacity-85" style={{ height: `${h * 1.8}px` }} />
              <div className="w-1.5 rounded-t-lg bg-rose-400" style={{ height: `${Math.max(4, h * 0.15)}px` }} />
            </div>
            <span className="mt-2 text-xs font-extrabold text-gray-500">
              {["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5", "Tuần 6", "Nay"][idx]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketingSourcesTable() {
  const sources = [
    { name: "Facebook Ads", sub: "Quảng cáo mạng xã hội", initials: "FB", bg: "bg-blue-50 text-blue-700 border-blue-200", leads: "1,240", conv: "156", rate: 12.58, rev: "38,420,000đ", trend: "up" },
    { name: "Google Search", sub: "Tìm kiếm tự nhiên & SEO", initials: "GG", bg: "bg-rose-50 text-rose-700 border-rose-200", leads: "890", conv: "92", rate: 10.33, rev: "42,150,000đ", trend: "up" },
    { name: "Email Marketing", sub: "Bản tin học thuật hàng tuần", initials: "EM", bg: "bg-purple-50 text-purple-700 border-purple-200", leads: "2,100", conv: "48", rate: 2.28, rev: "16,280,000đ", trend: "flat" },
    { name: "Chương trình Tiếp thị (Referral)", sub: "Đối tác liên kết & Học viên cũ", initials: "RF", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", leads: "320", conv: "45", rate: 14.06, rev: "31,600,000đ", trend: "up" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-2">
        <div>
          <h3 className="text-sm font-black text-gray-900">Hiệu Năng Các Nênh Tảng Quảng Bá</h3>
          <p className="text-xs text-gray-500">Dữ liệu phân bổ lượt xem và tỷ lệ chốt đơn theo từng trang giới thiệu.</p>
        </div>
        <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
          ✨ AI Tracking 100% chính xác
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Nguồn Quảng Bá</th>
              <th className="px-6 py-3.5">Lượt Quan Tâm (Leads)</th>
              <th className="px-6 py-3.5">Ghi Danh Thành Công</th>
              <th className="px-6 py-3.5">Tỷ Lệ Chuyển Đổi</th>
              <th className="px-6 py-3.5">Doanh Thu Đưa Về</th>
              <th className="px-6 py-3.5 text-center">Xu Hướng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {sources.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border", s.bg)}>
                      {s.initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-900">{s.name}</div>
                      <div className="text-[11px] text-gray-500">{s.sub}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{s.leads}</td>
                <td className="px-6 py-4 font-extrabold text-indigo-900">{s.conv}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-gray-900 w-12">{s.rate}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${s.rate * 5}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-black font-mono text-gray-900">{s.rev}</td>
                <td className="px-6 py-4 text-center">
                  {s.trend === "up" ? (
                    <span className="text-emerald-600 inline-block">
                      <TrendUpIcon size={16} />
                    </span>
                  ) : (
                    <span className="text-gray-400 inline-block">
                      <TrendRightIcon size={16} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SalesReportContainer() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <RevenueNavigationTabs active="report" />
          <DatePickerHeader />
          <StatCards />
          <RevenueVsRefundsChart />
          <MarketingSourcesTable />
        </div>
      </main>
    </div>
  );
}