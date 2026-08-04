import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useMutation } from "@tanstack/react-query";
import { requestWithdrawal } from "../api";
import { XIcon, ArrowRightIcon } from "./icons";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

export type PayoutMethodType = "bank" | "paypal" | "stripe";

export function WithdrawalModal({ isOpen, onClose, availableBalance, onSuccess }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethodType>("bank");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isErrorMsg, setIsErrorMsg] = useState(false);

  const minWithdrawalNum = 50000;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStatusMessage(null);
      setIsErrorMsg(false);
      setAmount("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      setIsErrorMsg(false);
      setStatusMessage("⚡ Yêu cầu thanh toán đã được tiếp nhận! Hệ thống sẽ xử lý sớm nhất.");
      onSuccess();
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 2500);
    },
    onError: (err: any) => {
      setIsErrorMsg(true);
      setStatusMessage(`Lỗi: ${err.response?.data?.message || err.message}`);
    }
  });

  if (!isOpen) return null;

  const cleanAmountNum = parseInt(amount.replace(/[^0-9]/g, "") || "0", 10);
  const isBelowMinimum = cleanAmountNum > 0 && cleanAmountNum < minWithdrawalNum;
  const isExceedingAvailable = cleanAmountNum > availableBalance;
  const canSubmit = !isBelowMinimum && !isExceedingAvailable && cleanAmountNum >= minWithdrawalNum && !mutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatusMessage(null);
    setIsErrorMsg(false);
    
    // Giả lập lấy thông tin bank thật. Trong thực tế sẽ lấy từ PayoutMethod đã chọn
    let bank_info = { bank_name: "Unknown", account_number: "", account_name: "" };
    if (payoutMethod === 'bank') {
      bank_info = { bank_name: "MB Bank", account_number: "12345678", account_name: "NGUYEN VAN A" };
    } else if (payoutMethod === 'paypal') {
      bank_info = { bank_name: "PayPal", account_number: "minh.ng@paypal.me", account_name: "Minh Ng" };
    }
    
    mutation.mutate({
      amount: cleanAmountNum,
      bank_info
    });
  };

  const formatCurrency = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, "") || "0", 10);
    if (num === 0) return "";
    return num.toLocaleString('vi-VN');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatCurrency(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#4F46E5] text-white">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-black shadow-2xs">
              💳
            </span>
            <div>
              <h2 className="text-base font-black text-white">Yêu Cầu Rút Tiền Hoa Hồng</h2>
              <p className="text-xs text-indigo-100">Hệ thống thanh toán tự động an toàn cho Giảng viên</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh]">
          
          {/* Balance Breakdown */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase">Số dư khả dụng</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Sẵn sàng rút</span>
              </div>
              <span className="text-lg font-black text-emerald-900 mt-1.5">{availableBalance.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-800 uppercase">Số tiền muốn rút</label>
              <span className="text-[11px] font-bold text-gray-500">Tối thiểu: 50,000đ</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền..."
                className={twMerge(
                  "w-full h-11 pl-4 pr-32 rounded-xl border font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all",
                  isBelowMinimum || isExceedingAvailable ? "border-rose-400 bg-rose-50/20 text-rose-700" : "border-gray-200 bg-white text-gray-900 focus:border-[#4F46E5]"
                )}
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-400">VNĐ</span>
                <button
                  type="button"
                  onClick={() => setAmount(formatCurrency(availableBalance.toString()))}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] font-extrabold text-xs hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer border border-indigo-200 hover:border-[#4F46E5]"
                >
                  Tối đa
                </button>
              </div>
            </div>

            {isBelowMinimum && (
               <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                 ⚠️ Số tiền yêu cầu phải từ 50,000 VNĐ trở lên.
               </p>
             )}
             {isExceedingAvailable && (
               <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                 ⚠️ Số tiền vượt quá số dư khả dụng ngay.
               </p>
             )}
          </div>

          {/* Payout Method Selection */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-gray-800 uppercase">Cổng Nhận Tiền Đã Xác Minh</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "bank", title: "Chuyển khoản Ngân hàng", icon: "🏦", verified: true, desc: "MB Bank - **** 1234" },
                { id: "paypal", title: "PayPal Quốc tế", icon: "🌐", verified: true, desc: "minh.ng@paypal.me" },
                { id: "stripe", title: "Stripe Connect", icon: "⚡", verified: false, desc: "Chưa thiết lập KYC" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => m.verified && setPayoutMethod(m.id as any)}
                  className={twMerge(
                    "p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 relative",
                    payoutMethod === m.id ? "border-[#4F46E5] bg-indigo-50/50 shadow-2xs" : "border-gray-200 bg-white hover:border-indigo-300",
                    !m.verified ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{m.icon}</span>
                    <span className={twMerge("text-[10px] font-bold px-1.5 py-0.5 rounded-md", m.verified ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600")}>
                      {m.verified ? "Đã duyệt" : "Chưa nối"}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-gray-900 leading-tight">{m.title}</h5>
                    <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {statusMessage && (
            <div className={twMerge("p-3.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-sm", isErrorMsg ? "bg-rose-100 text-rose-700" : "bg-emerald-600 text-white")}>
              <span>{statusMessage}</span>
              {mutation.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{mutation.isPending ? "Đang xử lý..." : "Xác Nhận & Gửi Yêu Cầu Rút Tiền"}</span>
            {!mutation.isPending && <ArrowRightIcon size={16} />}
          </button>
        </div>

        {/* Footer */}
        <div className="py-3 bg-gray-50 border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-gray-500">
            Thời gian nhận tiền dự kiến qua hệ thống tự động: <strong className="text-gray-700 font-bold">1 - 3 ngày làm việc</strong>
          </span>
        </div>
        
      </div>
    </div>
  );
}