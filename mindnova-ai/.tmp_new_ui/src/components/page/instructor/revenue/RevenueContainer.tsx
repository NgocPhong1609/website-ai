"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  WalletIcon,
  TrendUpIcon,
  ClockIcon,
  InfoCircleIcon,
  SparklesIcon,
} from "./icons";
import { WithdrawalModal } from "./WithdrawalModal";

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

function PageHeader({ onOpenWithdrawal, onToggleForecast }: { onOpenWithdrawal: () => void; onToggleForecast: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Quản lý Doanh thu &amp; Tài chính</h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi số dư khả dụng, doanh thu bán khóa học và các khoản hoa hồng theo tỷ lệ chia sẻ của Giảng viên.
        </p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onToggleForecast}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-xs font-extrabold text-[#4F46E5] bg-indigo-50/80 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs"
        >
          <SparklesIcon size={15} />
          <span>Dự báo Thu nhập AI</span>
        </button>
        <button
          type="button"
          onClick={onOpenWithdrawal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 shadow-sm transition-all cursor-pointer"
        >
          <WalletIcon />
          <span>Yêu cầu Rút tiền</span>
        </button>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Tổng Doanh Thu (Tháng này)</span>
        <span className="text-2xl font-black text-gray-900 mt-2">128,450,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-extrabold text-emerald-600">
          <TrendUpIcon />
          <span>+12.5% so với tháng trước</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Số Dư Khả Dụng Ngay</span>
        <span className="text-2xl font-black text-[#4F46E5] mt-2">42,180,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-400">
          <ClockIcon />
          <span>Đã qua hạn hoàn tiền 30 ngày</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Quỹ Bảo Lãnh (Escrow)</span>
        <span className="text-2xl font-black text-amber-600 mt-2">15,400,000đ</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-700">
          <InfoCircleIcon />
          <span>Tạm giữ chờ cấn trừ đơn mới</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Tỷ Lệ Hoàn Tiền (Refund)</span>
        <span className="text-2xl font-black text-gray-900 mt-2">0.8%</span>
        <div className="flex items-center gap-1.5 mt-3 text-xs font-extrabold text-emerald-600">
          <InfoCircleIcon />
          <span>Cực kỳ an toàn (Trung bình: 2.4%)</span>
        </div>
      </div>
    </div>
  );
}

function AIForecastSection({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm flex flex-col gap-5 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center text-xl font-black shadow-2xs">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900">Dự Báo &amp; Tối Ưu Hóa Thu Nhập AI</h3>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                AI Predictive Engine
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Phóng tác đà tăng trưởng thu nhập dựa trên số lượng ghi danh thực tế và lưu lượng từ liên kết giới thiệu.
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Đóng bảng dự báo" className="text-gray-400 hover:text-gray-700 font-black text-base p-1 cursor-pointer">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Thu Nhập Cuối Tháng Dự Kiến</span>
          <span className="text-xl font-black text-[#4F46E5] mt-1.5">184,500,000đ</span>
          <span className="text-xs font-semibold text-emerald-600 mt-1">▲ Dự kiến tăng trưởng +43% so với kỳ trước</span>
        </div>
        
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Khóa Học Đứng Đầu Chuyển Đổi</span>
          <span className="text-base font-black text-gray-900 truncate mt-1.5">AI Mastery for Business</span>
          <span className="text-xs font-semibold text-gray-500 mt-1">Chiếm 68% doanh số từ nguồn liên kết chia sẻ</span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-black text-indigo-900 uppercase flex items-center gap-1.5">
              <span>⚡ Đề xuất nhanh từ AI</span>
            </span>
            <p className="text-xs font-medium text-indigo-950 mt-1 leading-relaxed">
              Khóa &ldquo;Machine Learning Basics&rdquo; đang giảm nhẹ 14% lượt xem. Khuyến nghị tạo ngay mã giảm giá 20% hoặc đẩy link giới thiệu.
            </p>
          </div>
          <Link
            href="/instructor"
            className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold transition-all text-center shadow-2xs"
          >
            Tạo Mã Khuyến Mãi Ngay ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-gray-900">Biểu Đồ Nguồn Thu &amp; Tỷ Lệ Chiết Khấu</h3>
          <p className="text-xs text-gray-500 mt-0.5">Tỷ lệ phân chia tự động tùy thuộc vào nguồn ghi danh của học viên.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-bold">
            🚀 Link Giới thiệu Giảng viên: 85% Thực nhận
          </span>
          <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold">
            🛒 Chợ Khóa học Chung: 70% Thực nhận
          </span>
        </div>
      </div>
      
      {/* Visual Bar Chart Simulation */}
      <div className="flex-1 min-h-[200px] flex items-end justify-between gap-3 px-2 sm:px-6 pt-6 border-t border-gray-100 relative">
        {[35, 52, 90, 60, 68, 48, 85].map((h, i) => (
          <div key={i} className="relative flex flex-col items-center w-full max-w-[42px] group cursor-pointer">
            <div
              className={twMerge(
                "w-full rounded-xl transition-all duration-300",
                i === 2 || i === 6 ? "bg-[#4F46E5] shadow-sm" : "bg-gray-100 group-hover:bg-indigo-200"
              )}
              style={{ height: `${h * 2}px` }}
            />
            <span className={twMerge("mt-2.5 text-xs font-extrabold", i === 2 || i === 6 ? "text-[#4F46E5]" : "text-gray-400")}>
              {["T2", "T3", "Hnay", "T5", "T6", "T7", "CN"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const items = [
    { id: "TX-921", title: "Khóa AI Mastery", detail: "Link Giới thiệu Giảng viên (Hoa hồng 85%)", amount: "+2,550,000đ", status: "KHẢ DỤNG", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { id: "TX-918", title: "Khóa ML Basics", detail: "Chợ Khóa học Chung (Hoa hồng 70%)", amount: "+840,000đ", status: "ESCROW TẠM GIỮ", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { id: "TX-890", title: "Rút tiền về Ngân hàng", detail: "MB Bank - **** 1234", amount: "-15,000,000đ", status: "ĐÃ XỬ LÝ", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="text-sm font-black text-gray-900">Giao dịch mới cập nhật</h3>
        <Link href="/instructor/revenue/history" className="text-xs font-extrabold text-[#4F46E5] hover:underline">
          Xem tất cả ➔
        </Link>
      </div>

      <div className="flex flex-col p-4 gap-2.5 flex-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-gray-900">{item.title}</span>
                <span className="text-[11px] font-mono font-bold text-gray-400">({item.id})</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{item.detail}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs font-black font-mono text-gray-900">{item.amount}</span>
              <span className={twMerge("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 uppercase border", item.color)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
        <span>🔒 Quỹ tạm giữ (Escrow) sẽ tự động cộng vào khả dụng sau 30 ngày.</span>
      </div>
    </div>
  );
}

export function RevenueContainer() {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [showForecast, setShowForecast] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          
          {/* Top Tabs Navigation */}
          <RevenueNavigationTabs active="overview" />

          {/* Page Title & Actions */}
          <PageHeader
            onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
            onToggleForecast={() => setShowForecast((prev) => !prev)}
          />

          {/* KPI Stat Cards */}
          <StatCards />

          {/* AI Forecast Section */}
          {showForecast && <AIForecastSection onClose={() => setShowForecast(false)} />}
          
          {/* Charts & Transaction Table */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <RevenueChart />
            <RecentTransactions />
          </div>
        </div>
      </main>

      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
      />
    </div>
  );
}