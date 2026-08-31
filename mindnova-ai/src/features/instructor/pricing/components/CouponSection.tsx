"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { NoData } from "@/src/shared/components/ui/NoData";
import { GiftIcon, PlusCircleIcon, PencilIcon, TrashIcon, SparklesIcon, XIcon, CheckCircleIcon } from "./icons";
import { useCoupons, Coupon } from "../hooks/useCoupons";
import { Loader } from "@/src/shared/components/ui/Loader";

// ------------------------------------------------------------------------------------------------
// StatusBadge
// ------------------------------------------------------------------------------------------------
function StatusBadge({ status }: { status: "active" | "disabled" | "expired" }) {
 if (status === "active") {
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold -[#2C3039] bg-emerald-50 border -[#FAF7F2]">
 <span className="w-1.5 h-1.5 rounded-full -[#2C3039]" />
 Đang chạy
 </span>
 );
 }
 if (status === "expired") {
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-[#8A8478] bg-[#E8E2D9] border border-[#E8E2D9]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#8A8478]" />
 Đã hết hạn
 </span>
 );
 }
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
 Đã vô hiệu
 </span>
 );
}

// ------------------------------------------------------------------------------------------------
// CreateCouponDialog
// ------------------------------------------------------------------------------------------------
function CreateCouponDialog({
 onClose,
 onCreate,
}: {
 onClose: () => void;
 onCreate: (c: Partial<Coupon>) => Promise<void>;
}) {
 const [code, setCode] = useState("");
 const [type, setType] = useState<"percent" | "fixed">("percent");
 const [value, setValue] = useState("");
 const [total, setTotal] = useState("100");
 const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!code.trim() || !value.trim()) return;
 setIsSubmitting(true);
 try {
 await onCreate({
 code: code.trim().toUpperCase(),
 type,
 value: value,
 max_uses: Number(total) || null,
 status: "active",
 });
 onClose();
 } catch (err) {
 console.error(err);
 alert("Lỗi khi tạo mã: " + err);
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <>
 <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
 <div className="pointer-events-auto w-full max-w-[420px] bg-white rounded-2xl border border-[#E8E2D9] shadow-[0_20px_60px_rgba(70,72,212,0.15)] overflow-hidden">
 <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
 <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#C0392B] flex items-center justify-center">
 <GiftIcon size={15} />
 </div>
 <div className="flex-1">
 <h3 className="text-[14px] font-bold text-[#2C3039]">Tạo mã giảm giá</h3>
 <p className="text-[11px] text-[#8A8478]">Tạo mã ưu đãi cho khóa học của bạn</p>
 </div>
 <button type="button" onClick={onClose} className="w-7 h-7 rounded-lg text-[#8A8478] hover:bg-[#E8E2D9] hover:text-[#2C3039] flex items-center justify-center"></button>
 </div>
 <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
 <div className="flex flex-col gap-1.5">
 <label className="text-[12px] font-semibold text-[#464554]">Mã code</label>
 <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="VD: SUMMER2025" required className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm font-mono text-[#2C3039] focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/15 outline-none" />
 </div>
 <div className="flex flex-col gap-1.5">
 <span className="text-[12px] font-semibold text-[#464554]">Loại giảm giá</span>
 <div className="grid grid-cols-2 gap-2">
 {(["percent", "fixed"] as const).map((t) => (
 <button key={t} type="button" onClick={() => setType(t)} className={twMerge("py-2 rounded-xl border text-[12px] font-semibold", type === t ? "border-[#E8E2D9] bg-[#F5F3FF] text-[#C0392B]" : "border-[#E8E2D9] text-[#8A8478]")}>
 {t === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}
 </button>
 ))}
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="flex flex-col gap-1.5">
 <label className="text-[12px] font-semibold text-[#464554]">Giá trị</label>
 <div className="flex rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#E8E2D9] focus-within:ring-2 focus-within:ring-[#C0392B]/15">
 <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required min="0" className="flex-1 h-10 px-3 text-sm text-[#2C3039] bg-transparent outline-none" />
 <span className="h-10 flex items-center px-2.5 text-[11px] font-bold text-[#C0392B] border-l border-[#DDDDF0] bg-[#F0F0FF]">{type === "percent" ? "%" : "VNĐ"}</span>
 </div>
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-[12px] font-semibold text-[#464554]">Số lượng tối đa</label>
 <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} min="1" className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#2C3039] focus:border-[#E8E2D9] outline-none" />
 </div>
 </div>
 <div className="flex gap-2 pt-1">
 <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 h-10 rounded-xl border border-[#E8E2D9] text-sm text-[#8A8478] hover:bg-[#E8E2D9]">Hủy</button>
 <button type="submit" disabled={isSubmitting} className="flex-1 h-10 rounded-xl bg-[#C0392B] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(70,72,212,0.35)] disabled:opacity-50">
 {isSubmitting ? "Đang tạo..." : "Tạo mã"}
 </button>
 </div>
 </form>
 </div>
 </div>
 </>
 );
}

// ------------------------------------------------------------------------------------------------
// CouponRow
// ------------------------------------------------------------------------------------------------
function CouponRow({ coupon, onDelete, onToggleStatus }: { coupon: Coupon; onDelete: (id: number) => void; onToggleStatus: (id: number, s: string) => void }) {
 return (
 <tr className="group hover:bg-[#FAFAFE] transition-colors duration-100">
 <td className="px-4 py-3 text-left">
 <span className="font-mono text-[13px] font-bold text-[#C0392B] bg-[#EEF0FF] px-2 py-0.5 rounded-md">{coupon.code}</span>
 </td>
 <td className="px-4 py-3 text-[12px] text-[#464554]">{coupon.type === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}</td>
 <td className="px-4 py-3 text-[13px] font-semibold text-[#2C3039]">{coupon.value}</td>
 <td className="px-4 py-3 text-[12px] text-[#464554]">
 <span className="font-semibold text-[#2C3039]">{coupon.used_count}</span>
 <span className="text-[#8A8478]">/{coupon.max_uses || '∞'}</span>
 </td>
 <td className="px-4 py-3"><StatusBadge status={coupon.status} /></td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
 <button type="button" onClick={() => onToggleStatus(coupon.id, coupon.status === 'active' ? 'disabled' : 'active')} className="px-2 py-1 text-[10px] font-bold rounded-lg -[#C0392B] bg-indigo-50 hover:-[#FAF7F2] transition-colors">
 {coupon.status === 'active' ? 'Tắt' : 'Bật'}
 </button>
 <button type="button" aria-label={`Xóa mã ${coupon.code}`} onClick={() => { if(confirm('Xác nhận xóa?')) onDelete(coupon.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8478] hover:text-red-500 hover:bg-red-50 transition-all duration-150">
 <TrashIcon size={13} />
 </button>
 </div>
 </td>
 </tr>
 );
}

// ------------------------------------------------------------------------------------------------
// CouponSection
// ------------------------------------------------------------------------------------------------
export function CouponSection({ courseId }: { courseId?: string } = {}) {
 const { coupons, isLoading, error, createCoupon, deleteCoupon, toggleStatus } = useCoupons();
 const [showDialog, setShowDialog] = useState(false);

 return (
 <>
 <div className="rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden min-h-[200px]">
 {/* Header */}
 <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
 <div className="flex items-center gap-2 flex-1">
 <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#C0392B] flex items-center justify-center"><GiftIcon size={14} /></span>
 <div>
 <p className="text-[14px] font-bold text-[#2C3039]">Quản lý mã giảm giá</p>
 <p className="text-[11px] text-[#8A8478]">Tạo mã ưu đãi để thúc đẩy doanh số bán hàng trong các dịp đặc biệt.</p>
 </div>
 </div>
 <button type="button" onClick={() => setShowDialog(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#C0392B] bg-[#EEF0FF] border border-[#D5D5FF] hover:bg-[#FAF7F2] hover:text-white transition-all duration-200">
 <PlusCircleIcon size={13} /> Tạo mã mới
 </button>
 </div>

 {/* Table */}
 <div className="overflow-x-auto relative">
 {isLoading && (
 <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
 <Loader size="sm" />
 </div>
 )}
 {error && (
 <div className="p-4 text-xs font-bold text-red-500 text-center bg-red-50">{error}</div>
 )}
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
 {["Mã Code", "Loại Giảm", "Giá Trị", "Số Lượng", "Trạng Thái", "Thao Tác"].map((col) => (
 <th key={col} className="px-4 py-2.5 text-[11px] font-bold text-[#8A8478] tracking-wide uppercase whitespace-nowrap">{col}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-[#E8E2D9]">
 {coupons.map((c) => (
 <CouponRow key={c.id} coupon={c} onDelete={deleteCoupon} onToggleStatus={toggleStatus} />
 ))}
 {coupons.length === 0 && !isLoading && (
 <tr>
 <td colSpan={6} className="p-0">
 <NoData title="Chưa có mã giảm giá" description="Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!" className="py-12" />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 {showDialog && <CreateCouponDialog onClose={() => setShowDialog(false)} onCreate={createCoupon} />}
 </>
 );
}