"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TRANSACTIONS, FILTER_PERIODS } from "../constants";
import type { Transaction, TransactionStatus, FilterPeriod } from "../types";
import { FilterIcon, ChevronDownSmall } from "./icons";
import { StudentRefundModal } from "../../courses/components/StudentRefundModal";
import { Banknote } from "lucide-react";
import toast from "react-hot-toast";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TransactionStatus, { text: string; clazz: string }> = {
 Paid: { text: "Thành công", clazz: "bg-[#EAF8F5] text-[#0f172a] border border-[#0f172a]/25" },
 Refunded: { text: "Đã hoàn tiền", clazz: "bg-[#FFFBEB] text-[#D97706] border border-[#F59E0B]/25" },
 Pending: { text: "Đang xử lý", clazz: "bg-[#f8fafc] text-[#2563eb] border border-[#2563eb]/25" },
 Failed: { text: "Thất bại", clazz: "bg-[#f8fafc] text-[#2563eb] border border-[#EF4444]/25" },
};

function StatusBadge({ status }: { status: TransactionStatus }) {
 const config = STATUS_STYLES[status] || { text: status, clazz: "bg-gray-100 text-[#64748b] border border-[#e2e8f0]" };
 return (
 <span
 className={twMerge(
 "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold leading-none shadow-2xs",
 config.clazz,
 )}
 >
 <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
 {config.text}
 </span>
 );
}

// ─── Service Icon ─────────────────────────────────────────────────────────────

const SERVICE_COLORS: Record<Transaction["serviceIcon"], string> = {
 course: "bg-[#f8fafc] text-[#2563eb] border border-[#2563eb]/20",
 subscription: "bg-[#EAF8F5] text-[#0f172a] border border-[#0f172a]/20",
 python: "bg-[#FFFBEB] text-[#D97706] border border-[#F59E0B]/20",
};

const SERVICE_LETTERS: Record<Transaction["serviceIcon"], string> = {
 course: "AI",
 subscription: "Pro",
 python: "Py",
};

function ServiceIcon({ icon }: { icon: Transaction["serviceIcon"] }) {
 return (
 <div
 className={twMerge(
 "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs",
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
 className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-[#0f172a] bg-[#F8FAFC] border border-[#E4E6F0] hover:border-[#2563eb]/40 hover:bg-white transition-all duration-150 shadow-2xs cursor-pointer"
 >
 <span className="text-[#2563eb]"></span>
 <span>{value}</span>
 <ChevronDownSmall />
 </button>
 {open && (
 <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl bg-white border border-[#e2e8f0] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1 overflow-hidden">
 {FILTER_PERIODS.map((period) => (
 <button
 key={period}
 type="button"
 onClick={() => {
 onChange(period as FilterPeriod);
 setOpen(false);
 }}
 className={twMerge(
 "w-full text-left px-4 py-2.5 text-xs font-medium transition-colors duration-100 flex items-center justify-between cursor-pointer",
 period === value
 ? "text-[#2563eb] bg-[#F0F2FF] font-semibold"
 : "text-[#64748b] hover:bg-[#F8F8FC] hover:text-[#0f172a]",
 )}
 >
 <span>{period}</span>
 {period === value && <span className="text-[#2563eb]"></span>}
 </button>
 ))}
 </div>
 )}
 </div>
 );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────

function TransactionRow({ tx, onRefundClick }: { tx: Transaction; onRefundClick?: (tx: Transaction) => void }) {
 return (
 <tr className="group hover:bg-[#F8FAFC]/80 transition-colors duration-150 border-b border-[#F4F5FB] last:border-b-0">
 {/* Invoice ID */}
 <td className="pl-6 pr-4 py-4 whitespace-nowrap">
 <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F4F5FD] text-[#2563eb] font-semibold text-xs border border-[#e2e8f0] select-all">
 {tx.invoiceId}
 </span>
 </td>

 {/* Date */}
 <td className="px-4 py-4 text-xs font-normal text-[#64748b] whitespace-nowrap">
 {tx.date}
 </td>

 {/* Service & Details */}
 <td className="px-4 py-4 min-w-[240px]">
 <div className="flex items-center gap-3">
 <ServiceIcon icon={tx.serviceIcon} />
 <div className="space-y-0.5">
 <p className="text-xs sm:text-sm font-semibold text-[#0f172a] leading-snug group-hover:text-[#2563eb] transition-colors">
 {tx.service}
 </p>
 <p className="text-[11px] font-normal text-[#64748b]">
 Thanh toán thành công qua thẻ trực tuyến
 </p>
 </div>
 </div>
 </td>

 {/* Amount */}
 <td className="px-4 py-4 text-xs sm:text-sm font-semibold text-[#0f172a] whitespace-nowrap">
 {tx.amount}
 </td>

 {/* Status */}
 <td className="px-4 py-4 whitespace-nowrap">
 <StatusBadge status={tx.status} />
 </td>

 {/* Actions */}
 <td className="pr-6 pl-4 py-4 whitespace-nowrap text-right">
 <div className="flex items-center justify-end gap-2">
 {tx.status === "Paid" && (
 <button
 type="button"
 onClick={() => onRefundClick?.(tx)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2563eb] bg-[#eff6ff] hover:bg-[#eff6ff]/80 border border-[#2563eb]/20 transition-all duration-150 cursor-pointer shadow-2xs"
 title="Yêu cầu hoàn tiền khóa học nếu tiến độ ≤ 10% hoặc chưa học quá 5 bài"
 >
 <span className="flex items-center gap-1.5"><Banknote size={14} /> Hoàn tiền</span>
 </button>
 )}
 <button
 type="button"
 onClick={() => toast(`Yêu cầu hỗ trợ giao dịch ${tx.invoiceId} đã được ghi nhận. Chuyên viên chăm sóc học viên sẽ kết nối qua khung Chat!`)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#2563eb] bg-[#f8fafc] hover:bg-[#f8fafc] hover:text-[#2563eb] border border-[#2563eb]/20 hover:border-[#2563eb]/40 transition-all duration-150 cursor-pointer shadow-2xs"
 title="Yêu cầu hỗ trợ về khoản học phí này"
 >
 <span> Hỗ trợ</span>
 </button>
 </div>
 </td>
 </tr>
 );
}

// ─── Transaction History Table ────────────────────────────────────────────────

export function TransactionHistoryTable() {
  const [filter, setFilter] = useState<FilterPeriod>("6 Tháng qua");
  const [showAll, setShowAll] = useState(false);
  const [refundTx, setRefundTx] = useState<Transaction | null>(null);

  const displayed = showAll ? TRANSACTIONS : TRANSACTIONS.slice(0, 4);

  return (
    <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs overflow-hidden transition-all duration-300 hover:shadow-sm">
      {/* Table header console */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-[#e2e8f0] bg-[#F8FAFC]/50">
        <div>
          <h2 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
            <span>Lịch Sử Giao Dịch &amp; Học Phí</span>
            <span className="text-[11px] font-medium text-[#2563eb] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#2563eb]/20">
              {TRANSACTIONS.length} Giao dịch
            </span>
          </h2>
          <p className="text-xs font-normal text-[#64748b] mt-1">
            Theo dõi chi tiết thống kê thanh toán học phí và các khóa học đã đăng ký trong lộ trình của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <FilterDropdown value={filter} onChange={setFilter} />
          <button
            type="button"
            aria-label="Lọc nâng cao"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748b] bg-white border border-[#E4E6F0] hover:border-[#2563eb]/40 hover:text-[#2563eb] transition-all duration-150 shadow-2xs cursor-pointer"
            title="Bộ lọc nâng cao"
          >
            <FilterIcon size={15} />
          </button>
        </div>
      </div>

      {/* Table grid with cohesive proportions */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#F8FAFC]">
              {[
                { label: "Mã Giao Dịch", clazz: "pl-6 pr-4 py-3 text-left w-[15%]" },
                { label: "Ngày Giao Dịch", clazz: "px-4 py-3 text-left w-[15%]" },
                { label: "Khóa Học / Dịch Vụ", clazz: "px-4 py-3 text-left w-[35%]" },
                { label: "Số Tiền", clazz: "px-4 py-3 text-left w-[15%]" },
                { label: "Trạng Thái", clazz: "px-4 py-3 text-left w-[10%]" },
                { label: "Thao Tác", clazz: "pr-6 pl-4 py-3 text-right w-[10%]" },
              ].map(({ label, clazz }) => (
                <th
                  key={label}
                  className={twMerge("text-xs font-semibold text-[#64748b] tracking-normal select-none", clazz)}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F5FB]">
            {displayed.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onRefundClick={(t) => setRefundTx(t)} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer view controls */}
      {!showAll && TRANSACTIONS.length > 4 && (
        <div className="border-t border-[#F0F2FA] p-4 flex justify-center bg-[#F8FAFC]/40">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-[#2563eb] bg-white border border-[#E4E6F0] hover:bg-[#f8fafc] hover:border-[#2563eb]/30 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <span>Xem toàn bộ lịch sử học phí</span>
            <ChevronDownSmall />
          </button>
        </div>
      )}

      {refundTx && (
        <StudentRefundModal
          isOpen={!!refundTx}
          onClose={() => setRefundTx(null)}
          courseId={68}
          courseTitle={refundTx.service}
        />
      )}
    </div>
  );
}
