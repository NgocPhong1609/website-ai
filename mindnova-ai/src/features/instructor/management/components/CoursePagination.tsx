"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
 <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 text-xs">
 <p className="font-bold text-slate-500">
 Hiển thị <span className="text-slate-900">{from}–{to}</span> trong số <span className="text-slate-900">{totalItems}</span> khóa học
 </p>

 <div className="flex items-center gap-1.5" role="navigation" aria-label="Phân trang">
 <button
 id="btn-page-prev"
 type="button"
 aria-label="Trang trước"
 disabled={currentPage === 1}
 onClick={() => onPageChange(Math.max(1, currentPage - 1))}
 className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
 >
 <ChevronLeft size={16} />
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
 "w-8 h-8 rounded-lg font-semibold transition-all cursor-pointer shadow-sm",
 p === currentPage
 ? "bg-blue-500 text-white border border-blue-500"
 : "text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900"
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
 className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 </div>
 );
}