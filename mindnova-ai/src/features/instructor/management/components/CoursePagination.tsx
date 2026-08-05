"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface CoursePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function CoursePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: CoursePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalItems <= pageSize && totalItems !== 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 text-xs">
      <p className="font-bold text-gray-500">
        Hiển thị <span className="text-gray-900">{from}–{to}</span> trong số <span className="text-gray-900">{totalItems}</span> khóa học
      </p>

      <div className="flex items-center gap-1.5" role="navigation" aria-label="Phân trang">
        <button
          id="btn-page-prev"
          type="button"
          aria-label="Trang trước"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeftIcon />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            id={`btn-page-${p}`}
            type="button"
            aria-label={`Trang ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={twMerge(
              "w-8 h-8 rounded-xl font-extrabold transition-all cursor-pointer shadow-2xs",
              p === currentPage
                ? "bg-[#4F46E5] text-white border border-[#4F46E5]"
                : "text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {p}
          </button>
        ))}

        <button
          id="btn-page-next"
          type="button"
          aria-label="Trang sau"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}