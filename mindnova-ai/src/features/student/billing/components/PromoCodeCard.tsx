"use client";

import { useState } from "react";
import { SparkleIcon } from "./icons";
import { axiosClient } from "@/src/shared/lib/axios";

export function PromoCodeCard({ courseId }: { courseId?: number | null }) {
 const [code, setCode] = useState("");
 const [applied, setApplied] = useState(false);
 const [error, setError] = useState(false);
 const [message, setMessage] = useState("");

 async function handleApply() {
 if (code.trim().length === 0) {
 setError(true);
 setApplied(false);
 return;
 }
 if (!courseId) {
 setError(true);
 setMessage("Mã sẽ được áp dụng khi thanh toán khóa học.");
 return;
 }
 try {
 const { data } = await axiosClient.post("/api/coupons/apply", { code: code.trim(), course_id: courseId });
 setError(false);
 setApplied(true);
 setMessage(data.message || "Áp dụng mã thành công.");
 } catch (err: any) {
 setError(true);
 setApplied(false);
 setMessage(err?.response?.data?.message || "Mã không hợp lệ.");
 }
 }

 return (
 <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
 {/* Header */}
 <div className="border-b border-[#F0F2FA] pb-4">
 <div className="flex items-center gap-2.5">
 <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#f8fafc] text-[#2563eb] border border-[#2563eb]/15 shadow-2xs">
 <SparkleIcon size={14} />
 </span>
 <h2 className="text-base font-semibold text-[#0f172a]">Mã Ưu Đãi &amp; Khuyến Mãi</h2>
 </div>
 <p className="text-xs font-normal text-[#64748b] mt-1 leading-relaxed">
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
 className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#0f172a] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#2563eb] shadow-2xs placeholder-[#989AAB] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15 transition-all duration-200 uppercase tracking-wider"
 />
 <button
 type="button"
 onClick={handleApply}
 className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563eb] shadow-2xs hover:opacity-95 active:scale-98 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center"
 >
 {applied ? "Đã áp dụng " : "Áp dụng ngay"}
 </button>
 </div>

 {applied && message && (
 <p className="text-xs font-medium text-[#0f172a] bg-[#EAF8F5] p-3 rounded-xl border border-[#0f172a] mt-1">
 {message}
 </p>
 )}
 {error && (
 <p className="text-xs font-medium text-[#2563eb] bg-[#f8fafc] p-3 rounded-xl border border-[#3B82F6]/20 flex items-center gap-1.5 mt-1">
 <span>️</span>
 <span>Vui lòng nhập mã voucher hợp lệ để kích hoạt ưu đãi.</span>
 </p>
 )}
 </div>
 </div>
 );
}
