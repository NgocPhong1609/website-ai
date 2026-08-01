"use client";

import React from "react";

interface AdminCoursesPageProps {
  filters?: {
    search?: string;
    categoryId?: string;
    level?: string;
  };
}

export function AdminCoursesPage({ filters }: AdminCoursesPageProps) {
  const searchTerm = filters?.search || "";

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Quản lý danh sách khóa học</h1>
          <p className="text-[14px] font-medium text-[#6B7280] mt-1">
            Quản lý toàn bộ nội dung học, phê duyệt khóa học và cập nhật học liệu
          </p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          + Tạo khóa học mới
        </button>
      </div>

      {/* Filter and Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              defaultValue={searchTerm}
              placeholder="Tìm kiếm tên khóa học..."
              className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-[#111827]"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-[#111827]">
              <option value="">Tất cả Trình độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="advanced">Nâng cao</option>
            </select>
            <select className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-[#111827]">
              <option value="">Tất cả Danh mục</option>
              <option value="1">Next.js</option>
              <option value="2">AI Engineering</option>
            </select>
          </div>
        </div>

        {/* Sample Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[12px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                <th className="py-4 px-6">Tên khóa học</th>
                <th className="py-4 px-6">Trình độ</th>
                <th className="py-4 px-6">Học viên</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium">
              <tr className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-[#111827]">Next.js 15 Fullstack Masterclass</td>
                <td className="py-4 px-6 text-[#6B7280]">Chuyên sâu</td>
                <td className="py-4 px-6 text-[#4F46E5] font-extrabold">1,240</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đã xuất bản
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button className="text-[#4F46E5] hover:underline font-bold text-xs cursor-pointer">Quản lý</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-[#111827]">AI Agents &amp; Langchain Deep Dive</td>
                <td className="py-4 px-6 text-[#6B7280]">Nâng cao</td>
                <td className="py-4 px-6 text-[#4F46E5] font-extrabold">856</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                    Đang nháp
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button className="text-[#4F46E5] hover:underline font-bold text-xs cursor-pointer">Quản lý</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
