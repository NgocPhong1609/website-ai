"use client";

import { useState } from "react";
import { SparkleIcon } from "./icons";

export function PromoCodeCard() {
 const [code, setCode] = useState("NOVA2026-AI");
 const [applied, setApplied] = useState(false);
 const [error, setError] = useState(false);

 function handleApply() {
 if (code.trim().length === 0) {
 setError(true);
 setApplied(false);
 return;
 }
 setError(false);
 setApplied(true);
 setTimeout(() => setApplied(false), 3500);
 }

 function handleQuickSelect(sample: string) {
 setCode(sample);
 setError(false);
 setApplied(true);
 setTimeout(() => setApplied(false), 3500);
 }

 return (
 <div className="rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
 {/* Header */}
 <div className="border-b border-[#F0F2FA] pb-4">
 <div className="flex items-center gap-2.5">
 <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#FAF7F2] text-[#C0392B] border border-[#C0392B]/15 shadow-2xs">
 <SparkleIcon size={14} />
 </span>
 <h2 className="text-base font-semibold text-[#2C3039]">Mã Ưu Đãi &amp; Khuyến Mãi</h2>
 </div>
 <p className="text-xs font-normal text-[#8A8478] mt-1 leading-relaxed">
 Sử dụng voucher khuyến mãi hoặc mã chiết khấu từ sự kiện MindNova để áp dụng vào học phí kỳ tới.
 </p>
 </div>

 {/* Input Form & Quick Pills */}
 <div className="flex flex-col gap-3">
 <div className="flex flex-col sm:flex-row gap-2.5">
 <input
 id="promo-code-input"
 type="text"
 value={code}
 onChange={(e) => {
 setCode(e.target.value);
 setError(false);
 setApplied(false);
 }}
 placeholder="Nhập mã ưu đãi..."
 className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#2C3039] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#C0392B] shadow-2xs placeholder-[#989AAB] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/15 transition-all duration-200 uppercase tracking-wider"
 />
 <button
 type="button"
 onClick={handleApply}
 className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#C0392B] shadow-2xs hover:opacity-95 active:scale-98 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center"
 >
 {applied ? "Đã áp dụng " : "Áp dụng ngay"}
 </button>
 </div>

 {/* Quick Selection Pills (Prevents overlap with floating AI widget) */}
 <div className="flex flex-wrap items-center gap-2 pt-1">
 <span className="text-xs text-[#8A8478] font-normal mr-1">Gợi ý khả dụng:</span>
 {[
 { tag: "NOVA2026-AI", label: "Giảm 20% Học kỳ Pro" },
 { tag: "AIMASTER10", label: "Voucher 100K" },
 ].map(({ tag, label }) => (
 <button
 key={tag}
 type="button"
 onClick={() => handleQuickSelect(tag)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F5FD] hover:bg-[#FAF7F2] border border-[#E8E2D9] hover:border-[#E8E2D9] text-xs font-medium text-[#C0392B] transition-all duration-150 cursor-pointer shadow-2xs"
 >
 <span className="font-semibold">{tag}</span>
 <span className="text-[11px] text-[#8A8478] font-normal">• {label}</span>
 </button>
 ))}
 </div>

 {/* Feedback Messages */}
 {applied && (
 <p className="text-xs font-medium text-[#2C3039] bg-[#EAF8F5] p-3 rounded-xl border border-[#2C3039] flex items-center gap-2 mt-1 animate-fadeIn">
 <span></span>
 <span><strong>{code}</strong> đã được áp dụng thành công cho lượt thanh toán tiếp theo!</span>
 </p>
 )}
 {error && (
 <p className="text-xs font-medium text-[#C0392B] bg-[#FAF7F2] p-3 rounded-xl border border-[#EF4444]/20 flex items-center gap-1.5 mt-1">
 <span>️</span>
 <span>Vui lòng nhập mã voucher hợp lệ để kích hoạt ưu đãi.</span>
 </p>
 )}
 </div>
 </div>
 );
}
