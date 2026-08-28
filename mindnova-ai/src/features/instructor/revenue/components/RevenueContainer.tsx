"use client";

import React, { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { getRevenueOverview } from "../api";
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

function PageHeader({ onOpenWithdrawal, onToggleForecast }: { onOpenWithdrawal: () => void; onToggleForecast: () => void }) {
 return (
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-black text-[#2C3039] tracking-tight">Quản lý Doanh thu &amp; Tài chính</h1>
 <p className="text-xs text-[#8A8478] mt-1">
 Theo dõi số dư khả dụng, doanh thu bán khóa học và các khoản hoa hồng theo tỷ lệ chia sẻ của Giảng viên.
 </p>
 </div>
 <div className="flex items-center gap-2.5 flex-wrap">
 <button
 type="button"
 onClick={onToggleForecast}
 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border -[#FAF7F2] text-xs font-extrabold text-[#C0392B] bg-indigo-50/80 hover:-[#FAF7F2] transition-all cursor-pointer shadow-2xs"
 >
 <SparklesIcon size={15} />
 <span>Dự báo Thu nhập AI</span>
 </button>
 <button
 type="button"
 onClick={onOpenWithdrawal}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#C0392B] hover:bg-[#4338CA] active:scale-95 shadow-sm transition-all cursor-pointer"
 >
 <WalletIcon />
 <span>Yêu cầu Rút tiền</span>
 </button>
 </div>
 </div>
 );
}

function StatCards({ data }: { data: any }) {
 return (
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-2xs flex flex-col justify-between">
 <span className="text-xs font-black text-[#8A8478] uppercase tracking-wide">Tổng Doanh Thu (Tháng này)</span>
 <span className="text-2xl font-black text-[#2C3039] mt-2">{data.total_revenue.toLocaleString('vi-VN')}đ</span>
 <div className={twMerge("flex items-center gap-1.5 mt-3 text-xs font-extrabold", data.revenue_growth >= 0 ? "-[#2C3039]" : "text-rose-600")}>
 <TrendUpIcon />
 <span>{data.revenue_growth >= 0 ? '+' : ''}{data.revenue_growth}% so với tháng trước</span>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-2xs flex flex-col justify-between">
 <span className="text-xs font-black text-[#8A8478] uppercase tracking-wide">Số Dư Khả Dụng Ngay</span>
 <span className="text-2xl font-black text-[#C0392B] mt-2">{data.available_balance.toLocaleString('vi-VN')}đ</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-400">
 <ClockIcon />
 <span>Đã qua hạn hoàn tiền 30 ngày</span>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-2xs flex flex-col justify-between">
 <span className="text-xs font-black text-[#8A8478] uppercase tracking-wide">Quỹ Bảo Lãnh (Escrow)</span>
 <span className="text-2xl font-black text-amber-600 mt-2">{data.escrow_balance.toLocaleString('vi-VN')}đ</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-700">
 <InfoCircleIcon />
 <span>Tạm giữ chờ cấn trừ đơn mới</span>
 </div>
 </div>

 <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-2xs flex flex-col justify-between">
 <span className="text-xs font-black text-[#8A8478] uppercase tracking-wide">Tỷ Lệ Hoàn Tiền (Refund)</span>
 <span className="text-2xl font-black text-[#2C3039] mt-2">{data.refund_rate}%</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-extrabold -[#2C3039]">
 <InfoCircleIcon />
 <span>Cực kỳ an toàn (Trung bình: 2.4%)</span>
 </div>
 </div>
 </div>
 );
}

function AIForecastSection({ onClose, forecast }: { onClose: () => void; forecast: any }) {
 return (
 <div className="p-6 rounded-2xl bg-white border -[#FAF7F2] shadow-sm flex flex-col gap-5 animate-fadeIn">
 <div className="flex items-center justify-between border-b -[#FAF7F2] pb-4">
 <div className="flex items-center gap-3">
 
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-black text-[#2C3039]">Dự Báo &amp; Tối Ưu Hóa Thu Nhập AI</h3>
 <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md -[#FAF7F2] -[#C0392B]">
 AI Predictive Engine
 </span>
 </div>
 <p className="text-xs text-[#8A8478] mt-0.5">
 Phóng tác đà tăng trưởng thu nhập dựa trên số lượng ghi danh thực tế và lưu lượng từ liên kết giới thiệu.
 </p>
 </div>
 </div>
 <button type="button" onClick={onClose} aria-label="Đóng bảng dự báo" className="text-gray-400 hover:text-gray-700 font-black text-base p-1 cursor-pointer">
 
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="p-4 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9] flex flex-col justify-between">
 <span className="text-xs font-bold text-[#8A8478] uppercase">Thu Nhập Cuối Tháng Dự Kiến</span>
 <span className="text-xl font-black text-[#C0392B] mt-1.5">{forecast?.expected_end_month?.toLocaleString('vi-VN')}đ</span>
 <span className="text-xs font-semibold -[#2C3039] mt-1">▲ Dự kiến tăng trưởng +{forecast?.growth_prediction}% so với kỳ trước</span>
 </div>
 
 <div className="p-4 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9] flex flex-col justify-between">
 <span className="text-xs font-bold text-[#8A8478] uppercase">Khóa Học Đứng Đầu Chuyển Đổi</span>
 <span className="text-base font-black text-[#2C3039] truncate mt-1.5">{forecast?.top_course}</span>
 <span className="text-xs font-semibold text-[#8A8478] mt-1">Chiếm {forecast?.top_course_percentage}% doanh số từ nguồn liên kết chia sẻ</span>
 </div>

 <div className="p-4 rounded-xl bg-indigo-50/60 border -[#FAF7F2] flex flex-col justify-between gap-3">
 <div>
 <span className="text-xs font-black -[#C0392B] uppercase flex items-center gap-1.5">
 <span> Đề xuất nhanh từ AI</span>
 </span>
 <p className="text-xs font-medium text-indigo-950 mt-1 leading-relaxed">
 Khóa &ldquo;Machine Learning Basics&rdquo; đang giảm nhẹ 14% lượt xem. Khuyến nghị tạo ngay mã giảm giá 20% hoặc đẩy link giới thiệu.
 </p>
 </div>
 <Link
 href="/instructor"
 className="px-4 py-2 rounded-xl bg-[#C0392B] hover:bg-[#4338CA] text-white text-xs font-extrabold transition-all text-center shadow-2xs"
 >
 Tạo Mã Khuyến Mãi Ngay 
 </Link>
 </div>
 </div>
 </div>
 );
}

function RevenueChart({ chartData }: { chartData: any[] }) {
 const maxVal = Math.max(...chartData.map(d => d.revenue), 1000); // minimum scale

 return (
 <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 flex flex-col shadow-2xs">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <div>
 <h3 className="text-base font-black text-[#2C3039]">Biểu Đồ Nguồn Thu &amp; Tỷ Lệ Chiết Khấu</h3>
 <p className="text-xs text-[#8A8478] mt-0.5">Tỷ lệ phân chia tự động tùy thuộc vào nguồn ghi danh của học viên.</p>
 </div>
 
 <div className="flex items-center gap-2 flex-wrap">
 <span className="px-3 py-1 rounded-xl bg-indigo-50 text-[#C0392B] border -[#FAF7F2] text-xs font-bold">
 Link Giới thiệu Giảng viên: 85% Thực nhận
 </span>
 <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 border border-[#E8E2D9] text-xs font-bold">
 Chợ Khóa học Chung: 70% Thực nhận
 </span>
 </div>
 </div>
 
 {/* Visual Bar Chart */}
 <div className="flex-1 min-h-[200px] flex items-end justify-between gap-3 px-2 sm:px-6 pt-6 border-t border-gray-100 relative">
 {chartData.length === 0 ? (
 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 py-8 mt-6">
 <span className="text-4xl mb-3 opacity-50 grayscale"></span>
 <span className="text-sm font-bold text-[#8A8478]">Chưa có dữ liệu doanh thu</span>
 <span className="text-xs font-medium text-gray-400 mt-1">Biểu đồ sẽ xuất hiện khi có phát sinh giao dịch</span>
 </div>
 ) : (
 chartData.map((d, i) => {
 const h = (d.revenue / maxVal) * 160; // Max height 160px
 const isToday = i === chartData.length - 1;
 return (
 <div key={i} className="relative flex flex-col items-center w-full max-w-[42px] group cursor-pointer">
 {/* Tooltip */}
 <div className="absolute bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 whitespace-nowrap bg-white border border-gray-100 shadow-xl rounded-xl p-2.5 pointer-events-none">
 <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{isToday ? "Hôm nay" : d.day}</p>
 <p className="text-xs font-black text-[#C0392B]">Doanh thu : {d.revenue.toLocaleString('vi-VN')}đ</p>
 </div>

 <div
 className={twMerge(
 "w-full rounded-xl transition-all duration-300 min-h-[4px]",
 isToday ? "bg-[#C0392B] shadow-sm" : "bg-gray-200 group-hover:-[#FAF7F2]"
 )}
 style={{ height: `${h}px` }}
 />
 <span className={twMerge("mt-2.5 text-xs font-extrabold", isToday ? "text-[#C0392B]" : "text-gray-400")}>
 {isToday ? "Hnay" : d.day}
 </span>
 </div>
 );
 })
 )}
 </div>
 </div>
 );
}

function RecentTransactions({ transactions }: { transactions: any[] }) {
 const getStatusStyle = (status: string, type: string) => {
 if (type === "withdrawal") return "-[#C0392B] bg-indigo-50 -[#FAF7F2]";
 if (type === "refund") return "text-rose-700 bg-rose-50 border-rose-200";
 if (status === "escrow") return "text-amber-700 bg-amber-50 border-amber-200";
 if (status === "available" || status === "completed") return "-[#2C3039] bg-emerald-50 -[#FAF7F2]";
 return "text-gray-700 bg-[#FEFCF9] border-[#E8E2D9]";
 };

 const getStatusText = (status: string, type: string) => {
 if (type === "withdrawal") return "ĐÃ RÚT TIỀN";
 if (type === "refund") return "HOÀN TIỀN";
 if (status === "escrow") return "ESCROW TẠM GIỮ";
 if (status === "available" || status === "completed") return "KHẢ DỤNG";
 return status.toUpperCase();
 };

 const getAmountPrefix = (type: string) => {
 return (type === 'withdrawal' || type === 'refund') ? '-' : '+';
 };

 return (
 <div className="bg-white rounded-2xl border border-[#E8E2D9] flex flex-col shadow-2xs overflow-hidden">
 <div className="flex items-center justify-between p-5 border-b border-gray-100">
 <h3 className="text-sm font-black text-[#2C3039]">Giao dịch mới cập nhật</h3>
 <Link href="/instructor/revenue/history" className="text-xs font-extrabold text-[#C0392B] hover:underline">
 Xem tất cả 
 </Link>
 </div>

 <div className="flex flex-col p-4 gap-2.5 flex-1">
 {transactions.length === 0 ? (
 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-8">
 <span className="text-2xl mb-2"></span>
 <span className="text-xs font-medium">Chưa có giao dịch nào</span>
 </div>
 ) : (
 transactions.map((item) => (
 <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#FEFCF9]/70 border border-gray-100 hover:border-[#E8E2D9] transition-all">
 <div>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-extrabold text-[#2C3039]">{item.transaction_code}</span>
 </div>
 <p className="text-xs font-medium text-[#8A8478] mt-0.5">{item.description || item.type}</p>
 </div>
 <div className="text-right">
 <span className="block text-xs font-black font-mono text-[#2C3039]">
 {getAmountPrefix(item.type)}{item.amount.toLocaleString('vi-VN')}đ
 </span>
 <span className={twMerge("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 border", getStatusStyle(item.status, item.type))}>
 {getStatusText(item.status, item.type)}
 </span>
 </div>
 </div>
 ))
 )}
 </div>

 <div className="p-3.5 bg-[#FEFCF9] border-t border-gray-100 flex items-center justify-between text-xs font-medium text-[#8A8478]">
 <span> Quỹ tạm giữ (Escrow) sẽ tự động cộng vào khả dụng sau 30 ngày.</span>
 </div>
 </div>
 );
}

export function RevenueContainer() {
 const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
 const [showForecast, setShowForecast] = useState(true);

 const { data, isLoading, error, refetch } = useQuery({
 queryKey: ["revenue-overview"],
 queryFn: getRevenueOverview,
 });

 return (
 <div className="flex flex-col min-h-screen bg-[#F4F4F8] font-sans">
 <main className="flex-1 overflow-y-auto">
 <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 pb-16">
 
 <RevenueNavigationTabs active="overview" />

 <PageHeader
 onOpenWithdrawal={() => setIsWithdrawalOpen(true)}
 onToggleForecast={() => setShowForecast((prev) => !prev)}
 />

 {isLoading ? (
 <div className="flex flex-col items-center justify-center py-20 -[#C0392B]">
 <></>
 <span className="text-sm font-semibold">Đang tải dữ liệu doanh thu...</span>
 </div>
 ) : error || !data ? (
 <div className="flex flex-col items-center justify-center py-20">
 <span className="text-4xl mb-3">️</span>
 <p className="text-sm font-semibold text-[#8A8478] mb-4">Lỗi khi tải dữ liệu. Vui lòng thử lại.</p>
 <button onClick={() => refetch()} className="px-4 py-2 bg-white border border-[#E8E2D9] rounded-lg text-sm font-bold shadow-sm">
 Tải lại trang
 </button>
 </div>
 ) : (
 <>
 <StatCards data={data} />

 {showForecast && <AIForecastSection forecast={data.ai_forecast} onClose={() => setShowForecast(false)} />}
 
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
 <RevenueChart chartData={data.chart_data} />
 <RecentTransactions transactions={data.recent_transactions} />
 </div>
 </>
 )}
 </div>
 </main>

 <WithdrawalModal
 isOpen={isWithdrawalOpen}
 onClose={() => setIsWithdrawalOpen(false)}
 availableBalance={data?.available_balance || 0}
 onSuccess={() => refetch()}
 />
 </div>
 );
}