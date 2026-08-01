"use client";

import React from "react";

interface AdminInvoicesPageProps {
  filters?: {
    search?: string;
    status?: string;
    paymentMethod?: string;
  };
}

export function AdminInvoicesPage({ filters }: AdminInvoicesPageProps) {
  const searchTerm = filters?.search || "";

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Quản lý Hóa đơn &amp; Giao dịch</h1>
          <p className="text-[14px] font-medium text-[#6B7280] mt-1">
            Trao đổi, kiểm soát dòng tiền và lịch sử giao dịch toàn hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 text-[#111827] font-bold text-sm rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            defaultValue={searchTerm}
            placeholder="Tìm mã hóa đơn hoặc email..."
            className="w-full sm:w-80 px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-[#111827]"
          />
          <div className="flex gap-2">
            <select className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-[#111827]">
              <option value="">Tất cả trạng thái</option>
              <option value="paid">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
            <select className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-[#111827]">
              <option value="">Tất cả cổng thanh toán</option>
              <option value="vnpay">VNPay</option>
              <option value="momo">MoMo</option>
              <option value="banking">Chuyển khoản</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[12px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                <th className="py-4 px-6">Mã Giao Dịch</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Số tiền</th>
                <th className="py-4 px-6">Cổng thanh toán</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium">
              <tr className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-[#111827]">INV-893241</td>
                <td className="py-4 px-6 text-[#6B7280]">ngocphong@gmail.com</td>
                <td className="py-4 px-6 font-extrabold text-[#111827]">1,490,000 đ</td>
                <td className="py-4 px-6 font-bold text-[#4F46E5]">VNPay</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Thành công
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/70 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-[#111827]">INV-893200</td>
                <td className="py-4 px-6 text-[#6B7280]">hieu2k@gmail.com</td>
                <td className="py-4 px-6 font-extrabold text-[#111827]">890,000 đ</td>
                <td className="py-4 px-6 font-bold text-[#4F46E5]">MoMo</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Đang xử lý
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
