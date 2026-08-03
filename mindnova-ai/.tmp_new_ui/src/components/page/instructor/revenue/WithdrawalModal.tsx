import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { XIcon, ArrowRightIcon } from "./icons";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PayoutMethodType = "bank" | "paypal" | "stripe";

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("10,000,000");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethodType>("bank");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const availableBalanceNum = 42180000; // 42,180,000 VND
  const escrowHoldingBalance = 15400000;
  const minWithdrawalNum = 1000000;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStatusMessage(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanAmountNum = parseInt(amount.replace(/[^0-9]/g, "") || "0", 10);
  const isBelowMinimum = cleanAmountNum < minWithdrawalNum;
  const isExceedingAvailable = cleanAmountNum > availableBalanceNum;
  const canSubmit = !isBelowMinimum && !isExceedingAvailable && cleanAmountNum > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatusMessage("⚡ Yêu cầu thanh toán đã được tiếp nhận! Hệ thống sẽ chuyển khoản tự động trong 24h.");
    setTimeout(() => {
      onClose();
    }, 2500);
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
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase">Khả Dụng Ngay</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Sẵn sàng</span>
              </div>
              <span className="text-lg font-black text-emerald-900 mt-1.5">42,180,000đ</span>
              <span className="text-[11px] font-medium text-emerald-700 mt-0.5">Đã qua kỳ hoàn hạn 30 ngày</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between" title="Số dư tạm giữ trong thời gian 30 ngày bảo lưu khóa học">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase">Tạm giữ (Escrow)</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">30 Ngày</span>
              </div>
              <span className="text-lg font-black text-amber-900 mt-1.5">15,400,000đ</span>
              <span className="text-[11px] font-medium text-amber-700 mt-0.5">Chờ hết thời hạn hoàn tiền</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-800 uppercase">Số tiền muosn rút</label>
              <span className="text-[11px] font-bold text-gray-500">Tối thiểu: 1,000,000đ</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={twMerge(
                  "w-full h-11 pl-4 pr-32 rounded-xl border font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 transition-all",
                  isBelowMinimum || isExceedingAvailable ? "border-rose-400 bg-rose-50/20 text-rose-700" : "border-gray-200 bg-white text-gray-900 focus:border-[#4F46E5]"
                )}
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-400">VNĐ</span>
                <button
                  type="button"
                  onClick={() => setAmount("42,180,000")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4F46E5] font-extrabold text-xs hover:bg-[#4F46E5] hover:text-white transition-all cursor-pointer border border-indigo-200 hover:border-[#4F46E5]"
                >
                  Tối đa
                </button>
              </div>
            </div>

            {isBelowMinimum && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Số tiền yêu cầu phải từ 1,000,000 VNĐ trở lên.
              </p>
            )}
            {isExceedingAvailable && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Số tiền vượt quá số dư khả dụng ngay. Không thể rút trước tiền đang trong quỹ bảo lãnh Escrow.
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
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-sm">
              <span>{statusMessage}</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || !!statusMessage}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:scale-98 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Xác Nhan & Gửi Yêu Cầu Rút Tiền</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className="py-3 bg-gray-50 border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-gray-500">
            Thời gian nhận tiền dự kiến qua hệ thống tự động: <strong className="text-gray-700 font-bold">Ngay lập tức đến 24 giờ làm việc</strong>
          </span>
        </div>
        
      </div>
    </div>
  );
}