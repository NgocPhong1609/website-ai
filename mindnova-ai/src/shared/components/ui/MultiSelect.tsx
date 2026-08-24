"use client";

import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn khóa học...",
  loading = false,
  emptyText = "Không có dữ liệu",
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (optValue: string | number) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const removeOption = (e: React.MouseEvent, optValue: string | number) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  return (
    <div className={twMerge("relative w-full", className)} ref={containerRef}>
      {/* Selector Box */}
      <div
        className={twMerge(
          "min-h-10 w-full rounded-xl border border-[#DDDDF0] bg-[#FAFAFE] transition-all duration-150 cursor-pointer flex items-center justify-between px-2",
          isOpen ? "ring-2 ring-[#6B6BFF]/15 border-[#6B6BFF]" : "hover:border-[#C5C6FF]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1.5 py-1.5 flex-1 items-center">
          {selectedOptions.length === 0 ? (
            <span className="text-sm text-[#C4C4D8] px-1">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="flex items-center gap-1 bg-[#EEF0FF] text-[#4648D4] text-[12px] font-semibold px-2 py-1 rounded-md"
              >
                <span className="truncate max-w-[140px] block" title={opt.label}>
                  {opt.label}
                </span>
                <button
                  type="button"
                  onClick={(e) => removeOption(e, opt.value)}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-[#D5D5FF] text-[#4648D4] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
        
        {/* Actions (Clear All / Chevron) */}
        <div className="flex items-center gap-1 pl-1">
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="w-6 h-6 flex items-center justify-center text-[#9090B0] hover:text-[#FF4D4F] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          <div className={twMerge("text-[#9090B0] transition-transform duration-200", isOpen && "rotate-180")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-[#EAEAF4] shadow-lg shadow-[#4648D4]/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="p-2 border-b border-[#F0F0F8]">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#FAFAFE] border border-[#DDDDF0] rounded-lg px-3 py-1.5 text-[13px] text-[#1A1A2E] placeholder-[#C4C4D8] focus:outline-none focus:border-[#6B6BFF] transition-colors"
            />
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center py-4 text-[13px] text-[#9090B0]">
                <span className="w-4 h-4 rounded-full border-2 border-[#EAEAF4] border-t-[#6B6BFF] animate-spin mr-2" />
                Đang tải...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-[13px] text-[#9090B0]">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt.value);
                    }}
                    className={twMerge(
                      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[13px] transition-colors",
                      isSelected
                        ? "bg-[#EEF0FF] text-[#4648D4] font-semibold"
                        : "text-[#464554] hover:bg-[#F4F4FA]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6BFF]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
