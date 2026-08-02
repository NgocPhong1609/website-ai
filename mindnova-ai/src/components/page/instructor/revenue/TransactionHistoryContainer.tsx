"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  WalletIcon,
  SparklesIcon,
  BuildingBankIcon,
  TrendUpIcon,
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

function PageHeader() {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-black text-gray-900 tracking-tight">Lịch Sử Giao Dịch &amp; Đối Soát</h1>
      <p className="text-xs text-gray-500 mt-1">
        Kiểm soát dòng tiền chi tiết, các lệnh rút tiền hoa hồng và lịch sử bán khóa học theo thời gian thực.
      </p>
    </div>
  );
}

function Filters({ activeFilter, onSelect }: { activeFilter: string; onSelect: (val: string) => void }) {
  const tabs = [
    { id: "all", label: "Tất cả giao dịch" },
    { id: "in", label: "Tiền vào (Doanh thu)" },
    { id: "out", label: "Tiền ra (Rút tiền)" },
    { id: "pending", label: "Đang cấn trừ Escrow" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={twMerge(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
              activeFilter === tab.id
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white shadow-2xs">
        <CalendarIcon />
        <span>Tháng này</span>
        <ChevronDownIcon />
      </div>
    </div>
  );
}

function TransactionTable({ activeFilter }: { activeFilter: string }) {
  const allTransactions = [
    {
      type: "in",
      date: "24 Th05, 2026",
      time: "14:30 PM",
      id: "#TXN-90231",
      title: "Bán khóa học AI Mastery for Business",
      subtitle: "Học viên: Lê Văn An • Link Giới thiệu (85%)",
      icon: <BookOpenIcon size={16} />,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
      amount: "+2,550,000đ",
      amountStyle: "text-emerald-600 font-black",
    },
    {
      type: "out",
      date: "22 Th05, 2026",
      time: "09:15 AM",
      id: "#TXN-88142",
      title: "Yêu cầu rút tiền hoa hồng về Ngân hàng",
      subtitle: "MB Bank - **** 1234 • Chuyển khoản nhanh 24/7",
      icon: <WalletIcon size={16} />,
      iconColor: "text-purple-600 bg-purple-50 border-purple-100",
      status: "ĐANG XỬ LÝ",
      statusStyle: "text-indigo-700 bg-indigo-50 border-indigo-200",
      amount: "-15,000,000đ",
      amountStyle: "text-gray-900 font-bold",
    },
    {
      type: "pending",
      date: "20 Th05, 2026",
      time: "16:45 PM",
      id: "#TXN-87002",
      title: "Bán khóa học Machine Learning Basics",
      subtitle: "Học viên: Nguyễn Thị Mai • Đang tạm giữ Escrow 30 ngày",
      icon: <SparklesIcon size={16} />,
      iconColor: "text-amber-600 bg-amber-50 border-amber-100",
      status: "ESCROW TẠM GIỮ",
      statusStyle: "text-amber-700 bg-amber-50 border-amber-200",
      amount: "+840,000đ",
      amountStyle: "text-amber-600 font-extrabold",
    },
    {
      type: "in",
      date: "19 Th05, 2026",
      time: "11:00 AM",
      id: "#TXN-86551",
      title: "Bán khóa học Next.js 16 & Turbo Professional",
      subtitle: "Học viên: Trần Đức Thắng • Chợ khóa học (70%)",
      icon: <BookOpenIcon size={16} />,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      status: "THÀNH CÔNG",
      statusStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
      amount: "+1,850,000đ",
      amountStyle: "text-emerald-600 font-black",
    },
  ];

  const filtered = activeFilter === "all" ? allTransactions : allTransactions.filter(t => t.type === activeFilter);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5 w-[170px]">Thời Gian</th>
              <th className="px-6 py-3.5 w-[140px]">Mã Giao Dịch</th>
              <th className="px-6 py-3.5">Nội Dung Đối Soát</th>
              <th className="px-6 py-3.5 w-[150px]">Trạng Thái</th>
              <th className="px-6 py-3.5 text-right w-[150px]">Số Tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium">
            {filtered.length > 0 ? (
              filtered.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-900">{t.date}</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">{t.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold font-mono text-gray-600">{t.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", t.iconColor)}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-900">{t.title}</div>
                        <div className="text-[11px] font-semibold text-gray-500 mt-0.5">{t.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit border", t.statusStyle)}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={twMerge("font-mono text-sm", t.amountStyle)}>{t.amount}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">
                  Không tìm thấy giao dịch nào thuộc bộ lọc này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
        <span className="text-xs font-semibold text-gray-500">Hiển thị {filtered.length} trên tổng số {allTransactions.length} giao dịch gần đây</span>
        <div className="flex items-center gap-1">
          <button aria-label="Trang trước" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 cursor-not-allowed">
            <ChevronLeftIcon />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4F46E5] text-white font-extrabold text-xs shadow-2xs">1</button>
          <button aria-label="Trang sau" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 cursor-not-allowed">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
          <BuildingBankIcon size={22} />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-500 block uppercase">Số dư khả dụng</span>
          <span className="text-xl font-black text-gray-900 mt-0.5 block">42,180,000đ</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
          <TrendUpIcon size={22} />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-500 block uppercase">Thu nhập Tích lũy Tháng</span>
          <span className="text-xl font-black text-emerald-600 mt-0.5 block">128,450,000đ</span>
        </div>
      </div>

      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200 p-5 flex items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-sm font-black text-[#4F46E5] block">Yêu Cầu Rút Tiền Hoa Hồng</span>
          <span className="text-xs text-indigo-900/80 font-medium mt-0.5 block">Hệ thống thanh toán nhanh 24/7</span>
        </div>
        <Link
          href="/instructor/revenue"
          className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-sm transition-all shrink-0"
        >
          Rút Ngay ➔
        </Link>
      </div>
    </div>
  );
}

export function TransactionHistoryContainer() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
          <RevenueNavigationTabs active="history" />
          <PageHeader />
          <Filters activeFilter={activeFilter} onSelect={setActiveFilter} />
          <TransactionTable activeFilter={activeFilter} />
          <BottomCards />
        </div>
      </main>
    </div>
  );
}
