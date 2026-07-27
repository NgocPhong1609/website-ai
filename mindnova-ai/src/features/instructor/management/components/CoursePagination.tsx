"use client";

// ─── CoursePagination ─────────────────────────────────────────────────────────
// Page navigation for the course grid.

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
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // We show up to 5 pages for simplicity (1, 2, 3, 4, 5)
  // Or just all pages if it's small.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-center pt-8 pb-4">
      <div className="flex items-center gap-2.5" role="navigation" aria-label="Phân trang">
        {/* Prev */}
        <button
          id="btn-page-prev"
          type="button"
          aria-label="Trang trước"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#B0B0C8] border border-[#F0F0F8] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4] hover:border-[#EAEAF4] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 shadow-sm"
        >
          <ChevronLeftIcon />
        </button>

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            id={`btn-page-${p}`}
            type="button"
            aria-label={`Trang ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={twMerge(
              "w-11 h-11 rounded-2xl text-[15px] font-bold transition-all duration-300 flex items-center justify-center",
              p === currentPage
                ? "bg-[#4648D4] text-white shadow-[0_8px_20px_rgba(70,72,212,0.35)] -translate-y-0.5"
                : "text-[#64647A] border border-[#F0F0F8] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4] hover:border-[#EAEAF4] shadow-sm",
            )}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          id="btn-page-next"
          type="button"
          aria-label="Trang sau"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#B0B0C8] border border-[#F0F0F8] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4] hover:border-[#EAEAF4] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 shadow-sm"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
