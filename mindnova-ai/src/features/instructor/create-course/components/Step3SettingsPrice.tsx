"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useInstructorPricing } from "@/src/hooks/instructor/useInstructorPricing";
import { useCreateCourseStore } from "../stores/createCourseStore";

export interface Step3SettingsPriceProps {
 courseTitle?: string;
 thumbnailPreview?: string | null;
 initialPrice?: number | null;
 initialFlashSale?: boolean;
 initialSalePrice?: number | null;
 initialSaleStartDate?: string | null;
 initialSaleEndDate?: string | null;
 onSaveConfig?: () => void;
}

export function Step3SettingsPrice({ 
 courseTitle = "Khóa học AI mới", 
 thumbnailPreview, 
 initialPrice, 
 initialFlashSale,
 initialSalePrice,
 initialSaleStartDate,
 initialSaleEndDate,
 onSaveConfig 
}: Step3SettingsPriceProps) {
 const setSettings = useCreateCourseStore((s) => s.setSettings);
 
 const {
 isFree,
 basePrice,
 tier,
 discount,
 validationError,
 revenue,
 setIsFree,
 setBasePrice,
 setTier,
 toggleDiscount,
 updateDiscount,
 } = useInstructorPricing(
 initialPrice ?? 500000,
 initialFlashSale ?? false,
 initialSalePrice ?? undefined,
 initialSaleStartDate ?? undefined,
 initialSaleEndDate ?? undefined
 );

 useEffect(() => {
 setSettings("basePrice", String(isFree ? 0 : basePrice));
 setSettings("isFlashSale", isFree ? false : discount.isEnabled);
 setSettings("salePrice", isFree ? "" : String(discount.discountPrice));
 setSettings("saleStartDate", isFree ? "" : discount.startDate);
 setSettings("saleEndDate", isFree ? "" : discount.endDate);
 }, [basePrice, isFree, discount, setSettings]);

 return (
 <div className="w-full flex flex-col gap-6 animate-fadeIn">
 {/* Top Title Banner */}
 <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs">
 <h3 className="text-base font-black text-[#2C3039]">Cấu hình Giá bán &amp; Doanh thu</h3>
 <p className="text-xs text-[#8A8478] mt-1">
 Thiết lập khoảng giá tiêu chuẩn cho khóa học (100,000–100,000,000 VNĐ), lên lịch chương trình ưu đãi khuyến mãi và dự toán thu nhập thực tế theo thời gian thực.
 </p>
 </div>

 {/* Main Grid Matrix */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 
 {/* Left Column - Form Config */}
 <div className="lg:col-span-7 flex flex-col gap-5">
 
 {/* Free vs Paid Toggle */}
 <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs flex flex-col gap-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h4 className="text-sm font-black text-[#2C3039]">Hình Thức Phát Hành Khóa Học</h4>
 <p className="text-xs text-[#8A8478]">Lựa chọn giữa miễn phí cống hiến cho cộng đồng hoặc thu phí chuyên nghiệp.</p>
 </div>
 <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-[#E8E2D9] w-fit shrink-0">
 <button
 type="button"
 onClick={() => setIsFree(false)}
 className={twMerge(
 "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
 !isFree ? "bg-[#C0392B] text-white shadow-2xs" : "text-[#8A8478] hover:text-[#2C3039]"
 )}
 >
 Khóa Thu Phí
 </button>
 <button
 type="button"
 onClick={() => setIsFree(true)}
 className={twMerge(
 "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
 isFree ? "-[#2C3039] text-white shadow-2xs" : "text-[#8A8478] hover:text-[#2C3039]"
 )}
 >
 Miễn Phí
 </button>
 </div>
 </div>

 {!isFree && (
 <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn">
 <div>
 <label htmlFor="course-price-input" className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
 Giá Bán Niêm Yết (100,000 – 100,000,000 VNĐ)
 </label>
 <div className="relative rounded-xl shadow-2xs">
 <span className="absolute left-3.5 top-3 text-base font-extrabold text-gray-400">đ</span>
 <input
 id="course-price-input"
 type="number"
 min={100000}
 max={100000000}
 value={basePrice}
 onChange={(e) => setBasePrice(e.target.value)}
 className={twMerge(
 "w-full pl-8 pr-12 py-3 rounded-xl font-black font-mono text-sm border transition-all focus:outline-none",
 validationError
 ? "border-rose-300 text-rose-600 bg-rose-50/20"
 : "border-[#E8E2D9] bg-[#FEFCF9]/50 text-[#2C3039] focus:border-[#C0392B] focus:bg-white"
 )}
 placeholder="500000"
 />
 <span className="absolute right-3.5 top-3 text-xs font-extrabold text-[#8A8478]">VNĐ</span>
 </div>
 </div>

 {validationError && (
 <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
 ️ {validationError}
 </p>
 )}

 <div className="flex flex-col gap-2 pt-1">
 <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Cấp Độ Hợp Tác Giảng Viên:</label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button
 type="button"
 onClick={() => setTier("standard")}
 className={twMerge(
 "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
 tier === "standard"
 ? "border-[#C0392B] bg-indigo-50/50 shadow-2xs"
 : "border-[#E8E2D9] bg-white hover:border-gray-300"
 )}
 >
 <p className="text-xs font-extrabold text-[#2C3039]">Đối Tác Tiêu Chuẩn</p>
 <p className="text-[11px] -[#C0392B] font-bold mt-0.5">30% phí hệ thống (Nhận 70%)</p>
 </button>

 <button
 type="button"
 onClick={() => setTier("exclusive")}
 className={twMerge(
 "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
 tier === "exclusive"
 ? "-[#2C3039] bg-emerald-50/50 shadow-2xs"
 : "border-[#E8E2D9] bg-white hover:border-gray-300"
 )}
 >
 <p className="text-xs font-extrabold text-[#2C3039]"> Hợp Tác Độc Quyền MindNova</p>
 <p className="text-[11px] -[#2C3039] font-bold mt-0.5">Ưu đãi chỉ 15% phí (Nhận 85%)</p>
 </button>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Promotional Discount Scheduler */}
 {!isFree && (
 <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs flex flex-col gap-4 animate-fadeIn">
 <div className="flex items-center justify-between">
 <div>
 <h4 className="text-sm font-black text-[#2C3039]"> Lên Lịch Giảm Giá &amp; Khuyến Mãi Flash Sale</h4>
 <p className="text-xs text-[#8A8478] mt-0.5">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
 </div>
 <input
 type="checkbox"
 checked={discount.isEnabled}
 onChange={(e) => toggleDiscount(e.target.checked)}
 className="w-5 h-5 rounded-md text-[#C0392B] focus:ring-[#C0392B] border-gray-300 cursor-pointer"
 aria-label="Kích hoạt giảm giá"
 />
 </div>

 {discount.isEnabled && (
 <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
 <div>
 <label htmlFor="discount-price-input" className="block text-xs font-bold text-gray-700 uppercase mb-1">Giá Khuyến Mãi (VNĐ)</label>
 <input
 id="discount-price-input"
 type="number"
 min={100000}
 max={basePrice}
 value={discount.discountPrice}
 onChange={(e) => updateDiscount("discountPrice", parseFloat(e.target.value) || 100000)}
 className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] font-black font-mono text-xs -[#2C3039] focus:outline-none focus:-[#2C3039] bg-[#FEFCF9]/50"
 />
 </div>
 <div>
 <label htmlFor="discount-start-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Bắt Đầu</label>
 <input
 id="discount-start-date"
 type="date"
 value={discount.startDate}
 onChange={(e) => updateDiscount("startDate", e.target.value)}
 className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] font-bold text-xs text-gray-700 focus:outline-none bg-[#FEFCF9]/50"
 />
 </div>
 <div>
 <label htmlFor="discount-end-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Kết Thúc (7 ngày)</label>
 <input
 id="discount-end-date"
 type="date"
 value={discount.endDate}
 onChange={(e) => updateDiscount("endDate", e.target.value)}
 className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] font-bold text-xs text-gray-700 focus:outline-none bg-[#FEFCF9]/50"
 />
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Right Column - Dynamic Revenue Calculator & Preview */}
 <div className="lg:col-span-5 flex flex-col gap-5 sticky top-20">
 
 {/* Dynamic Revenue Calculator Panel */}
 <div className="p-6 rounded-2xl bg-[#C0392B] text-white border -[#C0392B] shadow-sm flex flex-col gap-5">
 <div className="flex items-center gap-3 border-b border-white/10 pb-4">
 
 <div>
 <h4 className="text-sm font-black text-white">Bảng Dự Toán Doanh Thu AI</h4>
 <p className="text-xs -[#FAF7F2] mt-0.5">Phân tích dòng tiền lợi nhuận sau chiết khấu</p>
 </div>
 </div>

 <div className="flex flex-col gap-3 font-mono text-xs">
 <div className="flex items-center justify-between -[#FAF7F2]">
 <span>Giá Bán Niêm Yết (Áp dụng):</span>
 <span className="font-extrabold text-white text-sm">{revenue.listPrice.toLocaleString('vi-VN')} VNĐ</span>
 </div>
 {!isFree && (
 <div className="flex items-center justify-between text-rose-200">
 <span>Phí Hạ Tầng Nền Tảng ({revenue.commissionRate}%):</span>
 <span>-{revenue.platformFee.toLocaleString('vi-VN')} VNĐ</span>
 </div>
 )}
 <div className="h-px bg-white/10 w-full my-0.5" />
 <div className="flex items-center justify-between -[#FAF7F2]">
 <span>Tỷ lệ phân chia Giảng viên (Hạng PRO):</span>
 <span className="font-extrabold text-white text-sm">80.0%</span>
 </div>
 <div className="flex items-center justify-between text-sm font-black -[#FAF7F2]">
 <span>Thu Nhập Ròng Tích Lũy:</span>
 <span>{revenue.instructorEarnings.toLocaleString('vi-VN')} VNĐ / học viên</span>
 </div>
 </div>

 <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold leading-relaxed text-white">
 {revenue.earningsText}
 </div>
 </div>

 {/* Quick Preview Badge & Save Action */}
 <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-2xs flex flex-col gap-4">
 <h5 className="text-xs font-black text-[#2C3039] uppercase tracking-wider">Danh Sách Tiêu Chuẩn Phê Duyệt</h5>
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-2 text-xs font-extrabold -[#2C3039]">
 <span> Giá niêm yết tuân thủ khung tiêu chuẩn 100,000–100,000,000 VNĐ</span>
 </div>
 <div className="flex items-center gap-2 text-xs font-extrabold -[#C0392B]">
 <span> Lịch trình khuyến mãi được đồng bộ hóa thời gian AI</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}