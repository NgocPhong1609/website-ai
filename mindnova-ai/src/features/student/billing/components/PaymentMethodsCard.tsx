"use client";

import React, { useState } from "react";
import { NoData } from "@/src/shared/components/ui/NoData";
import { PAYMENT_CARDS } from "../constants";
import type { PaymentCard } from "../types";
import { PlusIcon, TrashIcon } from "./icons";

// ─── Card Brand Logos ─────────────────────────────────────────────────────────

function VisaLogo() {
  return (
    <div className="flex items-center justify-center w-11 h-7 bg-[#1A1F71] rounded-lg shrink-0 shadow-2xs">
      <span className="text-white text-[10px] font-extrabold tracking-widest italic select-none">VISA</span>
    </div>
  );
}

function MastercardLogo() {
  return (
    <div className="flex items-center justify-center w-11 h-7 rounded-lg shrink-0 overflow-hidden bg-gray-800 shadow-2xs">
      <div className="relative w-6 h-4">
        <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#EB001B] opacity-90" />
        <div className="absolute right-0 top-0 w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-2 h-4 bg-[#FF5F00] opacity-80 rounded-sm" />
      </div>
    </div>
  );
}

// ─── Single Card Row ──────────────────────────────────────────────────────────

interface CardRowProps {
  card: PaymentCard;
  onRemove: (id: string) => void;
}

function CardRow({ card, onRemove }: CardRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-3.5 rounded-xl border border-[#EAEAF4] bg-[#F8FAFC]/60 hover:bg-white hover:border-[#6B6BFF]/30 transition-all duration-200 shadow-2xs group">
      <div className="flex items-center gap-3.5 min-w-0">
        {card.brand === "visa" ? <VisaLogo /> : <MastercardLogo />}

        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold text-[#1A1A2E] tracking-normal">
              Thẻ {card.brand === "visa" ? "Visa" : "Mastercard"} •••• {card.last4}
            </span>
            {card.isDefault && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#5052EE] bg-[#EEF2FF] border border-[#5052EE]/25 shrink-0">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-xs font-normal text-[#64647A]">
            Hết hạn: <span className="font-medium text-[#4A4A68]">{card.expiry}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Xóa thẻ kết thúc bằng số ${card.last4}`}
        onClick={() => onRemove(card.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0B8] hover:text-[#EF4444] hover:bg-[#FEE2E2]/70 transition-all duration-150 cursor-pointer opacity-75 group-hover:opacity-100"
        title="Xóa thẻ liên kết"
      >
        <TrashIcon size={15} />
      </button>
    </div>
  );
}

// ─── Payment Methods Card ─────────────────────────────────────────────────────

export function PaymentMethodsCard() {
  const [cards, setCards] = useState<PaymentCard[]>(PAYMENT_CARDS);

  function handleRemove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddNew() {
    alert("Hệ thống kết nối luồng thêm thẻ an toàn SSL 256-bit qua cổng Napas & Quốc tế.");
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
      {/* Header with integrated trust badge */}
      <div className="flex items-center justify-between gap-4 border-b border-[#F0F2FA] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#1A1A2E] flex items-center gap-2">
            <span>Phương thức Thanh toán</span>
            <span className="text-[11px] font-medium text-[#10B981] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#10B981]/20">
              🛡️ PCI-DSS
            </span>
          </h2>
          <p className="text-xs font-normal text-[#7878A0] mt-1">
            Quản lý các thẻ tín dụng &amp; ghi nợ liên kết tự động thanh toán học phí.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5052EE] bg-[#EEF2FF] hover:bg-[#E2E6FF] border border-[#5052EE]/20 transition-all duration-150 cursor-pointer shrink-0"
        >
          <PlusIcon size={13} />
          <span>Thêm thẻ mới</span>
        </button>
      </div>

      {/* Compact, well-spaced card list without vertical void gap */}
      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <CardRow key={card.id} card={card} onRemove={handleRemove} />
        ))}
        {cards.length === 0 && (
          <NoData title="Chưa có thẻ" description="Chưa có thẻ nào được liên kết trong hệ thống của bạn." className="bg-[#F8FAFC] rounded-xl border border-[#EAEAF4] py-6" />
        )}
      </div>
    </div>
  );
}
