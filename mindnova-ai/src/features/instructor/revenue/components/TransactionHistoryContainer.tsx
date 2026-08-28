"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, getRevenueOverview } from "../api";
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
 <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E8E2D9] shadow-2xs w-fit">
 <Link
 href="/instructor/revenue"
 className={twMerge(
 "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
 active === "overview"
 ? "bg-[#C0392B] text-white shadow-sm"
 : "text-[#8A8478] hover:bg-gray-100 hover:text-[#2C3039]"
 )}
 >
 <span> Tổng quan Doanh thu</span>
 </Link>

 <Link
 href="/instructor/revenue/sales-report"
 className={twMerge(
 "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
 active === "report"
 ? "bg-[#C0392B] text-white shadow-sm"
 : "text-[#8A8478] hover:bg-gray-100 hover:text-[#2C3039]"
 )}
 >
 <span> Báo cáo Bán hàng</span>
 </Link>

 <Link
 href="/instructor/revenue/history"
 className={twMerge(
 "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
 active === "history"
 ? "bg-[#C0392B] text-white shadow-sm"
 : "text-[#8A8478] hover:bg-gray-100 hover:text-[#2C3039]"
 )}
 >
 <span> Lịch sử Giao dịch</span>
 </Link>
 </div>
 );
}

function PageHeader() {
 return (
 <div className="flex flex-col">
 <h1 className="text-xl font-black text-[#2C3039] tracking-tight">Lịch Sử Giao Dịch &amp; Đối Soát</h1>
 <p className="text-xs text-[#8A8478] mt-1">
 Kiểm soát dòng tiền chi tiết, các lệnh rút tiền hoa hồng và lịch sử bán khóa học theo thời gian thực.
 </p>
 </div>
 );
}

function Filters({ 
 activeFilter, onSelect, activeDateRange, onSelectDate, startDate, setStartDate, endDate, setEndDate 
}: { 
 activeFilter: string; onSelect: (val: string) => void; 
 activeDateRange: string; onSelectDate: (val: string) => void;
 startDate: string; setStartDate: (val: string) => void;
 endDate: string; setEndDate: (val: string) => void;
}) {
 const [isOpen, setIsOpen] = useState(false);
 
 const tabs = [
 { id: "all", label: "Tất cả giao dịch" },
 { id: "revenue", label: "Tiền vào (Doanh thu)" },
 { id: "withdrawal", label: "Tiền ra (Rút tiền)" },
 { id: "refund", label: "Hoàn tiền" },
 ];

 const dateOptions = [
 { id: "all", label: "Tất cả thời gian" },
 { id: "today", label: "Hôm nay" },
 { id: "week", label: "Tuần này" },
 { id: "month", label: "Tháng này" },
 { id: "last_month", label: "Tháng trước" },
 { id: "custom", label: "Tùy chỉnh..." },
 ];

 const activeLabel = dateOptions.find(o => o.id === activeDateRange)?.label || "Tất cả thời gian";

 return (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div className="flex items-center gap-1 bg-white border border-[#E8E2D9] rounded-xl p-1 shadow-2xs overflow-x-auto">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 type="button"
 onClick={() => onSelect(tab.id)}
 className={twMerge(
 "px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap",
 activeFilter === tab.id
 ? "bg-[#C0392B] text-white shadow-2xs"
 : "text-[#8A8478] hover:text-[#2C3039] hover:bg-[#FEFCF9]"
 )}
 >
 {tab.label}
 </button>
 ))}
 </div>
 
 <div className="flex items-center gap-2">
 {activeDateRange === "custom" && (
 <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
 <input 
 type="date" 
 value={startDate}
 onChange={(e) => setStartDate(e.target.value)}
 className="px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs font-bold text-gray-700 bg-white shadow-2xs outline-none focus:border-[#C0392B] transition-colors"
 />
 <span className="text-gray-400 font-bold text-xs">-</span>
 <input 
 type="date" 
 value={endDate}
 onChange={(e) => setEndDate(e.target.value)}
 className="px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs font-bold text-gray-700 bg-white shadow-2xs outline-none focus:border-[#C0392B] transition-colors"
 />
 </div>
 )}

 <div className="relative">
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8E2D9] text-xs font-bold text-gray-700 bg-white shadow-2xs hover:border-[#C0392B] transition-colors cursor-pointer min-w-[170px] justify-between"
 >
 <div className="flex items-center gap-2">
 <CalendarIcon />
 <span>{activeLabel}</span>
 </div>
 <ChevronDownIcon />
 </button>
 
 {isOpen && (
 <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#E8E2D9] rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
 {dateOptions.map((opt) => (
 <button
 key={opt.id}
 onClick={() => {
 onSelectDate(opt.id);
 if (opt.id !== 'custom') {
 setStartDate('');
 setEndDate('');
 }
 setIsOpen(false);
 }}
 className={twMerge(
 "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer",
 activeDateRange === opt.id 
 ? "bg-indigo-50 text-[#C0392B]" 
 : "text-[#8A8478] hover:bg-[#FEFCF9] hover:text-[#2C3039]"
 )}
 >
 {opt.label}
 </button>
 ))}
 </div>
 )}
 
 {isOpen && (
 <div 
 className="fixed inset-0 z-10"
 onClick={() => setIsOpen(false)}
 />
 )}
 </div>
 </div>
 </div>
 );
}

function TransactionTable({ 
 activeFilter, page, setPage, activeDateRange, startDate, endDate 
}: { 
 activeFilter: string, page: number, setPage: (p: number) => void, activeDateRange: string, startDate: string, endDate: string 
}) {
 const { data, isLoading, isError } = useQuery({
 queryKey: ["transactions", activeFilter, activeDateRange, startDate, endDate, page],
 queryFn: () => getTransactions({ 
 type: activeFilter === 'all' ? undefined : activeFilter, 
 page, 
 date_range: activeDateRange,
 start_date: startDate,
 end_date: endDate
 }),
 staleTime: 5000,
 });

 const getIcon = (type: string) => {
 if (type === 'revenue') return <BookOpenIcon size={16} />;
 if (type === 'withdrawal') return <WalletIcon size={16} />;
 return <SparklesIcon size={16} />;
 };

 const getIconColor = (type: string) => {
 if (type === 'revenue') return "-[#2C3039] bg-emerald-50 -[#FAF7F2]";
 if (type === 'withdrawal') return "-[#C0392B] bg-purple-50 -[#FAF7F2]";
 return "text-amber-600 bg-amber-50 border-amber-100";
 };

 const getStatusStyle = (status: string) => {
 if (status === 'available' || status === 'completed') return "-[#2C3039] bg-emerald-50 -[#FAF7F2]";
 if (status === 'processing') return "-[#C0392B] bg-indigo-50 -[#FAF7F2]";
 if (status === 'escrow') return "text-amber-700 bg-amber-50 border-amber-200";
 return "text-gray-700 bg-[#FEFCF9] border-[#E8E2D9]";
 };

 const getStatusText = (status: string) => {
 if (status === 'available') return "SẴN SÀNG";
 if (status === 'completed') return "THÀNH CÔNG";
 if (status === 'processing') return "ĐANG XỬ LÝ";
 if (status === 'escrow') return "ESCROW TẠM GIỮ";
 return status.toUpperCase();
 };

 const formatAmount = (amount: number, type: string) => {
 const sign = type === 'withdrawal' || type === 'refund' ? '-' : '+';
 const color = type === 'withdrawal' || type === 'refund' ? 'text-[#2C3039] font-bold' : '-[#2C3039] font-black';
 return {
 text: `${sign}${amount.toLocaleString('vi-VN')}đ`,
 color
 };
 };

 const formatDate = (isoString: string) => {
 const d = new Date(isoString);
 return {
 date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
 time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true })
 };
 };

 if (isLoading) {
 return (
 <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-2xs p-12 flex flex-col items-center justify-center">
 
 <p className="text-[#8A8478] font-bold text-sm">Đang tải lịch sử giao dịch...</p>
 </div>
 );
 }

 if (isError || !data) {
 return (
 <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-2xs p-12 flex flex-col items-center justify-center text-rose-500">
 <p className="font-bold">Đã có lỗi xảy ra khi tải dữ liệu giao dịch.</p>
 </div>
 );
 }

 const transactions = data.data || [];
 const meta = data;

 return (
 <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-2xs flex flex-col overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[750px]">
 <thead>
 <tr className="bg-[#FEFCF9]/70 border-b border-[#E8E2D9] text-[11px] font-black text-[#8A8478] uppercase tracking-wider">
 <th className="px-6 py-3.5 w-[170px]">Thời Gian</th>
 <th className="px-6 py-3.5 w-[140px]">Mã Giao Dịch</th>
 <th className="px-6 py-3.5">Nội Dung Đối Soát</th>
 <th className="px-6 py-3.5 w-[150px]">Trạng Thái</th>
 <th className="px-6 py-3.5 text-right w-[150px]">Số Tiền</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-xs font-medium">
 {transactions.length > 0 ? (
 transactions.map((t: any) => {
 const dt = formatDate(t.created_at);
 const am = formatAmount(t.amount, t.type);
 return (
 <tr key={t.id} className="hover:bg-[#FEFCF9]/80 transition-colors">
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className="font-extrabold text-[#2C3039]">{dt.date}</span>
 <span className="text-[11px] text-gray-400 mt-0.5">{dt.time}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="font-bold font-mono text-[#8A8478]">{t.transaction_code}</span>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className={twMerge("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", getIconColor(t.type))}>
 {getIcon(t.type)}
 </div>
 <div>
 <div className="font-extrabold text-[#2C3039]">{t.description}</div>
 <div className="text-[11px] font-semibold text-[#8A8478] mt-0.5">Phân loại: {t.type.toUpperCase()}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={twMerge("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase block w-fit border", getStatusStyle(t.status))}>
 {getStatusText(t.status)}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <span className={twMerge("font-mono text-sm", am.color)}>{am.text}</span>
 </td>
 </tr>
 );
 })
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

 <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-[#FEFCF9]/50">
 <span className="text-xs font-semibold text-[#8A8478]">Hiển thị {transactions.length} trên tổng số {meta.total} giao dịch</span>
 <div className="flex items-center gap-1">
 <button 
 onClick={() => setPage(page - 1)}
 disabled={page === 1}
 aria-label="Trang trước" 
 className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8E2D9] bg-white text-gray-400 disabled:opacity-50 hover:bg-[#FEFCF9] transition-colors cursor-pointer disabled:cursor-not-allowed">
 <ChevronLeftIcon />
 </button>
 <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#C0392B] text-white font-extrabold text-xs shadow-2xs">{page}</button>
 <button 
 onClick={() => setPage(page + 1)}
 disabled={page === meta.last_page || meta.last_page === 0}
 aria-label="Trang sau" 
 className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8E2D9] bg-white text-gray-400 disabled:opacity-50 hover:bg-[#FEFCF9] transition-colors cursor-pointer disabled:cursor-not-allowed">
 <ChevronRightIcon />
 </button>
 </div>
 </div>
 </div>
 );
}

function BottomCards() {
 const { data: overview } = useQuery({
 queryKey: ["revenue-overview"],
 queryFn: getRevenueOverview,
 staleTime: 60000, // 1 minute
 });

 return (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-2xs flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#C0392B] flex items-center justify-center shrink-0 border -[#FAF7F2]">
 <BuildingBankIcon size={22} />
 </div>
 <div>
 <span className="text-xs font-bold text-[#8A8478] block uppercase">Số dư khả dụng</span>
 <span className="text-xl font-black text-[#2C3039] mt-0.5 block">{overview ? overview.available_balance.toLocaleString('vi-VN') : '...'}đ</span>
 </div>
 </div>

 <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-2xs flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-emerald-50 -[#2C3039] flex items-center justify-center shrink-0 border -[#FAF7F2]">
 <TrendUpIcon size={22} />
 </div>
 <div>
 <span className="text-xs font-bold text-[#8A8478] block uppercase">Thu nhập Tích lũy Tháng</span>
 <span className="text-xl font-black -[#2C3039] mt-0.5 block">{overview ? overview.total_revenue.toLocaleString('vi-VN') : '...'}đ</span>
 </div>
 </div>

 <div className="bg-indigo-50/50 rounded-2xl border -[#FAF7F2] p-5 flex items-center justify-between gap-3 shadow-2xs">
 <div>
 <span className="text-sm font-black text-[#C0392B] block">Yêu Cầu Rút Tiền Hoa Hồng</span>
 <span className="text-xs -[#C0392B]/80 font-medium mt-0.5 block">Hệ thống thanh toán nhanh 24/7</span>
 </div>
 <Link
 href="/instructor/revenue"
 className="px-5 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold shadow-sm transition-all shrink-0"
 >
 Rút Ngay 
 </Link>
 </div>
 </div>
 );
}

export function TransactionHistoryContainer() {
 const [activeFilter, setActiveFilter] = useState("all");
 const [activeDateRange, setActiveDateRange] = useState("all");
 const [startDate, setStartDate] = useState("");
 const [endDate, setEndDate] = useState("");
 const [page, setPage] = useState(1);

 const handleFilterChange = (val: string) => {
 setActiveFilter(val);
 setPage(1); // Reset page on filter change
 };

 const handleDateChange = (val: string) => {
 setActiveDateRange(val);
 setPage(1);
 };

 return (
 <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
 <main className="flex-1 overflow-y-auto">
 <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
 <RevenueNavigationTabs active="history" />
 <PageHeader />
 <Filters 
 activeFilter={activeFilter} 
 onSelect={handleFilterChange} 
 activeDateRange={activeDateRange}
 onSelectDate={handleDateChange}
 startDate={startDate}
 setStartDate={setStartDate}
 endDate={endDate}
 setEndDate={setEndDate}
 />
 <TransactionTable 
 activeFilter={activeFilter} 
 page={page} 
 setPage={setPage} 
 activeDateRange={activeDateRange}
 startDate={startDate}
 endDate={endDate}
 />
 <BottomCards />
 </div>
 </main>
 </div>
 );
}