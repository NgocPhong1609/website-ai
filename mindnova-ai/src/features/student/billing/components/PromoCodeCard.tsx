"use client";

import { useState } from "react";
import { SparkleIcon } from "./icons";

// ─── Promo Code Card ──────────────────────────────────────────────────────────

export function PromoCodeCard() {
  const [code, setCode] = useState("NOVA2024");
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
    setTimeout(() => setApplied(false), 3000);
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] p-5 flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#6B6BFF]/10 text-[#6B6BFF]">
          <SparkleIcon size={13} />
        </span>
        <h2 className="text-sm font-bold text-[#1A1A2E]">Promo Code</h2>
      </div>

      <p className="text-xs text-[#84849A] leading-relaxed -mt-2">
        Have a discount code? Apply it to your next billing cycle.
      </p>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          id="promo-code-input"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
            setApplied(false);
          }}
          placeholder="Enter promo code"
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-sm text-[#1A1A2E] bg-[#F6F6FB] border border-[#EAEAF4] placeholder-[#B0B0C8] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
        />
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:shadow-[0_4px_14px_rgba(107,107,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
        >
          {applied ? "✓" : "Apply"}
        </button>
      </div>

      {/* Feedback */}
      {applied && (
        <p className="text-xs font-semibold text-emerald-600 -mt-2">
          🎉 Promo code applied successfully!
        </p>
      )}
      {error && (
        <p className="text-xs font-semibold text-red-500 -mt-2">
          Please enter a valid promo code.
        </p>
      )}
    </div>
  );
}
