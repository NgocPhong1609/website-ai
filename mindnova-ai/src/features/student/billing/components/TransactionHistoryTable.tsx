"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TRANSACTIONS, FILTER_PERIODS } from "../constants";
import type { Transaction, TransactionStatus, FilterPeriod } from "../types";
import { DownloadIcon, FilterIcon, ChevronDownSmall } from "./icons";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Paid:     "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Refunded: "bg-amber-50 text-amber-600 border border-amber-200",
  Pending:  "bg-blue-50 text-blue-600 border border-blue-200",
  Failed:   "bg-red-50 text-red-500 border border-red-200",
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

// ─── Service Icon ─────────────────────────────────────────────────────────────

const SERVICE_COLORS: Record<Transaction["serviceIcon"], string> = {
  course:       "bg-violet-100 text-violet-500",
  subscription: "bg-blue-100 text-blue-500",
  python:       "bg-amber-100 text-amber-500",
};

const SERVICE_LETTERS: Record<Transaction["serviceIcon"], string> = {
  course:       "AI",
  subscription: "MN",
  python:       "Py",
};

function ServiceIcon({ icon }: { icon: Transaction["serviceIcon"] }) {
  return (
    <div
      className={twMerge(
        "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0",
        SERVICE_COLORS[icon],
      )}
    >
      {SERVICE_LETTERS[icon]}
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

interface FilterDropdownProps {
  value: FilterPeriod;
  onChange: (v: FilterPeriod) => void;
}

function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64647A] bg-[#F6F6FB] border border-[#EAEAF4] hover:border-[#6B6BFF]/40 hover:bg-white transition-all duration-150"
      >
        {value}
        <ChevronDownSmall />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-10 w-40 rounded-xl bg-white border border-[#EAEAF4] shadow-[0_8px_24px_rgba(0,0,0,0.10)] py-1 overflow-hidden">
          {FILTER_PERIODS.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => {
                onChange(period as FilterPeriod);
                setOpen(false);
              }}
              className={twMerge(
                "w-full text-left px-3.5 py-2 text-xs font-medium transition-colors duration-100",
                period === value
                  ? "text-[#6B6BFF] bg-[#F5F5FF]"
                  : "text-[#64647A] hover:bg-[#F8F8FC]",
              )}
            >
              {period}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <tr className="group hover:bg-[#F8F8FC] transition-colors duration-100">
      {/* Invoice ID */}
      <td className="px-4 py-3.5 text-xs font-bold text-[#6B6BFF] whitespace-nowrap">
        {tx.invoiceId}
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 text-xs text-[#84849A] whitespace-nowrap">
        {tx.date}
      </td>

      {/* Service */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <ServiceIcon icon={tx.serviceIcon} />
          <span className="text-xs font-medium text-[#1A1A2E] leading-snug">
            {tx.service}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="px-4 py-3.5 text-xs font-bold text-[#1A1A2E] whitespace-nowrap">
        ${tx.amount.toFixed(2)}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <StatusBadge status={tx.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors duration-150"
          >
            <DownloadIcon size={12} />
            Invoice
          </button>
          {tx.canRefund && (
            <button
              type="button"
              className="text-xs font-semibold text-[#9090B0] hover:text-[#1A1A2E] transition-colors duration-150"
            >
              Refund
            </button>
          )}
          {!tx.canRefund && tx.status !== "Refunded" && (
            <span className="text-xs text-[#C0C0D0]">—</span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Transaction History Table ────────────────────────────────────────────────

export function TransactionHistoryTable() {
  const [filter, setFilter] = useState<FilterPeriod>("Last 6 Months");
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 4);

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-[#F4F4FA]">
        <h2 className="text-sm font-bold text-[#1A1A2E]">Transaction History</h2>
        <div className="flex items-center gap-2">
          <FilterDropdown value={filter} onChange={setFilter} />
          <button
            type="button"
            aria-label="Filter columns"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9090B0] bg-[#F6F6FB] border border-[#EAEAF4] hover:border-[#6B6BFF]/40 hover:text-[#6B6BFF] hover:bg-white transition-all duration-150"
          >
            <FilterIcon size={13} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#F4F4FA]">
              {["Invoice ID", "Date", "Course / Service", "Amount", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-extrabold text-[#9090B0] uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8F8FC]">
            {displayed.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {!showAll && TRANSACTIONS.length > 4 && (
        <div className="border-t border-[#F4F4FA] py-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors duration-150"
          >
            Load more transactions
            <ChevronDownSmall />
          </button>
        </div>
      )}
    </div>
  );
}
