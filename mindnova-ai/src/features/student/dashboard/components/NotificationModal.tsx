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
 className="fixed inset-0 z-[100] bg-[#2C3039]/70 backdrop-blur-sm animate-in fade-in duration-200"
 onClick={onClose}
 aria-hidden
 />

 {/* Dialog */}
 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
 <div
 role="dialog"
 aria-modal
 className="pointer-events-auto relative w-full max-w-[600px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200 border border-[#E8E2D9]"
 >
 {/* Header */}
 <div className="flex items-center px-6 py-4 border-b border-[#E8E2D9] relative bg-[#FAF7F2]">
 <button
 type="button"
 onClick={onClose}
 aria-label="Đóng"
 className="absolute left-6 w-8 h-8 rounded-full flex items-center justify-center text-[#8A8478] hover:text-[#C0392B] hover:bg-[#F5F0E8] transition-all duration-150 focus:outline-none"
 >
 <XIcon />
 </button>
 <h2 className="text-[16px] font-bold text-[#2C3039] tracking-tight w-full text-center pr-8 font-[family-name:var(--font-playfair-display)]">
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
 className="ring-2 ring-[#F5F0E8] text-[#C0392B] bg-[#FADBD8]"
 />
 <div>
 <p className="text-[15px] font-bold text-[#2C3039]">{sender.name}</p>
 <p className="text-[12px] text-[#8A8478] font-medium mt-0.5">
 {new Date(notification.created_at).toLocaleString("vi-VN", {
 hour: '2-digit', minute: '2-digit',
 day: '2-digit', month: '2-digit', year: 'numeric'
 })}
 </p>
 </div>
 </div>

 <h3 className="text-[18px] font-bold text-[#2C3039] mb-3 leading-snug font-[family-name:var(--font-playfair-display)]">
 {notification.title}
 </h3>

 <div className="text-[15px] text-[#4A4F5C] leading-relaxed whitespace-pre-wrap">
 {notification.content}
 </div>
 </div>

 {/* Footer CTA */}
 {hasAction && (
 <div className="px-6 py-4 border-t border-[#E8E2D9] bg-[#FAF7F2] flex justify-end">
 <button
 type="button"
 onClick={() => {
 onClose();
 router.push(notification.action_url);
 }}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C0392B] hover:bg-[#A93226] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
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
