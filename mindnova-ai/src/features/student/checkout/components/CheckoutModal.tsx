"use client";

import React from "react";
import { X, ShoppingCart } from "lucide-react";
import { CheckoutView } from "./CheckoutView";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
}

export function CheckoutModal({ isOpen, onClose, courseId }: CheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-[#0F172A]">Thanh toán khóa học</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto">
          <CheckoutView courseId={courseId} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
