"use client";

// ─── CoursePagination ─────────────────────────────────────────────────────────
// Page navigation for the course grid.

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { TOTAL_COURSES } from "../constants/data";

const PAGE_SIZE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_COURSES / PAGE_SIZE);

export function CoursePagination() {
  const [page, setPage] = useState(1);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL_COURSES);

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between pt-2">
      {/* Info text */}
      <p className="text-sm text-[#9090B0]">
        Hiển thị {from}–{to} trong số {TOTAL_COURSES} khóa học
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1" role="navigation" aria-label="Phân trang">
        {/* Prev */}
        <button
          id="btn-page-prev"
          type="button"
          aria-label="Trang trước"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7878A0] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4] disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
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
            aria-current={p === page ? "page" : undefined}
            onClick={() => setPage(p)}
            className={twMerge(
              "w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150",
              p === page
                ? "bg-[#4648D4] text-white shadow-[0_2px_8px_rgba(70,72,212,0.4)]"
                : "text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4]",
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
          disabled={page === TOTAL_PAGES}
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7878A0] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#4648D4] disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
