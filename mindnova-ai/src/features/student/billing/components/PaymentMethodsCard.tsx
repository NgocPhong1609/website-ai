"use client";

import React, { useState } from "react";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { PlusIcon } from "./icons";
import { ShieldCheck, CreditCard, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
  useSavePaymentMethod,
} from "../api";

const PROVIDER_LABEL: Record<string, string> = {
  vnpay: "VNPay",
  momo: "MoMo",
  banking: "Ngân hàng",
};

export function PaymentMethodsCard() {
  const { data: methods = [], isLoading } = useGetPaymentMethods();
  const saveMutation = useSavePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState("banking");
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveMutation.mutateAsync({
        provider,
        holder_name: holderName.trim(),
        account_number: accountNumber.trim(),
        bank_name: bankName.trim() || undefined,
        is_default: isDefault,
      });
      toast.success("Đã lưu tài khoản thanh toán.");
      setOpen(false);
      setHolderName("");
      setAccountNumber("");
      setBankName("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu tài khoản.");
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-[#F0F2FA] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
            <span>Phương thức Thanh toán</span>
            <span className="text-[11px] font-medium text-[#27AE60] bg-[#EAF8F5] px-2.5 py-0.5 rounded-full border border-[#27AE60]/20 flex items-center">
              <ShieldCheck size={12} className="mr-1" /> PCI-DSS
            </span>
          </h2>
          <p className="text-xs font-normal text-[#64748b] mt-1">
            Lưu tài khoản để thanh toán khóa học và nhận hoàn tiền, chỉ cần xác nhận khi dùng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1d4ed8] bg-[#eff6ff] hover:bg-[#E2E6FF] border border-[#1d4ed8]/20 transition-all duration-150 cursor-pointer shrink-0"
        >
          <PlusIcon size={13} />
          <span>Thêm thẻ mới</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-xs text-[#64748b]">Đang tải phương thức thanh toán...</p>}
        {!isLoading && methods.map((method) => (
          <div key={method.id} className="flex items-center justify-between py-3 px-3.5 rounded-xl border border-[#EAEAF4] bg-[#F8FAFC]/60">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0f172a] truncate">{method.label}</p>
              <p className="text-xs text-[#64748b]">
                {PROVIDER_LABEL[method.provider] || method.provider}
                {method.is_default ? " • Mặc định" : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Xóa tài khoản"
              onClick={() => deleteMutation.mutate(method.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#2563eb] hover:bg-[#dbeafe]/70 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {!isLoading && methods.length === 0 && (
          <NoDataAvailable icon={CreditCard} title="Chưa có tài khoản" description="Thêm tài khoản ngân hàng, VNPay hoặc MoMo để thanh toán và hoàn tiền nhanh." variant="compact" />
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0f172a]">Thêm tài khoản thanh toán</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-[#64748b] cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <label className="block text-xs font-semibold text-[#64748b]">
              Cổng thanh toán
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0f172a]">
                <option value="banking">Ngân hàng</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#64748b]">
              Chủ tài khoản
              <input required value={holderName} onChange={(e) => setHolderName(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0f172a]" />
            </label>
            {provider === "banking" && (
              <label className="block text-xs font-semibold text-[#64748b]">
                Ngân hàng
                <input required value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0f172a]" />
              </label>
            )}
            <label className="block text-xs font-semibold text-[#64748b]">
              Số tài khoản / số ví
              <input required minLength={6} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0f172a]" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              Đặt làm mặc định
            </label>
            <button type="submit" disabled={saveMutation.isPending} className="w-full py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-semibold disabled:opacity-60">
              {saveMutation.isPending ? "Đang lưu..." : "Lưu tài khoản"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
