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
 <span className="text-[12px] font-bold text-[#C0392B] tracking-wide uppercase">
 AI Pricing Insight
 </span>
 </div>
 <p className="text-[12px] text-[#8A8478] leading-relaxed">
 Dựa trên 24 khóa học tương tự về AI, mức giá tối ưu cho thị trường Việt Nam là:
 </p>

 {/* Price range bar */}
 <div className="flex flex-col gap-1.5">
 <div className="flex justify-between text-[11px] font-semibold text-[#C0392B]">
 <span>890k</span>
 <span>1.1M</span>
 </div>
 <div className="h-2 rounded-full bg-[#DDD9FF] overflow-hidden">
 <div
 className="h-full rounded-full bg-[#C0392B] "
 style={{ width: "65%" }}
 />
 </div>
 </div>

 <button
 type="button"
 onClick={() => onApply("990.000")}
 className="w-full py-2 rounded-lg border border-[#E8E2D9] text-[12px] font-semibold text-[#C0392B] hover:bg-[#FAF7F2] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30"
 >
 Áp dụng giá gợi ý
 </button>
 </div>
 );
}

// ─── Revenue Stat Panel ───────────────────────────────────────────────────────

function RevenueStatPanel() {
 return (
 <div className="rounded-xl border border-[#E8E2D9] bg-[#FAFAFE] p-4 flex flex-col gap-2">
 <span className="text-[10px] font-bold text-[#8A8478] tracking-widest uppercase">
 Thống kê doanh thu dự kiến
 </span>
 <div className="flex items-end gap-2">
 <span className="text-[22px] font-extrabold text-[#2C3039] leading-none">
 24.5M
 </span>
 <span className="text-[13px] text-[#8A8478] mb-0.5">/tháng</span>
 </div>
 <div className="flex items-center gap-1.5 -[#2C3039] text-[12px] font-semibold">
 <span className="w-5 h-5 rounded-full -[#FAF7F2] flex items-center justify-center -[#2C3039]">
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
 "relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30",
 isSelected
 ? "border-[#E8E2D9] bg-[#F5F3FF] shadow-[0_0_0_3px_rgba(107,107,255,0.18)]"
 : "border-[#E8E2D9] bg-white hover:border-[#C5C6FF] hover:bg-[#FAFAFE]",
 )}
 >
 {/* Radio dot */}
 <span
 className={twMerge(
 "absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
 isSelected
 ? "border-[#E8E2D9] bg-[#FAF7F2]"
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
 ? "bg-[#FAF7F2] text-[#C0392B]"
 : "bg-[#E8E2D9] text-[#8A8478]",
 )}
 >
 <option.Icon size={22} />
 </span>

 <span
 className={twMerge(
 "text-[12px] font-semibold leading-snug transition-colors duration-150",
 isSelected ? "text-[#2C3039]" : "text-[#464554]",
 )}
 >
 {option.label}
 </span>
 <span className="text-[11px] text-[#8A8478] leading-relaxed">
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
 <label htmlFor="base-price" className="text-[12px] font-semibold text-[#464554] uppercase tracking-wide">
 Giá bán niêm yết (100,000 - 100,000,000 VNĐ)
 </label>
 <div className="flex items-center gap-0 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#E8E2D9] focus-within:ring-2 focus-within:ring-[#C0392B]/15 transition-all duration-150">
 <span className="h-10 flex items-center px-3 text-[14px] font-bold text-[#8A8478] bg-[#FAFAFE]">
 đ
 </span>
 <input
 id="base-price"
 type="text"
 value={basePrice}
 onChange={(e) => onBaseChange(e.target.value)}
 placeholder="0"
 className="flex-1 h-10 px-1 text-sm font-semibold text-[#2C3039] bg-transparent focus:outline-none placeholder:text-[#C4C4D8]"
 />
 <span className="h-10 flex items-center px-3 text-[12px] font-bold text-[#C0392B] border-l border-[#DDDDF0] bg-[#F0F0FF]">
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
 <div className="flex flex-col gap-4 mt-2 p-4 rounded-xl border border-[#E8E2D9] bg-[#FAFAFE]">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-[#2C3039]"></span>
 <span className="text-[13px] font-bold text-[#2C3039]">Lên Lịch Giảm Giá & Khuyến Mãi Flash Sale</span>
 </div>
 <input
 type="checkbox"
 checked={isFlashSale}
 onChange={(e) => setIsFlashSale(e.target.checked)}
 className="w-4 h-4 text-[#C0392B] rounded border-[#DDDDF0] focus:ring-[#C0392B]"
 />
 </div>
 <p className="text-[11px] text-[#8A8478] mt-[-8px]">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
 
 {isFlashSale && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#464554] uppercase tracking-wide">Giá khuyến mãi (VNĐ)</label>
 <input
 type="text"
 value={salePrice}
 onChange={(e) => onSaleChange(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#2C3039] font-bold focus:outline-none focus:border-[#E8E2D9]"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#464554] uppercase tracking-wide">Ngày bắt đầu</label>
 <input
 type="date"
 value={saleStartDate}
 onChange={(e) => setSaleStartDate(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#2C3039] focus:outline-none focus:border-[#E8E2D9]"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-[#464554] uppercase tracking-wide">Ngày kết thúc (Tối đa 7 ngày)</label>
 <input
 type="date"
 value={saleEndDate}
 onChange={(e) => setSaleEndDate(e.target.value)}
 className="h-10 px-3 rounded-xl border border-[#DDDDF0] text-sm text-[#2C3039] focus:outline-none focus:border-[#E8E2D9]"
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
 <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C0392B] text-[10px] font-bold text-white tracking-wide shadow-[0_2px_8px_rgba(107,107,255,0.35)]">
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
 <div className="rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#C0392B] flex items-center justify-center">
 <PaidIcon size={14} />
 </span>
 <span className="text-[14px] font-bold text-[#2C3039]">Mô hình định giá</span>
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
 <div className="border-t border-[#E8E2D9]" />

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
 <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border -[#FAF7F2]">
 <CheckIcon size={13} />
 <p className="text-[12px] -[#2C3039] font-medium">
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