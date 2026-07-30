import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { XIcon, WalletIcon, PencilIcon, LockIcon, ArrowRightIcon } from "./icons";

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
  const escrowHoldingBalance = 15400000; // Held for 30-day refund window (Section 4.2)
  const minWithdrawalNum = 1000000; // Minimum 1,000,000 VND (~$50)

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
    setStatusMessage("⚡ Payout Request Created! Status: PENDING (Automated fraud screening inside 24h).");
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#1A1A2E] text-white">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center text-lg font-black shadow-md">
              💰
            </span>
            <div>
              <h2 className="text-base font-black text-white">Instructor Revenue Withdrawal (Section 4.2)</h2>
              <p className="text-xs text-indigo-200">Secure automated disbursement gateway</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
          
          {/* Balance Breakdown & 30-Day Escrow Withholding (Section 4.2) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase">Available Balance</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Ready</span>
              </div>
              <span className="text-xl font-black text-emerald-900 mt-2">42,180,000đ</span>
              <span className="text-[10px] font-bold text-emerald-700 mt-1">Cleared 30-day withholding</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between" title="Funds locked in escrow during student 30-day refund window">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase">Escrow Holding</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900">30-Day Rule</span>
              </div>
              <span className="text-xl font-black text-amber-900 mt-2">15,400,000đ</span>
              <span className="text-[10px] font-bold text-amber-700 mt-1">Pending student refund period</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#1A1A2E] uppercase">Withdrawal Amount</label>
              <span className="text-[11px] font-extrabold text-gray-500">Min: 1,000,000đ (~$50)</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={twMerge(
                  "w-full h-12 pl-4 pr-28 rounded-2xl border-2 font-extrabold text-base focus:outline-none transition-all",
                  isBelowMinimum || isExceedingAvailable ? "border-rose-400 bg-rose-50/20 text-rose-700" : "border-[#6B6BFF] bg-white text-[#1A1A2E]"
                )}
              />
              <div className="absolute right-3 flex items-center gap-2">
                <span className="text-xs font-black text-gray-400">VND</span>
                <button
                  type="button"
                  onClick={() => setAmount("42,180,000")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[11px] hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Max Available
                </button>
              </div>
            </div>

            {isBelowMinimum && (
              <p className="text-xs font-extrabold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Minimum withdrawal balance requirement is 1,000,000đ ($50).
              </p>
            )}
            {isExceedingAvailable && (
              <p className="text-xs font-extrabold text-rose-600 flex items-center gap-1 mt-0.5">
                ⚠️ Amount exceeds immediate available balance. Escrow holding funds cannot be prematurely withdrawn.
              </p>
            )}
          </div>

          {/* Payout Method Selection (Bank / PayPal / Stripe) */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-[#1A1A2E] uppercase">Select Verified Payout Gateway (Section 4.2)</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "bank", title: "Bank Transfer", icon: "🏦", verified: true, desc: "MB Bank - **** 1234" },
                { id: "paypal", title: "PayPal Global", icon: "PayPal", verified: true, desc: "dr.khoi@paypal.me" },
                { id: "stripe", title: "Stripe Connect", icon: "S", verified: false, desc: "Pending KYC setup" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => m.verified && setPayoutMethod(m.id as any)}
                  className={twMerge(
                    "p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 relative",
                    payoutMethod === m.id ? "border-[#6B6BFF] bg-indigo-50/40 shadow-xs" : "border-gray-200 bg-white hover:border-indigo-300",
                    !m.verified && "opacity-50 cursor-not-allowed bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-[#1A1A2E] text-white font-black text-xs flex items-center justify-center">{m.icon}</span>
                    <span className={twMerge("text-[9px] font-black px-1.5 py-0.5 rounded", m.verified ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600")}>
                      {m.verified ? "Verified ✓" : "Unverified"}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#1A1A2E]">{m.title}</h5>
                    <p className="text-[10px] font-semibold text-gray-400 truncate mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {statusMessage && (
            <div className="p-4 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-between shadow-md">
              <span>{statusMessage}</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Security & Rule Reminder */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#F0F0FF] text-[#2E2F5B] border border-[#D5D5FF]/60 text-xs font-semibold">
            <span className="text-base shrink-0">🛡️</span>
            <span>
              All disbursements adhere to automatic tax statement generation and AML compliance checks.
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || !!statusMessage}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black text-white uppercase tracking-wider bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:opacity-95 shadow-lg transition-all disabled:opacity-40 cursor-pointer"
          >
            <span>Confirm &amp; Request Disbursement Now</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className="py-3 bg-[#FAF8FF] border-t border-[#EAEAF4] text-center">
          <span className="text-[11px] font-bold text-gray-400">
            Estimated automated gateway arrival: <strong className="text-gray-700">Instant to 2 Business Days</strong>
          </span>
        </div>
        
      </div>
    </div>
  );
}
