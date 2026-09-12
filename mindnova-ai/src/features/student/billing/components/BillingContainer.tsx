"use client";

import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { BillingFooter } from "./BillingFooter";
import { useGetBilling } from "../api";
import toast from "react-hot-toast";

export default function BillingContainer() {
 const { data, isLoading, isError, refetch } = useGetBilling();
 const orders = data?.orders ?? [];
 const latestPaid = orders.find((order) => order.status === "completed");
 const amountLabel = latestPaid
  ? `${Number(latestPaid.total_amount).toLocaleString("vi-VN")} VNĐ`
  : "0 VNĐ";
 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
 
 {/* ─── Synchronized Universal Hero Banner matching /courses & /study-plan ─── */}
 <section className="relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] p-6 sm:p-7 transition-all duration-300 w-full">
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-4 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#e2e8f0] text-xs font-semibold text-[#2563eb] shadow-sm">
 Quản Trị Học Phí &amp; Gói Học • Tự Động Hóa AI
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] leading-tight">
 Quản Lý &amp; <span className="text-[#2563eb] font-bold drop-shadow-2xs">Thanh Toán Trực Tuyến </span>
 </h1>

 <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed font-normal">
 Quản lý lịch sử giao dịch học phí, thiết lập phương thức thanh toán an toàn và theo dõi quyền lợi gói học AI Pro. Dữ liệu của bạn được mã hóa bảo mật chuẩn SSL 256-bit.
 </p>

 {/* Cleaned Action button - Removed invoice VAT info button */}
 <div className="flex flex-wrap items-center gap-3 pt-1">
 <button
 type="button"
 onClick={() => toast("Bạn đang trải nghiệm trọn vẹn quyền lợi cao cấp của gói MindNova Pro AI!")}
 className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563eb] transition-all duration-200 cursor-pointer focus:outline-none flex items-center gap-2"
 >
 <span> Nâng cấp Gói học Pro</span>
 <span></span>
 </button>
 </div>
 </div>

 {/* Universal Wide Mastery Card representing Active Subscription (No automatic renewal / gia hạn messaging) */}
 <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#e2e8f0] flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#e2e8f0] hover:-translate-y-0.5 transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-semibold text-[#64748b] group-hover:text-[#2563eb] transition-colors">Gói cước đang kích hoạt </span>
 <span className="text-[11px] font-semibold text-[#0f172a] bg-[#f8fafc] px-3 py-0.5 rounded-full border border-[#0f172a]">
 Đặc quyền VIP
 </span>
 </div>

 <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] my-1 flex items-baseline justify-between gap-4">
 <div>
 <span className="text-[#2563eb] font-bold">{isLoading ? "..." : amountLabel}</span>
 <span className="text-xs font-medium text-[#64748b] ml-1.5">gần nhất</span>
 </div>
 <span className="text-xs font-semibold text-[#64748b]">
 {latestPaid ? "Đã thanh toán" : "Chưa có giao dịch"}
 </span>
 </div>

 <div className="w-full h-2 bg-[#e2e8f0] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#e2e8f0]">
 <div
 className="h-full bg-[#2563eb] rounded-full shadow-[0_0_8px_rgba(59, 130, 246,0.4)] transition-all duration-1000 group-hover:brightness-110"
 style={{ width: "100%" }}
 />
 </div>

 <p className="text-xs font-semibold text-[#2563eb] mt-3.5 flex items-center justify-between gap-4">
 <span className="truncate"> Mở khóa toàn bộ tính năng AI</span>
 <span className="text-[#2563eb] font-semibold cursor-pointer hover:underline shrink-0">Chi tiết gói Pro </span>
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
