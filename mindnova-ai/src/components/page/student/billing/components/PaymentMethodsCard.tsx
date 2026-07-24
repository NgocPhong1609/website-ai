"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PAYMENT_CARDS } from "../constants";
import type { PaymentCard } from "../types";
import { PlusIcon, TrashIcon } from "./icons";

// ─── Card Brand Logos ─────────────────────────────────────────────────────────

function VisaLogo() {
  return (
    <div className="flex items-center justify-center w-10 h-6 bg-[#1A1F71] rounded-md shrink-0">
      <span className="text-white text-[9px] font-black tracking-widest italic">VISA</span>
    </div>
  );
}

function MastercardLogo() {
  return (
    <div className="flex items-center justify-center w-10 h-6 rounded-md shrink-0 overflow-hidden bg-gray-800">
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
    <div className="flex items-center gap-3 py-2.5 px-1 group">
      {card.brand === "visa" ? <VisaLogo /> : <MastercardLogo />}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1A1A2E] tracking-wider">
            •••• {card.last4}
          </span>
          {card.isDefault && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-[#6B6BFF] leading-none">
              DEFAULT
            </span>
          )}
        </div>
        <p className="text-xs text-[#9090B0] mt-0.5">Expires {card.expiry}</p>
      </div>

      <button
        type="button"
        aria-label={`Remove card ending in ${card.last4}`}
        onClick={() => onRemove(card.id)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-[#C0C0D0] hover:text-red-500 hover:bg-red-50 transition-all duration-150"
      >
        <TrashIcon size={13} />
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

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] p-5 flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1A1A2E]">Payment Methods</h2>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors duration-150"
        >
          <PlusIcon size={12} />
          Add New
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-col divide-y divide-[#F4F4FA]">
        {cards.map((card) => (
          <CardRow key={card.id} card={card} onRemove={handleRemove} />
        ))}
        {cards.length === 0 && (
          <p className="text-sm text-[#B0B0C8] py-3 text-center">
            No payment methods added.
          </p>
        )}
      </div>
    </div>
  );
}
