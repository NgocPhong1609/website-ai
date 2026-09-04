"use client";

import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { PromoCodeCard } from "./PromoCodeCard";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { BillingFooter } from "./BillingFooter";
import { UPCOMING_PAYMENT } from "../constants";
import toast from "react-hot-toast";

export default function BillingContainer() {
 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col gap-8">
 
 {/* ─── Synchronized Universal Hero Banner matching /courses & /study-plan ─── */}
 <section className="relative overflow-hidden rounded-2xl bg-[#FEFCF9] border border-[#E8E2D9] p-6 sm:p-7 shadow-[0_8px_30px_rgba(192,57,43,0.07)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(192,57,43,0.12)] w-full">
 <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#FAF7F2] blur-3xl pointer-events-none animate-pulse" />
 <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#C0392B]/15 blur-3xl pointer-events-none" />

 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
 <div className="space-y-4 max-w-xl">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D9] text-xs font-semibold text-[#C0392B] shadow-sm">
 <span className="w-2 h-2 rounded-full bg-[#2C3039] animate-ping" />
 <span className="w-2 h-2 rounded-full bg-[#2C3039] absolute" />
 Quản Trị Học Phí &amp; Gói Học • Tự Động Hóa AI
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3039] leading-tight">
 Quản Lý &amp; <span className="text-[#C0392B] font-bold drop-shadow-2xs">Thanh Toán Trực Tuyến </span>
 </h1>

 <p className="text-xs sm:text-sm text-[#8A8478] leading-relaxed font-normal">
 Quản lý lịch sử giao dịch học phí, thiết lập phương thức thanh toán an toàn và theo dõi quyền lợi gói học AI Pro. Dữ liệu của bạn được mã hóa bảo mật chuẩn SSL 256-bit.
 </p>

 {/* Cleaned Action button - Removed invoice VAT info button */}
 <div className="flex flex-wrap items-center gap-3 pt-1">
 <button
 type="button"
 onClick={() => toast("Bạn đang trải nghiệm trọn vẹn quyền lợi cao cấp của gói MindNova Pro AI!")}
 className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#C0392B] shadow-[0_4px_14px_rgba(192,57,43,0.35)] hover:shadow-[0_6px_22px_rgba(192,57,43,0.5)] transition-all duration-200 cursor-pointer focus:outline-none flex items-center gap-2"
 >
 <span> Nâng cấp Gói học Pro</span>
 <span></span>
 </button>
 </div>
 </div>

 {/* Universal Wide Mastery Card representing Active Subscription (No automatic renewal / gia hạn messaging) */}
 <div className="group shrink-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E8E2D9] flex flex-col justify-center min-w-[320px] sm:min-w-[380px] shadow-sm hover:border-[#E8E2D9] hover:-translate-y-0.5 transition-all duration-300">
 <div className="w-full flex items-center justify-between gap-4 mb-2">
 <span className="text-xs font-semibold text-[#8A8478] group-hover:text-[#C0392B] transition-colors">Gói cước đang kích hoạt </span>
 <span className="text-[11px] font-semibold text-[#2C3039] bg-[#FAF7F2] px-3 py-0.5 rounded-full border border-[#2C3039]">
 Đặc quyền VIP
 </span>
 </div>

 <div className="text-2xl sm:text-3xl font-bold text-[#2C3039] my-1 flex items-baseline justify-between gap-4">
 <div>
 <span className="text-[#C0392B] font-bold">{UPCOMING_PAYMENT.amount}</span>
 <span className="text-xs font-medium text-[#8A8478] ml-1.5">/ kỳ</span>
 </div>
 <span className="text-xs font-semibold text-[#8A8478]">
 Trạng thái: Active
 </span>
 </div>

 <div className="w-full h-2 bg-[#E8E2D9] rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#E8E2D9]">
 <div
 className="h-full bg-[#C0392B] rounded-full shadow-[0_0_8px_rgba(192,57,43,0.4)] transition-all duration-1000 group-hover:brightness-110"
 style={{ width: "100%" }}
 />
 </div>

 <p className="text-xs font-semibold text-[#C0392B] mt-3.5 flex items-center justify-between gap-4">
 <span className="truncate"> Mở khóa toàn bộ tính năng AI</span>
 <span className="text-[#C0392B] font-semibold cursor-pointer hover:underline shrink-0">Chi tiết gói Pro </span>
 </p>
 </div>
 </div>
 </section>

 {/* ─── Symmetrical 2-Column Grid for Payment Methods & Promo Code ─── */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <PaymentMethodsCard />
 <PromoCodeCard />
 </div>

 {/* ─── Transaction History Table ─── */}
 <TransactionHistoryTable />

 {/* ─── Security Footer ─── */}
 <BillingFooter />
 </div>
 );
}
