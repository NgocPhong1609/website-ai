"use client";

// ─── PricingModelSection ──────────────────────────────────────────────────────
// Card chọn mô hình định giá + input giá cơ bản & khuyến mãi.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check, CreditCard, Gift, Info, Sparkles, Zap, TrendingUp } from "lucide-react";

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
 Icon: Gift,
 },
 {
 id: "paid",
 label: "Cung cấp trả phí",
 description: "Tối ưu hóa doanh thu từ nội dung cao cấp.",
 Icon: CreditCard,
 },
 {
 id: "subscription",
 label: "Cho thuê",
 description: "Cho phép truy cập trong thời gian giới hạn.",
 Icon: Zap,
 },
];

// ─── AI Insight Panel ─────────────────────────────────────────────────────────

function AIInsightPanel({ onApply }: { onApply: (price: string) => void }) {
 return (
 <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
 <div className="flex items-center gap-2">
 <Sparkles size={14} />
 <span className="text-[12px] font-bold text-blue-500 tracking-wide uppercase">
 AI Pricing Insight
 </span>
 </div>
 <p className="text-[12px] text-slate-500 leading-relaxed">
 Dựa trên 24 khóa học tương tự về AI, mức giá tối ưu cho thị trường Việt Nam là:
 </p>

 {/* Price range bar */}
 <div className="flex flex-col gap-1.5">
 <div className="flex justify-between text-[11px] font-semibold text-blue-500">
 <span>890k</span>
 <span>1.1M</span>
 </div>
 <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
 <div
 className="h-full rounded-full bg-blue-500 "
 style={{ width: "65%" }}
 />
 </div>
 </div>

 <button
 type="button"
 onClick={() => onApply("990.000")}
 className="w-full py-2 rounded-lg border border-slate-200 text-[12px] font-semibold text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
 >
 Áp dụng giá gợi ý
 </button>
 </div>
 );
}

// ─── Revenue Stat Panel ───────────────────────────────────────────────────────

function RevenueStatPanel() {
 return (
 <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-2">
 <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
 Thống kê doanh thu dự kiến
 </span>
 <div className="flex items-end gap-2">
 <span className="text-[22px] font-semibold text-slate-900 leading-none">
 24.5M
 </span>
 <span className="text-[13px] text-slate-500 mb-0.5">/tháng</span>
 </div>
 <div className="flex items-center gap-1.5 text-slate-900 text-[12px] font-semibold">
 <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
 <TrendingUp className="h-3 w-3" aria-hidden />
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
 "relative flex flex-col items-center gap-2 p-4 rounded-lg border text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
 isSelected
 ? "border-slate-200 bg-slate-50 shadow-[0_0_0_3px_rgba(59,130,246,0.18)]"
 : "border-slate-200 bg-white hover:border-blue-100 hover:bg-slate-50",
 )}
 >
 {/* Radio dot */}
 <span
 className={twMerge(
 "absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
 isSelected
 ? "border-slate-200 bg-slate-50"
 : "border-slate-200 bg-white",
 )}
 >
 {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
 </span>

 {/* Icon */}
 <span
 className={twMerge(
 "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
 isSelected
 ? "bg-slate-50 text-blue-500"
 : "bg-slate-200 text-slate-500",
 )}
 >
 <option.Icon size={22} />
 </span>

 <span
 className={twMerge(
 "text-[12px] font-semibold leading-snug transition-colors duration-150",
 isSelected ? "text-slate-900" : "text-slate-600",
 )}
 >
 {option.label}
 </span>
 <span className="text-[11px] text-slate-500 leading-relaxed">
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
 <label htmlFor="base-price" className="text-[12px] font-semibold text-slate-600 uppercase tracking-wide">
 Giá bán niêm yết (100,000 - 100,000,000 VNĐ)
 </label>
 <div className="flex items-center gap-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all duration-150">
 <span className="h-10 flex items-center px-3 text-[14px] font-bold text-slate-500 bg-slate-50">
 đ
 </span>
 <input
 id="base-price"
 type="text"
 value={basePrice}
 onChange={(e) => onBaseChange(e.target.value)}
 placeholder="0"
 className="flex-1 h-10 px-1 text-sm font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300"
 />
 <span className="h-10 flex items-center px-3 text-[12px] font-bold text-blue-500 border-l border-slate-200 bg-slate-50">
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
 <div className="flex flex-col gap-4 mt-2 p-4 rounded-lg border border-slate-200 bg-slate-50">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Zap className="h-4 w-4 text-amber-500" aria-hidden />
 <span className="text-[13px] font-bold text-slate-900">Lên Lịch Giảm Giá & Khuyến Mãi Flash Sale</span>
 </div>
 <input
 type="checkbox"
 checked={isFlashSale}
 onChange={(e) => setIsFlashSale(e.target.checked)}
 className="w-4 h-4 text-blue-500 rounded border-slate-200 focus:ring-blue-500"
 />
 </div>
 <p className="text-[11px] text-slate-500 mt-[-8px]">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
 
 {isFlashSale && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Giá khuyến mãi (VNĐ)</label>
 <input
 type="text"
 value={salePrice}
 onChange={(e) => onSaleChange(e.target.value)}
 className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-900 font-bold focus:outline-none focus:border-slate-200"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Ngày bắt đầu</label>
 <input
 type="date"
 value={saleStartDate}
 onChange={(e) => setSaleStartDate(e.target.value)}
 className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-200"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Ngày kết thúc (Tối đa 7 ngày)</label>
 <input
 type="date"
 value={saleEndDate}
 onChange={(e) => setSaleEndDate(e.target.value)}
 className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-200"
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
 <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500 text-[10px] font-bold text-white tracking-wide shadow-[0_2px_8px_rgba(59,130,246,0.35)]">
 <Sparkles size={9} />
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
 <div className="rounded-lg border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
 <CreditCard size={14} />
 </span>
 <span className="text-[14px] font-bold text-slate-900">Mô hình định giá</span>
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
 <div className="border-t border-slate-200" />

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
 <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border-slate-200">
 <Check size={13} />
 <p className="text-[12px] text-slate-900 font-medium">
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