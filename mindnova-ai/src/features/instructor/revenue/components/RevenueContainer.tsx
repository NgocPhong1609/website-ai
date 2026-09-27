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
import { RevenueChart as UIRevenueChart } from "@/src/shared/components/ui";

function RevenueNavigationTabs({ active }: { active: "overview" | "report" | "history" }) {
 return (
 <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm w-fit">
 <Link
 href="/instructor/revenue"
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 active === "overview"
 ? "bg-blue-500 text-white shadow-sm"
 : "text-slate-500 hover:bg-gray-100 hover:text-slate-900"
 )}
 >
 <span> Tổng quan Doanh thu</span>
 </Link>

 <Link
 href="/instructor/revenue/sales-report"
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 active === "report"
 ? "bg-blue-500 text-white shadow-sm"
 : "text-slate-500 hover:bg-gray-100 hover:text-slate-900"
 )}
 >
 <span> Báo cáo Bán hàng</span>
 </Link>

 <Link
 href="/instructor/revenue/history"
 className={twMerge(
 "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
 active === "history"
 ? "bg-blue-500 text-white shadow-sm"
 : "text-slate-500 hover:bg-gray-100 hover:text-slate-900"
 )}
 >
 <span> Lịch sử Giao dịch</span>
 </Link>
 </div>
 );
}

function PageHeader({ onOpenWithdrawal }: { onOpenWithdrawal: () => void }) {
 return (
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý Doanh thu &amp; Tài chính</h1>
 <p className="text-xs text-slate-500 mt-1">
 Theo dõi số dư khả dụng, doanh thu bán khóa học và các khoản hoa hồng theo tỷ lệ chia sẻ của Giảng viên.
 </p>
 </div>
 <div className="flex items-center gap-2.5 flex-wrap">

 <button
 type="button"
 onClick={onOpenWithdrawal}
 className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-sm transition-all cursor-pointer"
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
 <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng Doanh Thu (Tháng này)</span>
 <span className="text-2xl font-bold text-slate-900 mt-2">{data.total_revenue.toLocaleString('vi-VN')}đ</span>
 <div className={twMerge("flex items-center gap-1.5 mt-3 text-xs font-semibold", data.revenue_growth >= 0 ? "text-slate-900" : "text-rose-600")}>
 <TrendUpIcon />
 <span>{data.revenue_growth >= 0 ? '+' : ''}{data.revenue_growth}% so với tháng trước</span>
 </div>
 </div>

 <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số Dư Khả Dụng Ngay</span>
 <span className="text-2xl font-bold text-blue-500 mt-2">{data.available_balance.toLocaleString('vi-VN')}đ</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-gray-400">
 <ClockIcon />
 <span>Đã qua hạn hoàn tiền 30 ngày</span>
 </div>
 </div>

 <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quỹ Bảo Lãnh (Escrow)</span>
 <span className="text-2xl font-bold text-amber-600 mt-2">{data.escrow_balance.toLocaleString('vi-VN')}đ</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-amber-700">
 <InfoCircleIcon />
 <span>Tạm giữ chờ cấn trừ đơn mới</span>
 </div>
 </div>

 <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tỷ Lệ Hoàn Tiền (Refund)</span>
 <span className="text-2xl font-bold text-slate-900 mt-2">{data.refund_rate}%</span>
 <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-900">
 <InfoCircleIcon />
 <span>Cực kỳ an toàn (Trung bình: 2.4%)</span>
 </div>
 </div>
 </div>
 );
}



function RevenueChart({ chartData }: { chartData: any[] }) {
 const formattedData = chartData.map((d: any, index: number) => {
 const isToday = index === chartData.length - 1;
 return {
 date: isToday ? "Hôm nay" : d.day,
 revenue: d.revenue || 0,
 };
 });

 return (
 <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col shadow-sm">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <div>
 <h3 className="text-base font-bold text-slate-900">Biểu Đồ Nguồn Thu &amp; Tỷ Lệ Chiết Khấu</h3>
 <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ phân chia tự động tùy thuộc vào nguồn ghi danh của học viên.</p>
 </div>
 
 <div className="flex items-center gap-2 flex-wrap">
 <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-500 border-slate-200 text-xs font-bold">
 Link Giới thiệu Giảng viên: 85% Thực nhận
 </span>
 <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 border border-slate-200 text-xs font-bold">
 Chợ Khóa học Chung: 70% Thực nhận
 </span>
 </div>
 </div>
 
 <div className="flex-1 min-h-[250px] relative mt-2 -mx-2 sm:-mx-4">
 {chartData.length === 0 ? (
 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
 <span className="text-sm font-bold text-slate-500">Chưa có dữ liệu doanh thu</span>
 <span className="text-xs font-medium text-gray-400 mt-1">Biểu đồ sẽ xuất hiện khi có phát sinh giao dịch</span>
 </div>
 ) : (
 <UIRevenueChart data={formattedData} height={250} />
 )}
 </div>
 </div>
 );
}

function RecentTransactions({ transactions }: { transactions: any[] }) {
 const getStatusStyle = (status: string, type: string) => {
 if (type === "withdrawal") return "text-blue-500 bg-blue-50";
 if (type === "refund") return "text-rose-700 bg-rose-50 border-rose-200";
 if (status === "escrow") return "text-amber-700 bg-amber-50 border-amber-200";
 if (status === "available" || status === "completed") return "text-[#047857] bg-emerald-50";
 return "text-gray-700 bg-slate-50 border-slate-200";
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
 <div className="bg-white rounded-lg border border-slate-200 flex flex-col shadow-sm overflow-hidden">
 <div className="flex items-center justify-between p-5 border-b border-gray-100">
 <h3 className="text-sm font-bold text-slate-900">Giao dịch mới cập nhật</h3>
 <Link href="/instructor/revenue/history" className="text-xs font-semibold text-blue-500 hover:underline">
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
 <div key={item.id} className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50/70 border border-gray-100 hover:border-slate-200 transition-all">
 <div>
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-semibold text-slate-900">{item.transaction_code}</span>
 </div>
 <p className="text-xs font-medium text-slate-500 mt-0.5">{item.description || item.type}</p>
 </div>
 <div className="text-right">
 <span className="block text-xs font-bold font-mono text-slate-900">
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

 <div className="p-3.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-slate-500">
 <span> Quỹ tạm giữ (Escrow) sẽ tự động cộng vào khả dụng sau 30 ngày.</span>
 </div>
 </div>
 );
}

export function RevenueContainer() {
 const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

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
 />

 {isLoading ? (
 <div className="flex flex-col items-center justify-center py-20 bg-blue-500">
 <></>
 <span className="text-sm font-semibold">Đang tải dữ liệu doanh thu...</span>
 </div>
 ) : error || !data ? (
 <div className="flex flex-col items-center justify-center py-20">
 <span className="text-4xl mb-3">️</span>
 <p className="text-sm font-semibold text-slate-500 mb-4">Lỗi khi tải dữ liệu. Vui lòng thử lại.</p>
 <button onClick={() => refetch()} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm">
 Tải lại trang
 </button>
 </div>
 ) : (
 <>
 <StatCards data={data} />


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
