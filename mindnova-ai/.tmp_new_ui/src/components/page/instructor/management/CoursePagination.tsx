"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { TOTAL_COURSES } from "./constants/data";

const PAGE_SIZE = 6;
const TOTAL_PAGES = Math.ceil(TOTAL_COURSES / PAGE_SIZE);

export function CoursePagination() {
  const [page, setPage] = useState(1);

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL_COURSES);

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 text-xs">
      <p className="font-bold text-gray-500">
        Hiển thị <span className="text-gray-900">{from}–{to}</span> trong số <span className="text-gray-900">{TOTAL_COURSES}</span> khóa học
      </p>

      <div className="flex items-center gap-1.5" role="navigation" aria-label="Phân trang">
        <button
          id="btn-page-prev"
          type="button"
          aria-label="Trang trước"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            aria-current={p === page ? "page" : undefined}
            onClick={() => setPage(p)}
            className={twMerge(
              "w-8 h-8 rounded-xl font-extrabold transition-all cursor-pointer shadow-2xs",
              p === page
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
          disabled={page === TOTAL_PAGES}
          onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}