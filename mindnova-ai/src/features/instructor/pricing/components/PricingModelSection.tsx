"use client";

// ─── PricingModelSection ──────────────────────────────────────────────────────
// Card chọn mô hình định giá + input giá cơ bản & khuyến mãi.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { SparklesIcon, CheckIcon, InfoIcon, FreeIcon, PaidIcon, SubscribeIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type PricingModel = "free" | "paid" | "subscription";

interface ModelOption {
 id: PricingModel;
 label: string;
 description: string;
 Icon: React.FC<{ size?: number }>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODELS: ModelOption[] = [
 {
 id: "free",
 label: "Cung cấp miễn phí",
 description: "Thu hút học viên & xây dựng cộng đồng.",
 Icon: FreeIcon,
 },
 {
 id: "paid",
 label: "Cung cấp trả phí",
 description: "Tối ưu hóa doanh thu từ nội dung cao cấp.",
 Icon: PaidIcon,
 },
 {
 id: "subscription",
 label: "Cho thuê",
 description: "Cho phép truy cập trong thời gian giới hạn.",
 Icon: SubscribeIcon,
 },
];

// ─── AI Insight Panel ─────────────────────────────────────────────────────────

function AIInsightPanel({ onApply }: { onApply: (price: string) => void }) {
 return (
 <div className="rounded-xl border border-[#DDD9FF] bg-[#F7F5FF] p-4 flex flex-col gap-3">
 <div className="flex items-center gap-2">
 <SparklesIcon size={14} />
 <span className="text-[12px] font-bold text-[#3B82F6] tracking-wide uppercase">
 AI Pricing Insight
 </span>
 </div>
 <p className="text-[12px] text-[#64748B] leading-relaxed">
 Dựa trên 24 khóa học tương tự về AI, mức giá tối ưu cho thị trường Việt Nam là:
 </p>

 {/* Price range bar */}
 <div className="flex flex-col gap-1.5">
 <div className="flex justify-between text-[11px] font-semibold text-[#3B82F6]">
 <span>890k</span>
 <span>1.1M</span>
 </div>
 <div className="h-2 rounded-full bg-[#DDD9FF] overflow-hidden">
 <div
 className="h-full rounded-full bg-[#3B82F6] "
 style={{ width: "65%" }}
 />
 </div>
 </div>

 <button
 type="button"
 onClick={() => onApply("990.000")}
 className="w-full py-2 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#3B82F6] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
 >
 Áp dụng giá gợi ý
 </button>
 </div>
 );
}

// ─── Revenue Stat Panel ───────────────────────────────────────────────────────

function RevenueStatPanel() {
 return (
 <div className="rounded-xl border border-[#E2E8F0] bg-[#FAFAFE] p-4 flex flex-col gap-2">
 <span className="text-[10px] font-bold text-[#64748B] tracking-widest uppercase">
 Thống kê doanh thu dự kiến
 </span>
 <div className="flex items-end gap-2">
 <span className="text-[22px] font-extrabold text-[#0F172A] leading-none">
 24.5M
 </span>
 <span className="text-[13px] text-[#64748B] mb-0.5">/tháng</span>
 </div>
 <div className="flex items-center gap-1.5 text-[#0F172A] text-[12px] font-semibold">
 <span className="w-5 h-5 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#0F172A]">
 ↑
 </span>
 +12% so với trung bình
 </div>
 </div>
 );
}

// ─── Model Option Card ────────────────────────────────────────────────────────

function ModelCard({
 option,
 isSelected,
 onSelect,
}: {
 option: ModelOption;
 isSelected: boolean;
 onSelect: () => void;
}) {
 return (
 <button
 type="button"
 onClick={onSelect}
 aria-pressed={isSelected}
 className={twMerge(
 "relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30",
 isSelected
 ? "border-[#E2E8F0] bg-[#F5F3FF] shadow-[0_0_0_3px_rgba(59,130,246,0.18)]"
 : "border-[#E2E8F0] bg-white hover:border-[#DBEAFE] hover:bg-[#FAFAFE]",
 )}
 >
 {/* Radio dot */}
 <span
 className={twMerge(
 "absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
 isSelected
 ? "border-[#E2E8F0] bg-[#F8FAFC]"
 : "border-[#D0D0E8] bg-white",
 )}
 >
 {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
 </span>

 {/* Icon */}
 <span
 className={twMerge(
 "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
 isSelected
 ? "bg-[#F8FAFC] text-[#3B82F6]"
 : "bg-[#E2E8F0] text-[#64748B]",
 )}
 >
 <option.Icon size={22} />
 </span>

 <span
 className={twMerge(
 "text-[12px] font-semibold leading-snug transition-colors duration-150",
 isSelected ? "text-[#0F172A]" : "text-[#475569]",
 )}
 >
 {option.label}
 </span>
 <span className="text-[11px] text-[#64748B] leading-relaxed">
 {option.description}
 </span>
 </button>
 );
}

// ─── Price Inputs ─────────────────────────────────────────────────────────────

function PriceInputs({
 basePrice,
 onBaseChange,
}: {
 basePrice: string;
 onBaseChange: (v: string) => void;
}) {
 return (
 <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
 <label htmlFor="base-price" className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide">
 Giá bán niêm yết (100,000 - 100,000,000 VNĐ)
 </label>
 <div className="flex items-center gap-0 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#E2E8F0] focus-within:ring-2 focus-within:ring-[#3B82F6]/15 transition-all duration-150">
 <span className="h-10 flex items-center px-3 text-[14px] font-bold text-[#64748B] bg-[#FAFAFE]">
 đ
 </span>
 <input
 id="base-price"
 type="text"
 value={basePrice}
 onChange={(e) => onBaseChange(e.target.value)}
 placeholder="0"
 className="flex-1 h-10 px-1 text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none placeholder:text-[#C4C4D8]"
 />
 <span className="h-10 flex items-center px-3 text-[12px] font-bold text-[#3B82F6] border-l border-[#DDDDF0] bg-[#F0F0FF]">
 VNĐ
 </span>
 </div>
 </div>
 );
}

function FlashSaleInputs({
 isFlashSale,
 setIsFlashSale,
 salePrice,
 onSaleChange,
 saleStartDate,
 setSaleStartDate,
 saleEndDate,
 setSaleEndDate,
}: {
 isFlashSale: boolean;
 setIsFlashSale: (v: boolean) => void;
 salePrice: string;
 onSaleChange: (v: string) => void;
 saleStartDate: string;
 setSaleStartDate: (v: string) => void;
 saleEndDate: string;
 setSaleEndDate: (v: string) => void;
}) {
 return (
 <div className="flex flex-col gap-4 mt-2 p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFE]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-[#0F172A]"></span>
 <span className="text-[13px] font-bold text-[#0F172A]">Lên Lịch Giảm Giá & Khuyến Mãi Flash Sale</span>
 </div>
 <input
 type="checkbox"
 checked={isFlashSale}
 onChange={(e) => setIsFlashSale(e.target.checked)}
 className="w-4 h-4 text-[#3B82F6] rounded border-[#DDDDF0] focus:ring-[#3B82F6]"
 />
 </div>
 <p className="text-[11px] text-[#64748B] mt-[-8px]">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
 
 {isFlashSale && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">Giá khuyến mãi (VNĐ)</label>
 <input
 type="text"
 value={salePrice}
 onChange={(e) => onSaleChange(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#0F172A] font-bold focus:outline-none focus:border-[#E2E8F0]"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">Ngày bắt đầu</label>
 <input
 type="date"
 value={saleStartDate}
 onChange={(e) => setSaleStartDate(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#E2E8F0]"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#475569] uppercase tracking-wide">Ngày kết thúc (Tối đa 7 ngày)</label>
 <input
 type="date"
 value={saleEndDate}
 onChange={(e) => setSaleEndDate(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#E2E8F0]"
 />
 </div>
 </div>
 )}
 </div>
 );
}

// ─── AI Badge ─────────────────────────────────────────────────────────────────

function AIBadge() {
 return (
 <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3B82F6] text-[10px] font-bold text-white tracking-wide shadow-[0_2px_8px_rgba(59,130,246,0.35)]">
 <SparklesIcon size={9} />
 AI Recommended
 </span>
 );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function PricingModelSection({
 basePrice, setBasePrice,
 salePrice, setSalePrice,
 isFlashSale, setIsFlashSale,
 saleStartDate, setSaleStartDate,
 saleEndDate, setSaleEndDate
}: any) {
 const [model, setModel] = useState<PricingModel>("paid");

 return (
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
 {/* Left: main card */}
 <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-6 h-6 rounded-md bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
 <PaidIcon size={14} />
 </span>
 <span className="text-[14px] font-bold text-[#0F172A]">Mô hình định giá</span>
 </div>
 <AIBadge />
 </div>

 {/* Model cards */}
 <div className="grid grid-cols-3 gap-3">
 {MODELS.map((opt) => (
 <ModelCard
 key={opt.id}
 option={opt}
 isSelected={model === opt.id}
 onSelect={() => setModel(opt.id)}
 />
 ))}
 </div>

 {/* Divider */}
 <div className="border-t border-[#E2E8F0]" />

 {/* Price inputs */}
 {model !== "free" && (
 <>
 <PriceInputs
 basePrice={basePrice}
 onBaseChange={setBasePrice}
 />
 
 <FlashSaleInputs
 isFlashSale={isFlashSale}
 setIsFlashSale={setIsFlashSale}
 salePrice={salePrice}
 onSaleChange={setSalePrice}
 saleStartDate={saleStartDate}
 setSaleStartDate={setSaleStartDate}
 saleEndDate={saleEndDate}
 setSaleEndDate={setSaleEndDate}
 />
 </>
 )}

 {model === "free" && (
 <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border-[#E2E8F0]">
 <CheckIcon size={13} />
 <p className="text-[12px] text-[#0F172A] font-medium">
 Khóa học sẽ hiển thị miễn phí — không cần cấu hình giá.
 </p>
 </div>
 )}
 </div>

 {/* Right: AI panels */}
 <div className="flex flex-col gap-3">
 <AIInsightPanel onApply={(p) => { setBasePrice(p); setModel("paid"); }} />
 <RevenueStatPanel />
 </div>
 </div>
 );
}