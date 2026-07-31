"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { GiftIcon, PlusCircleIcon, PencilIcon, TrashIcon } from "./icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percent" | "fixed";
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    discount: 20,
    type: "percent",
    expiresAt: "2026-12-31",
    usageLimit: 100,
    usedCount: 34,
  },
  {
    id: "2",
    code: "SAVE50K",
    discount: 50000,
    type: "fixed",
    expiresAt: "2026-09-01",
    usageLimit: 50,
    usedCount: 12,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function CouponSection({ courseId: _courseId }: { courseId?: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed">("percent");

  const handleAdd = () => {
    if (!newCode.trim() || !newDiscount) return;
    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCode.trim().toUpperCase(),
      discount: Number(newDiscount),
      type: newType,
      expiresAt: "",
      usageLimit: 100,
      usedCount: 0,
    };
    setCoupons((prev) => [...prev, coupon]);
    setNewCode("");
    setNewDiscount("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#4648D4]">
            <GiftIcon size={18} />
          </span>
          <h3 className="text-[15px] font-bold text-[#1A1A2E]">Mã giảm giá</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#4648D4] bg-[#EEF0FF] hover:bg-[#E0E3FF] transition-colors"
        >
          <PlusCircleIcon size={14} />
          Thêm mã
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#F8F8FC] border border-[#EAEAF4]">
          <div className="flex gap-3">
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Tên mã (VD: SUMMER30)"
              className="flex-1 h-9 rounded-lg border border-[#EAEAF4] bg-white px-3 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none focus:border-[#6B6BFF]"
            />
            <input
              type="number"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              placeholder="Giá trị"
              className="w-24 h-9 rounded-lg border border-[#EAEAF4] bg-white px-3 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none focus:border-[#6B6BFF]"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "percent" | "fixed")}
              className="h-9 rounded-lg border border-[#EAEAF4] bg-white px-2 text-sm text-[#1A1A2E] outline-none focus:border-[#6B6BFF]"
            >
              <option value="percent">%</option>
              <option value="fixed">VNĐ</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-sm text-[#64647A] border border-[#EAEAF4] hover:bg-[#F4F4FA] transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-[#4648D4] hover:bg-[#3A3CB8] transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {/* Coupon list */}
      {coupons.length === 0 ? (
        <p className="text-[13px] text-[#B0B0C8] text-center py-4">Chưa có mã giảm giá nào.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#EAEAF4] bg-[#F8F8FC]"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-lg bg-[#EEF0FF] text-[#4648D4] text-[12px] font-bold tracking-wider">
                  {coupon.code}
                </span>
                <span className={twMerge(
                  "text-[13px] font-semibold",
                  coupon.type === "percent" ? "text-[#16A34A]" : "text-[#2563EB]"
                )}>
                  -{coupon.type === "percent" ? `${coupon.discount}%` : `${coupon.discount.toLocaleString()}đ`}
                </span>
                <span className="text-[11px] text-[#B0B0C8]">
                  {coupon.usedCount}/{coupon.usageLimit} lượt
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#EAEAF4] text-[#9090B0] transition-colors"
                  aria-label="Sửa mã"
                >
                  <PencilIcon size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(coupon.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#9090B0] hover:text-red-500 transition-colors"
                  aria-label="Xóa mã"
                >
                  <TrashIcon size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
