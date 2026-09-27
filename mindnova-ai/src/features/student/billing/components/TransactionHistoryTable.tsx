"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FILTER_PERIODS } from "../constants";
import type { BillingOrder } from "../api";
import type { Transaction, TransactionStatus, FilterPeriod } from "../types";
import { StudentRefundModal } from "../../courses/components/StudentRefundModal";
import { Banknote, ChevronDown, Filter } from "lucide-react";
import toast from "react-hot-toast";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TransactionStatus, { text: string; clazz: string }> = {
 Paid: { text: "Thành công", clazz: "bg-emerald-50 text-slate-900 border border-slate-900/25" },
 Refunded: { text: "Đã hoàn tiền", clazz: "bg-amber-50 text-amber-600 border border-amber-500/25" },
 Pending: { text: "Đang xử lý", clazz: "bg-slate-50 text-blue-600 border border-blue-600/25" },
 Failed: { text: "Thất bại", clazz: "bg-slate-50 text-blue-600 border border-blue-500/25" },
};

function StatusBadge({ status }: { status: TransactionStatus }) {
 const config = STATUS_STYLES[status] || { text: status, clazz: "bg-slate-100 text-slate-500 border border-slate-200" };
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
 course: "bg-slate-50 text-blue-600 border border-blue-600/20",
 subscription: "bg-emerald-50 text-slate-900 border border-slate-900/20",
 python: "bg-amber-50 text-amber-600 border border-amber-500/20",
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
 className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 hover:border-blue-600/40 hover:bg-white transition-all duration-150 shadow-2xs cursor-pointer"
 >
 <span className="text-blue-600"></span>
 <span>{value}</span>
 <ChevronDown size={12} />
 </button>
 {open && (
 <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1 overflow-hidden">
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
 ? "text-blue-600 bg-[#F0F2FF] font-semibold"
 : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
 )}
 >
 <span>{period}</span>
 {period === value && <span className="text-blue-600"></span>}
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
    <tr className="group hover:bg-slate-50/80 transition-colors duration-150 border-b border-slate-100 last:border-b-0">
      {/* Invoice ID */}
      <td className="pl-6 pr-4 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F4F5FD] text-blue-600 font-semibold text-xs border border-slate-200 select-all">
          {tx.invoiceId}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-4 text-xs font-normal text-slate-500 whitespace-nowrap">
        {tx.date}
      </td>

      {/* Service & Details */}
      <td className="px-4 py-4 min-w-[240px]">
        <div className="flex items-center gap-3">
          <ServiceIcon icon={tx.serviceIcon} />
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {tx.service}
            </p>
            <p className="text-[11px] font-normal text-slate-500">
              {tx.paymentLabel}
            </p>
          </div>
        </div>
      </td>

      {/* Amount */}
      <td className="px-4 py-4 text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
        {tx.amount}
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={tx.status} />
      </td>

      {/* Actions */}
      <td className="pr-6 pl-4 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {tx.canRefund && (
            <button
              type="button"
              onClick={() => onRefundClick?.(tx)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-50/80 border border-blue-600/20 transition-all duration-150 cursor-pointer shadow-2xs"
              title="Yêu cầu hoàn tiền khóa học nếu tiến độ ≤ 10% hoặc chưa học quá 5 bài"
            >
              <span className="flex items-center gap-1.5"><Banknote size={14} /> Hoàn tiền</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Transaction History Table ────────────────────────────────────────────────

const PERIOD_MONTHS: Record<FilterPeriod, number | null> = {
  "3 Tháng qua": 3,
  "6 Tháng qua": 6,
  "1 Năm qua": 12,
  "Tất cả thời gian": null,
};

const PAYMENT_LABELS: Record<string, string> = {
  free: "Nhận miễn phí",
  vnpay: "Thanh toán qua VNPay",
  momo: "Thanh toán qua MoMo",
  banking: "Chuyển khoản ngân hàng",
};

function mapStatus(status: string): TransactionStatus {
  if (status === "completed") return "Paid";
  if (status === "refunded") return "Refunded";
  if (status === "failed") return "Failed";
  return "Pending";
}

export function TransactionHistoryTable({ orders = [], isLoading = false }: { orders?: BillingOrder[]; isLoading?: boolean }) {
  const [filter, setFilter] = useState<FilterPeriod>("6 Tháng qua");
  const [showAll, setShowAll] = useState(false);
  const [refundTx, setRefundTx] = useState<Transaction | null>(null);

  const transactions: Transaction[] = orders.map((order) => ({
    id: String(order.id),
    invoiceId: order.transaction_id || `#${order.id}`,
    date: order.created_at || "",
    service: order.service,
    serviceIcon: "course",
    amount: `${Number(order.total_amount).toLocaleString("vi-VN")} VNĐ`,
    status: mapStatus(order.status),
    // Free enrolments have nothing to refund; the modal itself checks the 30-day/progress rules.
    canRefund: order.status === "completed" && Number(order.total_amount) > 0 && !!order.course_id,
    courseId: order.course_id ?? null,
    paymentLabel: PAYMENT_LABELS[order.payment_method] ?? "Thanh toán trực tuyến",
  }));

  const months = PERIOD_MONTHS[filter];
  const cutoff = new Date();
  if (months) cutoff.setMonth(cutoff.getMonth() - months);
  const filtered = months ? transactions.filter((tx) => {
    const [d, m, y] = tx.date.split("/").map(Number);
    return !y || new Date(y, (m || 1) - 1, d || 1) >= cutoff;
  }) : transactions;
  const displayed = showAll ? filtered : filtered.slice(0, 4);

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Table header console */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Lịch Sử Giao Dịch &amp; Học Phí</span>
            <span className="text-[11px] font-medium text-blue-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-blue-600/20">
              {isLoading ? "..." : `${filtered.length} Giao dịch`}
            </span>
          </h2>
          <p className="text-xs font-normal text-slate-500 mt-1">
            Theo dõi chi tiết thống kê thanh toán học phí và các khóa học đã đăng ký trong lộ trình của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <FilterDropdown value={filter} onChange={setFilter} />
          <button
            type="button"
            aria-label="Lọc nâng cao"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 bg-white border border-slate-200 hover:border-blue-600/40 hover:text-blue-600 transition-all duration-150 shadow-2xs cursor-pointer"
            title="Bộ lọc nâng cao"
          >
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Table grid with cohesive proportions */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
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
                  className={twMerge("text-xs font-semibold text-slate-500 tracking-normal select-none", clazz)}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayed.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onRefundClick={(t) => setRefundTx(t)} />
            ))}
            {!isLoading && displayed.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">Chưa có giao dịch.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer view controls */}
      {!showAll && filtered.length > 4 && (
        <div className="border-t border-slate-100 p-4 flex justify-center bg-slate-50/40">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-blue-600/30 transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <span>Xem toàn bộ lịch sử học phí</span>
            <ChevronDown size={12} />
          </button>
        </div>
      )}

      {refundTx?.courseId && (
        <StudentRefundModal
          isOpen={!!refundTx}
          onClose={() => setRefundTx(null)}
          courseId={refundTx.courseId}
          courseTitle={refundTx.service}
        />
      )}
    </div>
  );
}
