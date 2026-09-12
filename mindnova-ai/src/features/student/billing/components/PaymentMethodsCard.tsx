"use client";

import React from "react";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { PlusIcon } from "./icons";
import { ShieldCheck, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export function PaymentMethodsCard({ methods = [], isLoading = false }: { methods?: string[]; isLoading?: boolean }) {
  const labels: Record<string, string> = {
    vnpay: "VNPay",
    momo: "MoMo",
    banking: "Chuyển khoản",
    free: "Miễn phí",
  };

  function handleAddNew() {
    toast("Thanh toán khóa học được thực hiện qua VNPay hoặc MoMo khi checkout.");
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
      {/* Header with integrated trust badge */}
      <div className="flex items-center justify-between gap-4 border-b border-[#F0F2FA] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
            <span>Phương thức Thanh toán</span>
            <span className="text-[11px] font-medium text-[#27AE60] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#27AE60]/20 flex items-center">
              <ShieldCheck size={12} className="mr-1" /> PCI-DSS
            </span>
          </h2>
          <p className="text-xs font-normal text-[#64748b] mt-1">
            Quản lý các thẻ tín dụng &amp; ghi nợ liên kết tự động thanh toán học phí.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1d4ed8] bg-[#eff6ff] hover:bg-[#E2E6FF] border border-[#1d4ed8]/20 transition-all duration-150 cursor-pointer shrink-0"
        >
          <PlusIcon size={13} />
          <span>Thêm thẻ mới</span>
        </button>
      </div>

      {/* Compact, well-spaced card list without vertical void gap */}
      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-xs text-[#64748b]">Đang tải phương thức thanh toán...</p>}
        {!isLoading && methods.map((method) => (
          <div key={method} className="flex items-center justify-between py-3 px-3.5 rounded-xl border border-[#EAEAF4] bg-[#F8FAFC]/60">
            <span className="text-sm font-semibold text-[#0f172a]">{labels[method] || method}</span>
            <span className="text-xs text-[#64748b]">Đã sử dụng</span>
          </div>
        ))}
        {!isLoading && methods.length === 0 && (
          <div className="py-2">
            <NoDataAvailable icon={CreditCard} title="Chưa có phương thức" description="Bạn chưa thanh toán khóa học nào. VNPay và MoMo sẽ hiện khi có giao dịch." variant="compact" />
          </div>
        )}
      </div>
    </div>
  );
}
