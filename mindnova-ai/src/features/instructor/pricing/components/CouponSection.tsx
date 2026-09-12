"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { NoData } from "@/src/shared/components/ui/NoData";
import { GiftIcon, PlusCircleIcon, TrashIcon } from "./icons";
import { useCoupons, Coupon } from "../hooks/useCoupons";
import { Loader } from "@/src/shared/components/ui/Loader";

// ------------------------------------------------------------------------------------------------
// StatusBadge
// ------------------------------------------------------------------------------------------------
function StatusBadge({ status }: { status: "active" | "disabled" | "expired" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        Đang chạy
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-[#64748B] bg-[#E2E8F0] border border-[#E2E8F0]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
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

// Helper to format date strings into DD/MM/YYYY
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "";
  }
}

// ------------------------------------------------------------------------------------------------
// CreateCouponDialog
// ------------------------------------------------------------------------------------------------
function CreateCouponDialog({
  onClose,
  onCreate,
  currentCourseId,
}: {
  onClose: () => void;
  onCreate: (c: Partial<Coupon>) => Promise<void>;
  currentCourseId?: string | number;
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("100");
  const [scope, setScope] = useState<"this_course" | "all_courses">(currentCourseId ? "this_course" : "all_courses");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value.trim()) return;

    if (startsAt && expiresAt && new Date(startsAt) > new Date(expiresAt)) {
      alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        code: code.trim().toUpperCase(),
        type,
        value: value,
        max_uses: Number(total) || null,
        status: "active",
        course_id: scope === "this_course" && currentCourseId ? Number(currentCourseId) : null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
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
        <div className="pointer-events-auto w-full max-w-[460px] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_20px_60px_rgba(70,72,212,0.15)] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <GiftIcon size={15} />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-[#0F172A]">Tạo mã giảm giá</h3>
              <p className="text-[11px] text-[#64748B]">Tạo mã ưu đãi và thiết lập thời hạn khuyến mãi</p>
            </div>
            <button type="button" onClick={onClose} className="w-7 h-7 rounded-lg text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A] flex items-center justify-center cursor-pointer">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 max-h-[85vh] overflow-y-auto">
            {/* Mã Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#475569]">Mã code</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="VD: SUMMER2025" required className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm font-mono text-[#0F172A] focus:border-[#E2E8F0] focus:ring-2 focus:ring-[#3B82F6]/15 outline-none uppercase" />
            </div>

            {/* Phạm vi áp dụng */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#475569]">Phạm vi áp dụng</span>
              <div className="flex flex-col gap-2">
                {currentCourseId && (
                  <label className={twMerge(
                    "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-xs font-semibold",
                    scope === "this_course" ? "border-[#3B82F6] bg-[#F8FAFC] text-[#3B82F6]" : "border-[#E2E8F0] text-[#475569]"
                  )}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === "this_course"}
                      onChange={() => setScope("this_course")}
                      className="text-[#3B82F6]"
                    />
                    <span>Chỉ áp dụng cho khóa học này (Khóa #{currentCourseId})</span>
                  </label>
                )}
                <label className={twMerge(
                  "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-xs font-semibold",
                  scope === "all_courses" ? "border-[#3B82F6] bg-[#F8FAFC] text-[#3B82F6]" : "border-[#E2E8F0] text-[#475569]"
                )}>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === "all_courses"}
                    onChange={() => setScope("all_courses")}
                    className="text-[#3B82F6]"
                  />
                  <span>Tất cả các khóa học của tôi</span>
                </label>
              </div>
            </div>

            {/* Loại giảm giá */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#475569]">Loại giảm giá</span>
              <div className="grid grid-cols-2 gap-2">
                {(["percent", "fixed"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)} className={twMerge("py-2 rounded-xl border text-[12px] font-semibold cursor-pointer", type === t ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#3B82F6]" : "border-[#E2E8F0] text-[#64748B]")}>
                    {t === "percent" ? "Phần trăm (%)" : "Cố định (VNĐ)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Giá trị & Số lượng */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#475569]">Giá trị giảm</label>
                <div className="flex rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#E2E8F0] focus-within:ring-2 focus-within:ring-[#3B82F6]/15">
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required min="0" placeholder={type === "percent" ? "VD: 100" : "VD: 50000"} className="flex-1 h-10 px-3 text-sm text-[#0F172A] bg-transparent outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#475569]">Số lượng tối đa</label>
                <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} min="1" className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#0F172A] focus:border-[#E2E8F0] outline-none" />
              </div>
            </div>

            {/* Hạn sử dụng chương trình (Bắt đầu & Kết thúc) */}
            <div className="flex flex-col gap-1.5 border-t border-[#F0F0F8] pt-3">
              <span className="text-[12px] font-bold text-[#0F172A]">📅 Thời gian áp dụng chương trình</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="h-10 px-2.5 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-xs text-[#0F172A] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#64748B]">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="h-10 px-2.5 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-xs text-[#0F172A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 h-10 rounded-xl border border-[#E2E8F0] text-sm text-[#64748B] hover:bg-[#E2E8F0] cursor-pointer">Hủy</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 h-10 rounded-xl bg-[#3B82F6] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(70,72,212,0.35)] disabled:opacity-50 cursor-pointer">
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
  const numVal = Math.round(Number(coupon.value) || 0);
  const formattedValue = coupon.type === "percent"
    ? `${numVal}%`
    : `${numVal.toLocaleString("vi-VN")} VNĐ`;

  const startDateText = formatDate(coupon.starts_at);
  const endDateText = formatDate(coupon.expires_at);
  let timeText = "Không giới hạn";
  if (startDateText && endDateText) {
    timeText = `${startDateText} - ${endDateText}`;
  } else if (startDateText) {
    timeText = `Từ ${startDateText}`;
  } else if (endDateText) {
    timeText = `Đến ${endDateText}`;
  }

  return (
    <tr className="group hover:bg-[#FAFAFE] transition-colors duration-100">
      <td className="px-4 py-3 text-left">
        <span className="font-mono text-[13px] font-bold text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-md">{coupon.code}</span>
      </td>
      <td className="px-4 py-3 text-[12px] text-[#475569]">{coupon.type === "percent" ? "Phần trăm (%)" : "Cố định (VNĐ)"}</td>
      <td className="px-4 py-3 text-[13px] font-extrabold text-[#0F172A]">{formattedValue}</td>
      <td className="px-4 py-3 text-[12px]">
        {coupon.course_id ? (
          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px]">
            Khóa #{coupon.course_id}
          </span>
        ) : (
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
            Tất cả khóa
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-[11px] font-medium text-slate-600">
        {timeText}
      </td>
      <td className="px-4 py-3 text-[12px] text-[#475569]">
        <span className="font-semibold text-[#0F172A]">{coupon.used_count}</span>
        <span className="text-[#64748B]">/{coupon.max_uses || '∞'}</span>
      </td>
      <td className="px-4 py-3"><StatusBadge status={coupon.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button type="button" onClick={() => onToggleStatus(coupon.id, coupon.status === 'active' ? 'disabled' : 'active')} className="px-2 py-1 text-[10px] font-bold rounded-lg text-[#3B82F6] bg-blue-50 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
            {coupon.status === 'active' ? 'Tắt' : 'Bật'}
          </button>
          <button type="button" aria-label={`Xóa mã ${coupon.code}`} onClick={() => { if(confirm('Xác nhận xóa?')) onDelete(coupon.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-150 cursor-pointer">
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
  const { coupons, isLoading, error, createCoupon, deleteCoupon, toggleStatus } = useCoupons(courseId);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden min-h-[200px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
          <div className="flex items-center gap-2 flex-1">
            <span className="w-6 h-6 rounded-md bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center"><GiftIcon size={14} /></span>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A]">Quản lý mã giảm giá</p>
              <p className="text-[11px] text-[#64748B]">Tạo mã ưu đãi để thúc đẩy doanh số bán hàng trong các dịp đặc biệt.</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowDialog(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#3B82F6] bg-[#EFF6FF] border border-[#DBEAFE] hover:bg-[#F8FAFC] hover:text-white transition-all duration-200 cursor-pointer">
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
            <div className="p-4 text-xs font-bold text-[#3B82F6] text-center bg-[#EFF6FF]">{error}</div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
                {["Mã Code", "Loại Giảm", "Giá Trị", "Phạm Vi", "Thời Gian Áp Dụng", "Số Lượng", "Trạng Thái", "Thao Tác"].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-[11px] font-bold text-[#64748B] tracking-wide uppercase whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {coupons.map((c) => (
                <CouponRow key={c.id} coupon={c} onDelete={deleteCoupon} onToggleStatus={toggleStatus} />
              ))}
              {coupons.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="p-0">
                    <NoData title="Chưa có mã giảm giá" description="Chưa có mã giảm giá áp dụng cho khóa học này. Hãy tạo mã mới!" className="py-12" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showDialog && (
        <CreateCouponDialog
          currentCourseId={courseId}
          onClose={() => setShowDialog(false)}
          onCreate={createCoupon}
        />
      )}
    </>
  );
}