"use client";

// ─── CouponSection ────────────────────────────────────────────────────────────
// Quản lý mã giảm giá — hiển thị table + dialog tạo mã mới.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GiftIcon, PlusCircleIcon, PencilIcon, TrashIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponStatus = "active" | "expired";
type DiscountType = "percent" | "fixed";

interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: string;
  used: number;
  total: number;
  status: CouponStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "MINDNOVA20", type: "percent",  value: "20%",         used: 45, total: 100, status: "active"  },
  { id: "c2", code: "SUMMERAI",   type: "fixed",    value: "200.000 VNĐ", used: 12, total: 50,  status: "active"  },
  { id: "c3", code: "EARLYBIRD",  type: "percent",  value: "35%",         used: 50, total: 50,  status: "expired" },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CouponStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-[#F0F0F8] text-[#9090B0]",
      )}
    >
      <span
        className={twMerge(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-[#C0C0D8]",
        )}
      />
      {isActive ? "Đang hoạt động" : "Đã kết thúc"}
    </span>
  );
}

// ─── Create Coupon Dialog ─────────────────────────────────────────────────────

interface CreateDialogProps {
  onClose: () => void;
  onAdd: (coupon: Coupon) => void;
}

function CreateCouponDialog({ onClose, onAdd }: CreateDialogProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("percent");
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value.trim()) return;
    onAdd({
      id: `c${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: type === "percent" ? `${value}%` : `${value} VNĐ`,
      used: 0,
      total: Number(total) || 100,
      status: "active",
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label="Tạo mã giảm giá mới"
          className="pointer-events-auto w-full max-w-[420px] bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_20px_60px_rgba(70,72,212,0.15)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
              <GiftIcon size={15} />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-[#1A1A2E]">Tạo mã giảm giá</h3>
              <p className="text-[11px] text-[#9090B0]">Tạo mã ưu đãi cho khóa học của bạn</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="w-7 h-7 rounded-lg text-[#9090B0] hover:bg-[#F4F4FA] hover:text-[#1A1A2E] flex items-center justify-center transition-all duration-150"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="coupon-code" className="text-[12px] font-semibold text-[#464554]">
                Mã code
              </label>
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: SUMMER2025"
                required
                className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm font-mono text-[#1A1A2E] placeholder:text-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-[#464554]">Loại giảm giá</span>
              <div className="grid grid-cols-2 gap-2">
                {(["percent", "fixed"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={twMerge(
                      "py-2 rounded-xl border text-[12px] font-semibold transition-all duration-150",
                      type === t
                        ? "border-[#6B6BFF] bg-[#F5F3FF] text-[#4648D4]"
                        : "border-[#EAEAF4] text-[#9090B0] hover:border-[#C5C6FF]",
                    )}
                  >
                    {t === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Value + Total */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="coupon-value" className="text-[12px] font-semibold text-[#464554]">
                  Giá trị
                </label>
                <div className="flex rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] overflow-hidden focus-within:border-[#6B6BFF] focus-within:ring-2 focus-within:ring-[#6B6BFF]/15">
                  <input
                    id="coupon-value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0"
                    required
                    min="0"
                    className="flex-1 h-10 px-3 text-sm text-[#1A1A2E] bg-transparent focus:outline-none"
                  />
                  <span className="h-10 flex items-center px-2.5 text-[11px] font-bold text-[#4648D4] border-l border-[#DDDDF0] bg-[#F0F0FF]">
                    {type === "percent" ? "%" : "VNĐ"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="coupon-total" className="text-[12px] font-semibold text-[#464554]">
                  Số lượng tối đa
                </label>
                <input
                  id="coupon-total"
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  min="1"
                  className="h-10 px-3 rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] text-sm text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/15 transition-all duration-150"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-[#EAEAF4] text-sm text-[#64647A] hover:bg-[#F4F4FA] transition-all duration-150"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Tạo mã
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Coupon Table Row ─────────────────────────────────────────────────────────

function CouponRow({
  coupon,
  onDelete,
}: {
  coupon: Coupon;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="group hover:bg-[#FAFAFE] transition-colors duration-100">
      <td className="px-4 py-3 text-left">
        <span className="font-mono text-[13px] font-bold text-[#4648D4] bg-[#EEF0FF] px-2 py-0.5 rounded-md">
          {coupon.code}
        </span>
      </td>
      <td className="px-4 py-3 text-[12px] text-[#464554]">
        {coupon.type === "percent" ? "Phần trăm (%)" : "Cố định (đ)"}
      </td>
      <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1A2E]">
        {coupon.value}
      </td>
      <td className="px-4 py-3 text-[12px] text-[#464554]">
        <span className="font-semibold text-[#1A1A2E]">{coupon.used}</span>
        <span className="text-[#9090B0]">/{coupon.total}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={coupon.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            aria-label={`Sửa mã ${coupon.code}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-[#4648D4] hover:bg-[#EEF0FF] transition-all duration-150"
          >
            <PencilIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={`Xóa mã ${coupon.code}`}
            onClick={() => onDelete(coupon.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <TrashIcon size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function CouponSection() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showDialog, setShowDialog] = useState(false);

  const handleAdd = (c: Coupon) => setCoupons((prev) => [c, ...prev]);
  const handleDelete = (id: string) =>
    setCoupons((prev) => prev.filter((c) => c.id !== id));

  return (
    <>
      <div className="rounded-2xl border border-[#EAEAF4] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F8]">
          <div className="flex items-center gap-2 flex-1">
            <span className="w-6 h-6 rounded-md bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center">
              <GiftIcon size={14} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#1A1A2E]">Quản lý mã giảm giá</p>
              <p className="text-[11px] text-[#9090B0]">
                Tạo mã ưu đãi để thúc đẩy doanh số bán hàng trong các dịp đặc biệt.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-create-coupon"
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#4648D4] bg-[#EEF0FF] border border-[#D5D5FF] hover:bg-[#6B6BFF] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(107,107,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30"
          >
            <PlusCircleIcon size={13} />
            Tạo mã mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAFE] border-b border-[#F0F0F8]">
                {["Mã Code", "Loại Giảm", "Giá Trị", "Số Lượng", "Trạng Thái", "Thao Tác"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 text-[11px] font-bold text-[#9090B0] tracking-wide uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4FA]">
              {coupons.map((c) => (
                <CouponRow key={c.id} coupon={c} onDelete={handleDelete} />
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-[#B0B0C8]">
                    Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDialog && (
        <CreateCouponDialog
          onClose={() => setShowDialog(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
