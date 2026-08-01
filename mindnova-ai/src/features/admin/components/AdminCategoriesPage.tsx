"use client";

import React, { useState } from "react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
  status: "active" | "archived";
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Next.js Fullstack", slug: "nextjs-fullstack", courseCount: 12, status: "active" },
  { id: "2", name: "AI Engineering & LLM", slug: "ai-engineering", courseCount: 8, status: "active" },
  { id: "3", name: "React Modern Architecture", slug: "react-architecture", courseCount: 15, status: "active" },
  { id: "4", name: "UI/UX & Design Systems", slug: "ui-ux-design", courseCount: 6, status: "archived" },
];

export function AdminCategoriesPage() {
  const [categories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Quản lý danh mục khóa học</h1>
          <p className="text-[14px] font-medium text-[#6B7280] mt-1">
            Tạo mới, phân bổ và tổ chức hệ thống các danh mục học thuật
          </p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          + Thêm danh mục mới
        </button>
      </div>

      {/* Table Section (White Surface, Rule #7) */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[16px] font-bold text-[#111827]">Danh sách danh mục ({categories.length})</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Chưa có danh mục nào được tạo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[12px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-4 px-6">Tên danh mục</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6 text-center">Số khóa học</th>
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Tháo tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {categories.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#111827]">{item.name}</td>
                    <td className="py-4 px-6 font-mono text-gray-500 text-xs">{item.slug}</td>
                    <td className="py-4 px-6 text-center text-[#4F46E5] font-extrabold">{item.courseCount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === "active" 
                          ? "bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100" 
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.status === "active" ? "Hoạt động" : "Lưu trữ"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button className="text-[#4F46E5] hover:underline font-bold text-xs cursor-pointer">Sửa</button>
                      <button className="text-rose-600 hover:underline font-bold text-xs cursor-pointer">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
