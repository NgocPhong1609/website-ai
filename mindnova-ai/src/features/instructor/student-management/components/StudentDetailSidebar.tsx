"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export function StudentDetailSidebar({ studentId, onClose }: { studentId: string | null, onClose: () => void }) {
  if (!studentId) return null;

  // Mock for Part 1 - Will be fully implemented in Part 3
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slideInRight">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-black text-gray-900">Chi Tiết Học Viên</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            S
          </div>
          <div className="text-center">
            <h4 className="font-black text-lg text-gray-900">Student {studentId}</h4>
            <p className="text-xs text-gray-500">student{studentId}@example.com</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">HOẠT ĐỘNG</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
          <p className="text-center font-semibold text-gray-500 mb-2">Thông tin chi tiết sẽ được phát triển ở Part 3.</p>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-2 bg-gray-50">
        <button className="py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm">
          Gửi Email
        </button>
        <button className="py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-sm">
          Ghi chú AI
        </button>
      </div>
    </div>
  );
}
