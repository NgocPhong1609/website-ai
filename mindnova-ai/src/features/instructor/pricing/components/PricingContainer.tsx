"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PricingModelSection } from "./PricingModelSection";
import { CouponSection } from "./CouponSection";
import { SaveIcon, ChevronRightIcon } from "./icons";
import { useUpdateCoursePrice } from "../../create-course/api";
import { useInstructorCourse } from "../../management/api/courses";

const TABS = [
 { id: "pricing", label: "Giá & Kiếm tiền" },
 { id: "content", label: "Nội dung học liệu" },
 { id: "students", label: "Học viên đăng ký" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PageTabs({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
 return (
 <div className="flex items-center gap-2 border-b border-[#E8E2D9] px-6 bg-white">
 {TABS.map((tab) => (
 <button
 key={tab.id}
 type="button"
 onClick={() => onChange(tab.id)}
 className={twMerge(
 "relative px-4 py-3 text-xs font-black transition-all duration-150 cursor-pointer",
 active === tab.id ? "text-[#C0392B]" : "text-gray-400 hover:text-gray-700"
 )}
 >
 {tab.label}
 <span
 className={twMerge(
 "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#C0392B] transition-all duration-200",
 active === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
 )}
 />
 </button>
 ))}
 </div>
 );
}

function Breadcrumb() {
 return (
 <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
 <Link href="/instructor/courses" className="hover:text-[#C0392B] transition-colors">
 Khóa học của tôi
 </Link>
 <ChevronRightIcon size={12} />
 <span className="text-gray-700">Generative AI Masterclass 2026</span>
 </nav>
 );
}

function PageHeader({ onSave }: { onSave: () => void }) {
 return (
 <div className="px-6 pt-5 pb-4 bg-white border-b border-[#E8E2D9] shadow-2xs">
 <Breadcrumb />
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2.5 gap-3">
 <div>
 <h1 className="text-lg font-black text-[#2C3039] tracking-tight">
 Quản Lý Giá &amp; Kiếm Tiền: Generative AI Masterclass
 </h1>
 <p className="text-xs text-[#8A8478] mt-0.5 max-w-[540px] leading-relaxed">
 Cấu hình mô hình doanh thu, định giá niêm yết và quản lý các chiến lược mã giảm giá khuyến mãi cho khóa học của bạn trên sàn MindNova AI.
 </p>
 </div>
 <button
 type="button"
 id="btn-save-pricing"
 onClick={onSave}
 className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#C0392B] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer shrink-0"
 >
 <SaveIcon size={14} />
 <span>Lưu thiết lập</span>
 </button>
 </div>
 </div>
 );
}

function SaveToast({ visible }: { visible: boolean }) {
 return (
 <div
 className={twMerge(
 "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-lg transition-all duration-300",
 visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
 )}
 >
 
 Đã cập nhật chiến lược định giá thành công!
 </div>
 );
}

export function PricingContainer({ courseId }: { courseId?: string }) {
 const [activeTab, setActiveTab] = useState<TabId>("pricing");
 const [toastVisible, setToastVisible] = useState(false);

 const [basePrice, setBasePrice] = useState("1200000");
 const [salePrice, setSalePrice] = useState("");
 const [isFlashSale, setIsFlashSale] = useState(false);
 const [saleStartDate, setSaleStartDate] = useState("");
 const [saleEndDate, setSaleEndDate] = useState("");

 const { data: course, isLoading } = useInstructorCourse(courseId || "1");
 const updateCoursePrice = useUpdateCoursePrice();

 useEffect(() => {
 if (course) {
 setBasePrice(course.price ? course.price.toString() : "1200000");
 setIsFlashSale(course.is_flash_sale || false);
 setSalePrice(course.sale_price ? course.sale_price.toString() : "");
 
 if (course.sale_start_date) {
 setSaleStartDate(new Date(course.sale_start_date).toISOString().split('T')[0]);
 }
 
 if (course.sale_end_date) {
 setSaleEndDate(new Date(course.sale_end_date).toISOString().split('T')[0]);
 }
 }
 }, [course]);

 const handleSave = () => {
 updateCoursePrice.mutate(
 {
 courseId: courseId || "1",
 price: Number(basePrice.replace(/\D/g, "")),
 is_flash_sale: isFlashSale,
 sale_price: salePrice ? Number(salePrice.replace(/\D/g, "")) : undefined,
 sale_start_date: saleStartDate || undefined,
 sale_end_date: saleEndDate || undefined,
 },
 {
 onSuccess: () => {
 setToastVisible(true);
 setTimeout(() => setToastVisible(false), 2800);
 }
 }
 );
 };

 return (
 <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#F4F4F8]">
 {/* Sticky page header & tab bar */}
 <div className="sticky top-0 z-10 bg-white shadow-2xs">
 <PageHeader onSave={handleSave} />
 <PageTabs active={activeTab} onChange={setActiveTab} />
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto px-6 py-8">
 {activeTab === "pricing" && (
 <div className="max-w-[900px] mx-auto flex flex-col gap-6 pb-12 animate-fadeIn">
 <PricingModelSection
 basePrice={basePrice} setBasePrice={setBasePrice}
 salePrice={salePrice} setSalePrice={setSalePrice}
 isFlashSale={isFlashSale} setIsFlashSale={setIsFlashSale}
 saleStartDate={saleStartDate} setSaleStartDate={setSaleStartDate}
 saleEndDate={saleEndDate} setSaleEndDate={setSaleEndDate}
 />
 <CouponSection />
 </div>
 )}

 {activeTab === "content" && (
 <div className="max-w-[900px] mx-auto flex items-center justify-center py-24 text-gray-400 font-bold text-xs">
 Danh sách bài giảng và nội dung học liệu AI sẽ hiển thị tại tab này.
 </div>
 )}

 {activeTab === "students" && (
 <div className="max-w-[900px] mx-auto flex items-center justify-center py-24 text-gray-400 font-bold text-xs">
 Báo cáo chuyên sâu và danh sách học viên đăng ký khóa học sẽ hiển thị tại đây.
 </div>
 )}
 </div>

 <SaveToast visible={toastVisible} />
 </div>
 );
}