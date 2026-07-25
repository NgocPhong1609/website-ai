"use client";

import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { PromoCodeCard } from "./PromoCodeCard";
import { UpcomingPaymentCard } from "./UpcomingPaymentCard";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { BillingFooter } from "./BillingFooter";

// ─── Search Bar ───────────────────────────────────────────────────────────────

function BillingSearchBar() {
  return (
    <div className="relative max-w-xs">
      <div className="absolute inset-y-0 left-3.5 flex items-center text-[#B0B0C8] pointer-events-none">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <input
        id="billing-search"
        type="search"
        placeholder="Search invoices or courses…"
        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-[#F6F6FB] border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 focus:bg-white transition-all duration-200"
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BillingContainer() {
  return (
    <div className="flex flex-col gap-6 px-6 py-6 h-full">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131B2E] leading-tight tracking-tight">
            Billing &amp; Payments
          </h1>
          <p className="text-sm text-[#84849A] mt-1">
            Manage your subscriptions, payment methods, and transaction history.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#6B6BFF] border border-[#6B6BFF]/30 bg-white hover:bg-[#F5F5FF] transition-all duration-150"
          >
            Update Tax Info
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.4)] hover:shadow-[0_6px_22px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Change Plan
          </button>
        </div>
      </div>

      {/* ── Top 3-column card grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PaymentMethodsCard />
        <PromoCodeCard />
        <UpcomingPaymentCard />
      </div>

      {/* ── Transaction History ───────────────────────────────────────────── */}
      <TransactionHistoryTable />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <BillingFooter />
    </div>
  );
}
