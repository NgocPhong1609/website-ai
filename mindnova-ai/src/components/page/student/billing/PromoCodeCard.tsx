"use client";

import { useCallback, useState } from "react";
import { useCouponValidation } from "@/src/hooks/useCouponValidation";

// ─── Status UI Config ─────────────────────────────────────────────────────────

import type { CouponStatus } from "@/src/hooks/useCouponValidation";

const STATUS_STYLES: Partial<Record<CouponStatus, { text: string; icon: string; className: string }>> = {
  APPLIED:        { text: "Applied!", icon: "✓", className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  EXPIRED:        { text: "Expired",  icon: "✕", className: "text-red-500 bg-red-50 border-red-200" },
  LIMIT_REACHED:  { text: "Limit reached", icon: "✕", className: "text-red-500 bg-red-50 border-red-200" },
  NOT_APPLICABLE: { text: "Not applicable", icon: "!", className: "text-amber-600 bg-amber-50 border-amber-200" },
  INVALID:        { text: "Invalid",  icon: "✕", className: "text-red-500 bg-red-50 border-red-200" },
};

// ─── Component ────────────────────────────────────────────────────────────────
// 'use client' — uses interaction hooks. Logic in useCouponValidation.

export function PromoCodeCard() {
  const { code, validationResult, isValidating, setCode, applyCode, reset } =
    useCouponValidation({ courseId: "all" });

  const statusConfig = validationResult ? STATUS_STYLES[validationResult.status] : null;

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] p-5 flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#6B6BFF]/10 text-[#6B6BFF]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </span>
        <h2 className="text-sm font-bold text-[#1A1A2E]">Discount Code</h2>
      </div>

      <p className="text-xs text-[#84849A] leading-relaxed -mt-2">
        Apply a coupon code. Validation checks expiry, usage limits, and applicability simultaneously.
      </p>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          id="promo-code-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") applyCode(); }}
          placeholder="Enter promo code"
          disabled={isValidating || validationResult?.status === "APPLIED"}
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-sm font-mono text-[#1A1A2E] bg-[#F6F6FB] border border-[#EAEAF4] placeholder-[#B0B0C8] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white disabled:opacity-60 transition-all duration-200"
        />
        {validationResult?.status === "APPLIED" ? (
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF]/30 bg-white hover:bg-[#F5F5FF] transition-all shrink-0"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={applyCode}
            disabled={isValidating || !code.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:shadow-[0_4px_14px_rgba(107,107,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 shrink-0"
          >
            {isValidating ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
                Verifying...
              </span>
            ) : "Apply"}
          </button>
        )}
      </div>

      {/* Feedback */}
      {validationResult && statusConfig && (
        <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${statusConfig.className}`}>
          <span className="shrink-0">{statusConfig.icon}</span>
          <span>{validationResult.message}</span>
          {validationResult.discountPercent && (
            <span className="ml-auto font-extrabold text-emerald-700 shrink-0">
              -{validationResult.discountPercent}%
            </span>
          )}
        </div>
      )}

      {/* DB Lock indicator during validation */}
      {isValidating && (
        <p className="text-[10px] text-[#A0A0C0] text-center">
          Acquiring database lock to prevent race conditions...
        </p>
      )}
    </div>
  );
}
