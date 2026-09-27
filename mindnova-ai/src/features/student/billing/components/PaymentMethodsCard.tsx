"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";

import React, { useState } from "react";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { ShieldCheck, CreditCard, Trash2, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
  useSavePaymentMethod,
} from "../api";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

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
      toast.error(getErrorMessage(error, "Không thể lưu tài khoản."));
    }
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Phương thức Thanh toán</span>
          </h2>
          <p className="text-xs font-normal text-slate-500 mt-1">
            Lưu tài khoản để thanh toán khóa học và nhận hoàn tiền, chỉ cần xác nhận khi dùng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-[#E2E6FF] border border-blue-700/20 transition-all duration-150 cursor-pointer shrink-0"
        >
          <Plus size={13} />
          <span>Thêm thẻ mới</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && <div role="status" aria-label="Đang tải phương thức thanh toán" className="space-y-2"><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></div>}
        {!isLoading && methods.map((method) => (
          <div key={method.id} className="flex items-center justify-between py-3 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{method.label}</p>
              <p className="text-xs text-slate-500">
                {PROVIDER_LABEL[method.provider] || method.provider}
                {method.is_default ? " • Mặc định" : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Xóa tài khoản"
              onClick={() => deleteMutation.mutate(method.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-100/70 cursor-pointer"
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
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Thêm tài khoản thanh toán</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-slate-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-500">
              Cổng thanh toán
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900">
                <option value="banking">Ngân hàng</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">MoMo</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-500">
              Chủ tài khoản
              <input required value={holderName} onChange={(e) => setHolderName(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900" />
            </label>
            {provider === "banking" && (
              <label className="block text-xs font-semibold text-slate-500">
                Ngân hàng
                <input required value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900" />
              </label>
            )}
            <label className="block text-xs font-semibold text-slate-500">
              Số tài khoản / số ví
              <input required minLength={6} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              Đặt làm mặc định
            </label>
            <button type="submit" disabled={saveMutation.isPending} className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">
              {saveMutation.isPending ? "Đang lưu..." : "Lưu tài khoản"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
