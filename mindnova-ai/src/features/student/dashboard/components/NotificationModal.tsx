"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { useRouter } from "next/navigation";

// ─── Local icons ──────────────────────────────────────────────────────────────

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationModalProps {
 isOpen: boolean;
 onClose: () => void;
 notification: any; // Using any for quick integration, can be typed properly
}

export function NotificationModal({ isOpen, onClose, notification }: NotificationModalProps) {
 const router = useRouter();

 // Trap focus & handle ESC
 useEffect(() => {
 if (!isOpen) return;
 const handleKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 };
 document.body.style.overflow = "hidden"; // Prevent background scrolling
 document.addEventListener("keydown", handleKey);
 return () => {
 document.body.style.overflow = "unset";
 document.removeEventListener("keydown", handleKey);
 };
 }, [isOpen, onClose]);

 if (!isOpen || !notification) return null;

 const sender = notification.sender || { name: "Hệ thống MindNova", avatar: "" };
 const hasAction = !!notification.action_url;

 return (
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0 z-[100] bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200"
 onClick={onClose}
 aria-hidden
 />

 {/* Dialog */}
 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
 <div
 role="dialog"
 aria-modal
 className="pointer-events-auto relative w-full max-w-[600px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200 border border-[#E2E8F0]"
 >
 {/* Header */}
 <div className="flex items-center px-6 py-4 border-b border-[#E2E8F0] relative bg-[#F8FAFC]">
 <button
 type="button"
 onClick={onClose}
 aria-label="Đóng"
 className="absolute left-6 w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#F1F5F9] transition-all duration-150 focus:outline-none"
 >
 <XIcon />
 </button>
 <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight w-full text-center pr-8 font-serif">
 Chi tiết thông báo
 </h2>
 </div>

 {/* Body */}
 <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
 <div className="flex items-center gap-3 mb-5">
 <Avatar
 fallback={sender.name.substring(0, 2).toUpperCase()}
 src={sender.avatar}
 size="lg"
 className="ring-2 ring-[#F1F5F9] text-[#3B82F6] bg-[#EFF6FF]"
 />
 <div>
 <p className="text-[15px] font-bold text-[#0F172A]">{sender.name}</p>
 <p className="text-[12px] text-[#64748B] font-medium mt-0.5">
 {new Date(notification.created_at).toLocaleString("vi-VN", {
 hour: '2-digit', minute: '2-digit',
 day: '2-digit', month: '2-digit', year: 'numeric'
 })}
 </p>
 </div>
 </div>

 <h3 className="text-[18px] font-bold text-[#0F172A] mb-3 leading-snug font-serif">
 {notification.title}
 </h3>

 <div className="text-[15px] text-[#64748B] leading-relaxed whitespace-pre-wrap">
 {notification.content}
 </div>
 </div>

 {/* Footer CTA */}
 {hasAction && (
 <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
 <button
 type="button"
 onClick={() => {
 onClose();
 router.push(notification.action_url);
 }}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
 >
 Đến nội dung liên quan
 <ArrowRightIcon />
 </button>
 </div>
 )}
 </div>
 </div>
 </>
 );
}
