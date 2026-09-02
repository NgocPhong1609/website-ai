"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { AdminRevenueData } from "@/src/features/admin/types";

const formatMoney = (value: number) => {
  const rounded = Math.round(value || 0);
  return `${new Intl.NumberFormat("vi-VN").format(rounded)} VNĐ`;
};

const ITEMS_PER_PAGE = 10;

export function AdminRevenueView({ data }: { data: AdminRevenueData }) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "REFUNDED" | "PENDING" | "AVAILABLE">("ALL");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("ALL");
  const [teacherSearchInput, setTeacherSearchInput] = useState<string>("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const teacherDropdownRef = useRef<HTMLDivElement>(null);

  const totalAdmin = data.totalAdminRevenue ?? (data.totalRevenue * 0.30);
  const totalTeacher = data.totalTeacherRevenue ?? (data.totalRevenue * 0.70);
  const orderHistory = data.orderHistory ?? [];

  // Get unique list of instructor names
  const uniqueTeachers = useMemo(() => {
    const set = new Set<string>();
    orderHistory.forEach((o) => {
      if (o.instructorName && o.instructorName !== "Unassigned") {
        set.add(o.instructorName);
      }
    });
    return Array.from(set).sort();
  }, [orderHistory]);

  // Filter matching teachers for dropdown options when user types
  const matchingTeacherOptions = useMemo(() => {
    if (!teacherSearchInput.trim()) {
      return uniqueTeachers;
    }
    const query = teacherSearchInput.toLowerCase();
    return uniqueTeachers.filter((t) => t.toLowerCase().includes(query));
  }, [uniqueTeachers, teacherSearchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate Refund Audit Aggregates for all orders
  const refundedOrders = orderHistory.filter((o) => o.allocationStatus === "REFUNDED" || o.orderStatus === "refunded");
  const totalRefundedToStudents = refundedOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalTeacherDeducted = refundedOrders.reduce((sum, o) => sum + o.teacherAmount, 0);
  const totalAdminDeducted = refundedOrders.reduce((sum, o) => sum + o.adminAmount, 0);

  // Filtered order history based on status, teacher, and date range
  const filteredOrderHistory = useMemo(() => {
    return orderHistory.filter((ord) => {
      // 1. Status Filter
      if (statusFilter === "REFUNDED" && !(ord.allocationStatus === "REFUNDED" || ord.orderStatus === "refunded")) {
        return false;
      }
      if (statusFilter === "PENDING" && ord.allocationStatus !== "PENDING") {
        return false;
      }
      if (statusFilter === "AVAILABLE" && ord.allocationStatus !== "AVAILABLE") {
        return false;
      }

      // 2. Teacher Filter
      if (selectedTeacher !== "ALL" && ord.instructorName !== selectedTeacher) {
        return false;
      }
      if (teacherSearchInput.trim() !== "" && selectedTeacher === "ALL") {
        const query = teacherSearchInput.toLowerCase();
        const teacherName = (ord.instructorName || "").toLowerCase();
        if (!teacherName.includes(query)) {
          return false;
        }
      }

      // 3. Date Range Filter (purchasedAt format: DD/MM/YYYY HH:mm)
      if (startDate || endDate) {
        const [datePart] = ord.purchasedAt.split(" ");
        const [day, month, year] = datePart.split("/");
        const itemDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        if (startDate && itemDateStr < startDate) {
          return false;
        }
        if (endDate && itemDateStr > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [orderHistory, statusFilter, selectedTeacher, teacherSearchInput, startDate, endDate]);

  // Reset page to 1 when filters change
  const handleFilterChange = (setter: () => void) => {
    setter();
    setCurrentPage(1);
  };

  const handleSelectTeacherOption = (teacherName: string) => {
    handleFilterChange(() => {
      if (teacherName === "ALL") {
        setSelectedTeacher("ALL");
        setTeacherSearchInput("");
      } else {
        setSelectedTeacher(teacherName);
        setTeacherSearchInput(teacherName);
      }
      setIsTeacherDropdownOpen(false);
    });
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOrderHistory.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrderHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const resetAllFilters = () => {
    setStatusFilter("ALL");
    setSelectedTeacher("ALL");
    setTeacherSearchInput("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 px-5 lg:px-6 pt-2.5 pb-8 [font-family:var(--font-admin-body)]">
      {/* Header Banner */}
      <section className="rounded-2xl border border-white/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] py-4 px-6 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/65">Revenue Analytics & Audit</p>
        <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Doanh thu &amp; Lịch sử Hoàn tiền Cấn trừ</h1>
        <p className="mt-1 max-w-3xl text-xs text-slate-200/90 leading-relaxed">
          Quản lý tổng doanh thu, phí nền tảng Admin thực nhận, thu nhập giảng viên và đối soát chi tiết từng lệnh **Hoàn tiền / Cấn trừ thu nhập**.
        </p>
      </section>

      {/* Overview Metric Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh thu Admin (Thực nhận)</p>
          <p className="mt-2 text-2xl font-black text-indigo-700 [font-family:var(--font-admin-head)]">
            {formatMoney(totalAdmin)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">Phí hệ thống 15% - 30%</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thu nhập Giảng viên</p>
          <p className="mt-2 text-2xl font-black text-emerald-600 [font-family:var(--font-admin-head)]">
            {formatMoney(totalTeacher)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">Tỷ lệ chi trả 70% - 85%</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng giá trị Học phí</p>
          <p className="mt-2 text-2xl font-black text-slate-900 [font-family:var(--font-admin-head)]">
            {formatMoney(data.totalRevenue)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">{data.courseCount} khóa học có doanh thu</p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Tổng Hoàn tiền Học viên</p>
          <p className="mt-2 text-2xl font-black text-rose-700 [font-family:var(--font-admin-head)]">
            -{formatMoney(totalRefundedToStudents)}
          </p>
          <p className="mt-1 text-[11px] text-rose-600 font-medium">
            {refundedOrders.length} đơn đã hoàn ({formatMoney(totalTeacherDeducted)} GV + {formatMoney(totalAdminDeducted)} Ad)
          </p>
        </div>
      </section>

      {/* Info Callout Banner */}
      <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs font-medium text-amber-950 flex items-start gap-3 shadow-2xs">
        <span className="text-base shrink-0">⚖️</span>
        <div className="leading-relaxed">
          <strong className="font-extrabold text-amber-900">Quy tắc Cấn trừ Tiền khi Học sinh Hoàn tiền:</strong>
          <p className="mt-0.5 text-amber-800">
            Khi học sinh yêu cầu hoàn tiền thành công (trong vòng 30 ngày &amp; tiến độ ≤ 10% / ≤ 5 bài), học sinh nhận lại 100% số tiền đã trả. Hệ thống tự động **cấn trừ đúng số tiền đã giữ của Giảng viên (70%/85%)** và **Admin (30%/15%)** thuộc chính đơn hàng đó về 0.
          </p>
        </div>
      </div>

      {/* SECTION 1: Order Purchase History & Refund Deduction Audit */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 [font-family:var(--font-admin-head)] flex items-center gap-2">
                <span>🧾 Lịch Sử Mua Hàng &amp; Nhật Ký Cấn Trừ Hoàn Tiền</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {filteredOrderHistory.length} Giao dịch
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lọc nâng cao theo Giáo viên, Thời gian và Trạng thái (Phân trang 10 giao dịch / trang).
              </p>
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleFilterChange(() => setStatusFilter("ALL"))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất cả ({orderHistory.length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange(() => setStatusFilter("REFUNDED"))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "REFUNDED"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-rose-700 hover:bg-rose-100/70"
                }`}
              >
                ❌ Đã hoàn tiền ({refundedOrders.length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange(() => setStatusFilter("PENDING"))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "PENDING"
                    ? "bg-amber-500 text-white shadow-2xs"
                    : "text-amber-800 hover:bg-amber-100/70"
                }`}
              >
                ⏳ Tạm giữ (HOLD)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange(() => setStatusFilter("AVAILABLE"))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === "AVAILABLE"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-emerald-800 hover:bg-emerald-100/70"
                }`}
              >
                ✅ Khả dụng
              </button>
            </div>
          </div>

          {/* ADVANCED FILTER BAR: Teacher Autocomplete Combobox & Date Range */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2 border-t border-slate-200/60">
            {/* LIVE TEACHER AUTOCOMPLETE COMBOBOX */}
            <div className="space-y-1 relative" ref={teacherDropdownRef}>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>👨‍🏫 Tìm &amp; Chọn Giáo viên:</span>
                {selectedTeacher !== "ALL" && (
                  <span className="text-indigo-600 font-extrabold normal-case">
                    Đã chọn: {selectedTeacher}
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={teacherSearchInput}
                  onFocus={() => setIsTeacherDropdownOpen(true)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTeacherSearchInput(val);
                    setSelectedTeacher("ALL");
                    setIsTeacherDropdownOpen(true);
                    setCurrentPage(1);
                  }}
                  placeholder="Gõ tên giảng viên để hiện gợi ý chọn..."
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs transition-all"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>

                {teacherSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherSearchInput("");
                      setSelectedTeacher("ALL");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* FLOATING AUTOCOMPLETE DROPDOWN MENU */}
              {isTeacherDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div
                    onClick={() => handleSelectTeacherOption("ALL")}
                    className={`px-3 py-2 text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${
                      selectedTeacher === "ALL"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>-- tất cả giảng viên --</span>
                    <span className="text-[10px] text-slate-400">({uniqueTeachers.length} giảng viên)</span>
                  </div>

                  {matchingTeacherOptions.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center font-medium">
                      Không tìm thấy giảng viên trùng khớp &quot;{teacherSearchInput}&quot;
                    </div>
                  ) : (
                    matchingTeacherOptions.map((tName) => {
                      const isSelected = selectedTeacher === tName;
                      return (
                        <div
                          key={tName}
                          onClick={() => handleSelectTeacherOption(tName)}
                          className={`px-3 py-2 text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected
                              ? "bg-indigo-600 text-white font-extrabold"
                              : "text-slate-800 hover:bg-indigo-50 hover:text-indigo-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>👨‍🏫</span>
                            <span>{tName}</span>
                          </div>
                          {isSelected && <span className="text-xs">✓</span>}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Date Range: From Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                📅 Từ ngày mua:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleFilterChange(() => setStartDate(e.target.value))}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              />
            </div>

            {/* Date Range: To Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                📅 Đến ngày mua:
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleFilterChange(() => setEndDate(e.target.value))}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                />
                {(selectedTeacher !== "ALL" || teacherSearchInput || startDate || endDate || statusFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="shrink-0 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                    title="Xóa tất cả bộ lọc"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order History Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-[11px] uppercase tracking-[0.12em] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-extrabold">Mã đơn hàng</th>
                <th className="px-4 py-3 font-extrabold">Thời gian mua</th>
                <th className="px-4 py-3 font-extrabold">Học viên</th>
                <th className="px-4 py-3 font-extrabold">Khóa học &amp; Giảng viên</th>
                <th className="px-4 py-3 font-extrabold text-right">Giá gốc</th>
                <th className="px-4 py-3 font-extrabold text-right">Mã giảm giá</th>
                <th className="px-4 py-3 font-extrabold text-right">Giá thực trả</th>
                <th className="px-4 py-3 font-extrabold text-center">Tỷ lệ</th>
                <th className="px-4 py-3 font-extrabold text-right text-emerald-700">GV Nhận / Cấn trừ</th>
                <th className="px-4 py-3 font-extrabold text-right text-indigo-700">Admin Nhận / Cấn trừ</th>
                <th className="px-4 py-3 font-extrabold text-center">Trạng thái &amp; Thời gian hoàn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-5 py-8 text-center text-slate-500 font-medium">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const isExclusive = ord.partnershipTier === "exclusive";
                  const isRefunded = ord.allocationStatus === "REFUNDED" || ord.orderStatus === "refunded";
                  const isPending = ord.allocationStatus === "PENDING";

                  return (
                    <tr
                      key={`${ord.orderId}-${ord.courseTitle}`}
                      className={`transition-colors ${
                        isRefunded ? "bg-rose-50/30 hover:bg-rose-50/60" : "hover:bg-slate-50/70"
                      }`}
                    >
                      {/* Order Code */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{ord.transactionCode}</span>
                      </td>

                      {/* Purchased At (Time) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-slate-700 block text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200/80 w-fit">
                          📅 {ord.purchasedAt}
                        </span>
                      </td>

                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{ord.studentName}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{ord.studentEmail}</span>
                      </td>

                      {/* Course & Instructor */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <span className="font-bold text-slate-900 block truncate">{ord.courseTitle}</span>
                        <span className="text-[10px] text-slate-600 block font-medium">👨‍🏫 {ord.instructorName}</span>
                      </td>

                      {/* Original Price */}
                      <td className="px-4 py-3.5 text-right font-medium text-slate-500 whitespace-nowrap">
                        {formatMoney(ord.originalPrice)}
                      </td>

                      {/* Discount Amount */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {ord.discountAmount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-extrabold text-[11px] border border-rose-200">
                            -{formatMoney(ord.discountAmount)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">0 VNĐ</span>
                        )}
                      </td>

                      {/* Paid Amount / Refunded Pill */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isRefunded ? (
                          <div>
                            <span className="line-through text-slate-400 block text-[11px]">{formatMoney(ord.paidAmount)}</span>
                            <span className="font-extrabold text-rose-700 block text-xs bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200 mt-0.5">
                              ❌ Hoàn {formatMoney(ord.paidAmount)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-slate-900 block">{formatMoney(ord.paidAmount)}</span>
                        )}
                      </td>

                      {/* Tier Badge */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {isExclusive ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800 ring-1 ring-emerald-200">
                            85 / 15
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-800 ring-1 ring-blue-200">
                            70 / 30
                          </span>
                        )}
                      </td>

                      {/* Teacher Amount / Deduction */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isRefunded ? (
                          <div>
                            <span className="font-black text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200 block text-right">
                              -{formatMoney(ord.teacherAmount)}
                            </span>
                            <span className="text-[10px] text-rose-600 block text-right font-semibold mt-0.5">Đã cấn trừ GV</span>
                          </div>
                        ) : (
                          <span className="font-black text-emerald-600 block">{formatMoney(ord.teacherAmount)}</span>
                        )}
                      </td>

                      {/* Admin Amount / Deduction */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isRefunded ? (
                          <div>
                            <span className="font-black text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200 block text-right">
                              -{formatMoney(ord.adminAmount)}
                            </span>
                            <span className="text-[10px] text-rose-600 block text-right font-semibold mt-0.5">Đã cấn trừ Ad</span>
                          </div>
                        ) : (
                          <span className="font-black text-indigo-600 block">{formatMoney(ord.adminAmount)}</span>
                        )}
                      </td>

                      {/* Status & Refund Timestamp */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {isRefunded ? (
                          <div>
                            <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black text-rose-800 border border-rose-300 shadow-2xs">
                              ❌ Đã hoàn tiền
                            </span>
                            {ord.refundedAt && (
                              <span className="text-[10px] font-bold text-rose-700 block mt-1 bg-white/80 px-1.5 py-0.5 rounded border border-rose-200/80">
                                🕒 Hoàn: {ord.refundedAt}
                              </span>
                            )}
                          </div>
                        ) : isPending ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-800 ring-1 ring-amber-200">
                            ⏳ Tạm giữ (HOLD)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-800 ring-1 ring-emerald-200">
                            ✅ Khả dụng
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER CONTROLS */}
        {filteredOrderHistory.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
            <div>
              Hiển thị <span className="font-bold text-slate-900">{startIndex + 1}</span> -{" "}
              <span className="font-bold text-slate-900">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrderHistory.length)}
              </span>{" "}
              trên tổng số <span className="font-bold text-indigo-700">{filteredOrderHistory.length}</span> đơn hàng
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer font-bold"
              >
                ◀ Trang trước
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer font-bold"
              >
                Trang sau ▶
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: Course Summary Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 [font-family:var(--font-admin-head)]">Tổng hợp Doanh thu &amp; Phân chia theo Khóa học</h2>
          <span className="text-xs text-slate-500 font-medium">Đã cập nhật theo thời gian thực</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-bold">Khóa học</th>
                <th className="px-5 py-3.5 font-bold">Giảng viên</th>
                <th className="px-5 py-3.5 font-bold text-center">Cấp độ hợp tác</th>
                <th className="px-5 py-3.5 font-bold text-right">Học viên</th>
                <th className="px-5 py-3.5 font-bold text-right">Tổng giá trị</th>
                <th className="px-5 py-3.5 font-bold text-right text-emerald-700">GV nhận</th>
                <th className="px-5 py-3.5 font-bold text-right text-indigo-700">Admin nhận</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    Chưa có dữ liệu doanh thu từ khóa học nào.
                  </td>
                </tr>
              ) : (
                data.courses.map((course) => {
                  const isExclusive = course.partnershipTier === "exclusive";
                  const gross = course.grossRevenue ?? course.revenue;
                  const teacherGet = course.teacherRevenue ?? (gross * (isExclusive ? 0.85 : 0.70));
                  const adminGet = course.adminRevenue ?? (gross * (isExclusive ? 0.15 : 0.30));

                  return (
                    <tr key={course.courseId} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">{course.courseTitle}</td>
                      <td className="px-5 py-4 text-slate-600">{course.instructorName}</td>
                      <td className="px-5 py-4 text-center">
                        {isExclusive ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                            Độc quyền (85%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
                            Tiêu chuẩn (70%)
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-slate-600">{course.students}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">{formatMoney(gross)}</td>
                      <td className="px-5 py-4 text-right font-bold text-emerald-600">{formatMoney(teacherGet)}</td>
                      <td className="px-5 py-4 text-right font-bold text-indigo-600">{formatMoney(adminGet)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
