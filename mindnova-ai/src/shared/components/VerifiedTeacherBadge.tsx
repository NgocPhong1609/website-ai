"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface VerifiedTeacherBadgeProps {
  isVerified?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showTooltip?: boolean;
}

export function VerifiedTeacherBadge({
  isVerified = true,
  size = "md",
  className = "",
  showTooltip = true,
}: VerifiedTeacherBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    xs: "w-3.5 h-3.5 text-[8px]",
    sm: "w-4 h-4 text-[10px]",
    md: "w-5 h-5 text-[12px]",
    lg: "w-6 h-6 text-[14px]",
  };

  const badgeElement = (
    <span
      className={twMerge(
        "inline-flex items-center justify-center shrink-0 font-bold select-none text-white rounded-full bg-gradient-to-tr from-[#383AB8] via-[#4648D4] to-[#6366F1] shadow-sm shadow-indigo-500/30 transition-transform duration-200 hover:scale-110",
        sizeClasses[size],
        className
      )}
      aria-label="Giáo viên đã được MindNova xác minh"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-[70%] h-[70%]"
        aria-hidden="true"
      >
        {/* 6-pointed Star Badge with Checkmark inside */}
        <path d="M12 2l2.4 3.6 4.3-.6-1.1 4.2 3.4 2.8-3.4 2.8 1.1 4.2-4.3-.6L12 22l-2.4-3.6-4.3.6 1.1-4.2-3.4-2.8 3.4-2.8-1.1-4.2 4.3.6L12 2z" />
        <path
          d="M9.5 12l2 2 4-4"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  if (!showTooltip) return badgeElement;

  return (
    <span className="relative group inline-flex items-center ml-1 align-middle">
      {badgeElement}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
        ✦ Giáo viên đã được MindNova xác minh
      </span>
    </span>
  );
}
