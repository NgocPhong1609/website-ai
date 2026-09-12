"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SingleSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={twMerge("relative w-full", className)} ref={containerRef}>
      {/* Selector Box */}
      <div
        className={twMerge(
          "h-10 w-full rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] transition-all duration-150 cursor-pointer flex items-center justify-between px-3",
          isOpen ? "ring-2 ring-[#3B82F6]/15 border-[#3B82F6]" : "hover:border-[#DBEAFE]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[13px] text-[#0F172A] truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className={twMerge("text-[#9090B0] transition-transform duration-200", isOpen && "rotate-180")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-[#EAEAF4] shadow-lg shadow-[#2563EB]/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-52 overflow-y-auto p-1">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={twMerge(
                    "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors",
                    isSelected
                      ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                      : "text-[#475569] hover:bg-[#F4F4FA]"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-[#3B82F6]" strokeWidth={2.5} aria-hidden />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
