import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requestWithdrawal, getPayoutMethods, updatePayoutMethods } from "../api";
import { XIcon, ArrowRightIcon } from "./icons";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: () => void;
}

const COMMON_BANKS = [
  "MB Bank (Ngân hàng Quân Đội)",
  "Vietcombank (VCB)",
  "Techcombank (TCB)",
  "BIDV",
  "VPBank",
  "ACB (Á Châu)",
  "Agribank",
  "VietinBank",
  "TPBank",
  "Sacombank",
  "MoMo e-Wallet",
  "PayPal Quốc tế"
];

export function WithdrawalModal({ isOpen, onClose, availableBalance, onSuccess }: WithdrawalModalProps) {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isErrorMsg, setIsErrorMsg] = useState(false);

  // Bank Info Form State
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const minWithdrawalNum = 50000;

  // Query saved payout methods
  const { data: savedPayoutData, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["instructorPayoutMethods"],
    queryFn: getPayoutMethods,
    enabled: isOpen,
  });

  useEffect(() => {
    if (savedPayoutData) {
      if (savedPayoutData.bank_name && savedPayoutData.account_number && savedPayoutData.account_name) {
        setBankName(savedPayoutData.bank_name);
        setAccountNumber(savedPayoutData.account_number);
        setAccountName(savedPayoutData.account_name);
        setIsEditingBank(false);
      } else {
        setIsEditingBank(true);
      }
    }
  }, [savedPayoutData]);

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

  // Mutation for saving bank info
  const saveBankMutation = useMutation({
    mutationFn: updatePayoutMethods,
    onSuccess: (data) => {
      queryClient.setQueryData(["instructorPayoutMethods"], data);
      setIsEditingBank(false);
      setStatusMessage("✅ Đã lưu thông tin tài khoản ngân hàng thành công!");
      setIsErrorMsg(false);
    },
    onError: (err: any) => {
      setIsErrorMsg(true);
      setStatusMessage(`Lỗi lưu tài khoản: ${err.response?.data?.message || err.message}`);
    }
  });

  // Mutation for withdrawal request
  const withdrawMutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      setIsErrorMsg(false);
      setStatusMessage("🎉 Yêu cầu rút tiền đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: ["instructorRevenueOverview"] });
      queryClient.invalidateQueries({ queryKey: ["instructorTransactions"] });
      onSuccess();
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 2000);
    },
    onError: (err: any) => {
      setIsErrorMsg(true);
      setStatusMessage(`Lỗi rút tiền: ${err.response?.data?.message || err.message}`);
    }
  });

  if (!isOpen) return null;

  const cleanAmountNum = parseInt(amount.replace(/[^0-9]/g, "") || "0", 10);
  const isBelowMinimum = cleanAmountNum > 0 && cleanAmountNum < minWithdrawalNum;
  const isExceedingAvailable = cleanAmountNum > availableBalance;
  const hasValidBank = !!(bankName.trim() && accountNumber.trim() && accountName.trim());
  const canSubmit = !isBelowMinimum && !isExceedingAvailable && cleanAmountNum >= minWithdrawalNum && hasValidBank && !withdrawMutation.isPending;

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setIsErrorMsg(true);
      setStatusMessage("Vui lòng điền đầy đủ Tên ngân hàng, Số tài khoản và Tên chủ tài khoản.");
      return;
    }
    saveBankMutation.mutate({
      bank_name: bankName.trim(),
      account_number: accountNumber.trim(),
      account_name: accountName.trim().toUpperCase(),
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatusMessage(null);
    setIsErrorMsg(false);

    withdrawMutation.mutate({
      amount: cleanAmountNum,
      bank_info: {
        bank_name: bankName.trim(),
        account_number: accountNumber.trim(),
        account_name: accountName.trim().toUpperCase(),
      }
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E2D9] shadow-xl flex flex-col overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#C0392B] text-white">
          <div>
            <h2 className="text-base font-black text-white">Yêu Cầu Rút Tiền Hoa Hồng</h2>
            <p className="text-xs text-white/80">Hệ thống thanh toán tự động an toàn cho Giảng viên</p>
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
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase">Số dư khả dụng</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Sẵn sàng rút</span>
            </div>
            <span className="text-xl font-black text-emerald-700 mt-1.5">{availableBalance.toLocaleString('vi-VN')} VNĐ</span>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-800 uppercase">Số tiền muốn rút</label>
              <span className="text-[11px] font-bold text-[#8A8478]">Tối thiểu: 50,000đ</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền (VD: 500.000)..."
                className={twMerge(
                  "w-full h-11 pl-4 pr-32 rounded-xl border font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 transition-all",
                  isBelowMinimum || isExceedingAvailable ? "border-rose-400 bg-rose-50/20 text-rose-700" : "border-[#E8E2D9] bg-white text-[#2C3039] focus:border-[#C0392B]"
                )}
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-400">VNĐ</span>
                <button
                  type="button"
                  onClick={() => setAmount(formatCurrency(availableBalance.toString()))}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#C0392B] font-extrabold text-xs hover:bg-[#C0392B] hover:text-white transition-all cursor-pointer border border-[#E8E2D9]"
                >
                  Tối đa
                </button>
              </div>
            </div>

            {isBelowMinimum && (
              <p className="text-xs font-bold text-rose-600 mt-0.5">
                Số tiền yêu cầu tối thiểu là 50,000 VNĐ.
              </p>
            )}
            {isExceedingAvailable && (
              <p className="text-xs font-bold text-rose-600 mt-0.5">
                Số tiền vượt quá số dư khả dụng hiện có.
              </p>
            )}
          </div>

          {/* Bank Account Management Section */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-800 uppercase">Tài Khoản Nhận Tiền</label>
              {hasValidBank && !isEditingBank && (
                <button
                  type="button"
                  onClick={() => setIsEditingBank(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Thay đổi tài khoản
                </button>
              )}
            </div>

            {isLoadingPayout ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-500 text-center">
                Đang tải thông tin tài khoản...
              </div>
            ) : isEditingBank || !hasValidBank ? (
              <form onSubmit={handleSaveBankInfo} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-700">Điền thông tin tài khoản ngân hàng / ví nhận tiền của bạn:</p>
                
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-600 mb-1">Tên Ngân hàng / Cổng nhận tiền *</label>
                  <input
                    type="text"
                    list="bank-options"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="VD: MB Bank, Vietcombank, PayPal..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#C0392B]"
                  />
                  <datalist id="bank-options">
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-600 mb-1">Số Tài Khoản / Email PayPal *</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="VD: 0987654321..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#C0392B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-600 mb-1">Tên Chủ Tài Khoản (Người thụ hưởng) *</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                    placeholder="VD: NGUYEN VAN A"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-bold uppercase text-slate-900 bg-white focus:outline-none focus:border-[#C0392B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 mt-1">
                  {hasValidBank && (
                    <button
                      type="button"
                      onClick={() => setIsEditingBank(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saveBankMutation.isPending}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saveBankMutation.isPending ? "Đang lưu..." : "Lưu tài khoản"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-950">{bankName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      Đã xác minh
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-700 mt-1">
                    STK: <span className="font-mono">{accountNumber}</span>
                  </p>
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase mt-0.5">
                    Chủ tk: {accountName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {statusMessage && (
            <div className={twMerge("p-3.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-sm", isErrorMsg ? "bg-rose-100 text-rose-700 border border-rose-300" : "bg-slate-900 text-white")}>
              <span>{statusMessage}</span>
              {(withdrawMutation.isPending || saveBankMutation.isPending) && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-white bg-[#C0392B] hover:bg-[#4338CA] active:scale-98 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{withdrawMutation.isPending ? "Đang xử lý..." : "Xác Nhận & Gửi Yêu Cầu Rút Tiền"}</span>
            {!withdrawMutation.isPending && <ArrowRightIcon size={16} />}
          </button>
        </div>

        {/* Footer */}
        <div className="py-3 bg-[#FEFCF9] border-t border-gray-100 text-center">
          <span className="text-xs font-medium text-[#8A8478]">
            Thời gian nhận tiền dự kiến qua hệ thống tự động: <strong className="text-gray-700 font-bold">1 - 3 ngày làm việc</strong>
          </span>
        </div>
        
      </div>
    </div>
  );
}