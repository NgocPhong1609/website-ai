"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Avatar } from "@/src/shared/components/ui/Avatar";
import { useRouter } from "next/navigation";

// ─── Local icons ──────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          role="dialog"
          aria-modal
          className="pointer-events-auto relative w-full max-w-[600px] bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200"
        >
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-[#F0F0F8] relative">
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="absolute left-6 w-8 h-8 rounded-full flex items-center justify-center text-[#9090B0] hover:text-[#1A1A2E] hover:bg-[#F4F4FA] transition-all duration-150 focus:outline-none"
            >
              <XIcon />
            </button>
            <h2 className="text-[16px] font-bold text-[#1A1A2E] tracking-tight w-full text-center pr-8">
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
                className="ring-2 ring-[#EAEAF4]"
              />
              <div>
                <p className="text-[15px] font-bold text-[#1A1A2E]">{sender.name}</p>
                <p className="text-[12px] text-[#9090B0] font-medium mt-0.5">
                  {new Date(notification.created_at).toLocaleString("vi-VN", {
                    hour: '2-digit', minute: '2-digit',
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <h3 className="text-[18px] font-bold text-[#1A1A2E] mb-3 leading-snug">
              {notification.title}
            </h3>

            <div className="text-[15px] text-[#464554] leading-relaxed whitespace-pre-wrap">
              {notification.content}
            </div>
          </div>

          {/* Footer CTA */}
          {hasAction && (
            <div className="px-6 py-4 border-t border-[#F0F0F8] bg-[#FAFAFE] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(notification.action_url);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(107,107,255,0.3)] hover:shadow-[0_6px_20px_rgba(107,107,255,0.4)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
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
