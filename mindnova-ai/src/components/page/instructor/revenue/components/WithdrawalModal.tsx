import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { XIcon, WalletIcon, PencilIcon, LockIcon, ArrowRightIcon } from "./icons";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [amount, setAmount] = useState("10.000.000");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F0F8]">
          <h2 className="text-[15px] font-extrabold text-[#1A1A2E]">Yêu cầu rút tiền</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#9090B0] hover:bg-[#F4F4FA] hover:text-[#464554] transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* Available Balance Card */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F6F6FB] border border-[#EAEAF4]">
            <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#6B6BFF] flex items-center justify-center shrink-0">
              <WalletIcon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#64647A]">Số dư khả dụng</span>
              <span className="text-[16px] font-extrabold text-[#4648D4]">42.180.000đ</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#464554]">Nhập số tiền muốn rút</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 pl-4 pr-24 rounded-xl border border-[#D0D0E8] text-[15px] font-extrabold text-[#1A1A2E] focus:outline-none focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-2">
                <span className="text-[14px] font-extrabold text-[#1A1A2E]">đ</span>
                <button className="px-3 py-1.5 rounded bg-[#EEF0FF] text-[11px] font-bold text-[#6B6BFF] hover:bg-[#D5D5FF] transition-colors">
                  Tối đa
                </button>
              </div>
            </div>
            <span className="text-[11px] text-[#9090B0] mt-1">
              Phí rút tiền: 0đ <span className="italic">(Miễn phí cho đối tác Instructor Pro)</span>
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#464554]">Phương thức nhận tiền</label>
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#D0D0E8] hover:border-[#C5C6FF] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white border border-[#EAEAF4] rounded flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-extrabold text-[#4648D4]">MB</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-bold text-[#1A1A2E]">MB Bank - **** 1234</span>
                  <span className="text-[11px] font-semibold text-[#9090B0]">NGUYEN VAN A</span>
                </div>
              </div>
              <div className="text-[#9090B0] group-hover:text-[#6B6BFF] transition-colors">
                <PencilIcon size={14} />
              </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F8F8FD] border border-[#EAEAF4]">
            <LockIcon size={14} className="text-[#64647A] shrink-0" />
            <span className="text-[11px] font-medium text-[#64647A]">
              Giao dịch được bảo mật bởi hệ thống mã hóa đa lớp.
            </span>
          </div>

          {/* Action Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.3)] transition-all hover:-translate-y-0.5 mt-2">
            Xác nhận rút tiền <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className="py-4 bg-[#FAFAFE] border-t border-[#F0F0F8] text-center">
          <span className="text-[11px] text-[#9090B0]">
            Thời gian xử lý dự kiến: <strong className="text-[#64647A]">5-10 phút</strong> (trong giờ hành chính)
          </span>
        </div>
        
      </div>
    </div>
  );
}
