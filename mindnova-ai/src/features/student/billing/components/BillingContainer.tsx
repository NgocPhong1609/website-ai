"use client";

import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { BillingFooter } from "./BillingFooter";
import { useGetBilling } from "../api";
import Link from "next/link";

export default function BillingContainer() {
 const { data, isLoading, isError, refetch } = useGetBilling();
 const orders = data?.orders ?? [];
 const latestPaid = orders.find((order) => order.status === "completed");
 const paidOrders = orders.filter((order) => order.status === "completed");
 const totalPaid = paidOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
 const amountLabel = `${totalPaid.toLocaleString("vi-VN")} VNĐ`;
 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
 
 {/* ─── Synchronized Universal Hero Banner matching /courses & /study-plan ─── */}
 <section className="relative overflow-hidden rounded-xl bg-white border border-[#e2e8f0] p-6 sm:p-7 transition-all duration-300 w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-4 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#e2e8f0] text-xs font-semibold text-[#2563eb] shadow-sm">
 Học phí &amp; Thanh toán
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
 Quản Lý &amp; <span className="text-[#2563eb] font-bold drop-shadow-2xs">Thanh Toán Trực Tuyến </span>
 </h1>

 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
 Xem lại các giao dịch mua khóa học, quản lý tài khoản nhận hoàn tiền và gửi yêu cầu hoàn tiền khi đủ điều kiện.
 </p>


 </div>

 {/* Universal Wide Mastery Card representing Active Subscription (No automatic renewal / gia hạn messaging) */}
 <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-xl p-5 sm:p-6 border border-[#e2e8f0] flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#e2e8f0] hover:-translate-y-0.5 transition-all duration-300">
 <div className="text-2xl sm:text-3xl font-bold text-slate-900 my-1 flex items-baseline justify-between gap-4">
 <div>
 <span className="text-[#2563eb] font-bold">{isLoading ? "..." : amountLabel}</span>
 <span className="text-xs font-medium text-slate-500 ml-1.5">đã thanh toán</span>
 </div>
 <span className="text-xs font-semibold text-slate-500">
 {paidOrders.length ? `${paidOrders.length} giao dịch` : "Chưa có giao dịch"}
 </span>
 </div>

 <p className="text-xs font-medium text-slate-500 mt-3.5 flex items-center justify-between gap-4 pt-3 border-t border-[#e2e8f0]">
 <span className="truncate">{latestPaid?.service ? `Gần nhất: ${latestPaid.service}` : "Bạn chưa mua khóa học nào."}</span>
 <Link href="/courses" className="text-[#2563eb] font-semibold hover:underline shrink-0">Khóa học của tôi</Link>
 </p>
 </div>
 </div>
 </section>

 {/* ─── Symmetrical 2-Column Grid for Payment Methods & Promo Code ─── */}
 {isError && (
 <p className="text-sm text-rose-600">Không thể tải thông tin thanh toán. <button type="button" className="underline" onClick={() => refetch()}>Thử lại</button></p>
 )}

 <PaymentMethodsCard />

 {/* ─── Transaction History Table ─── */}
 <TransactionHistoryTable orders={orders} isLoading={isLoading} />

 {/* ─── Security Footer ─── */}
 <BillingFooter />
 </div>
 );
}
