"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type AnalyticsResponse = {
 period: string;
 financial: {
 tuition_revenue: number;
 ai_api_cost: number;
 gross_margin: number;
 };
 learning: {
 completed_lessons: number;
 pass: number;
 fail: number;
 pass_rate: number;
 trending_subjects: Array<{ course: string; enrollments: number }>;
 };
 system: {
 traffic: Array<{ date: string; total: number }>;
 guests: number;
 students: number;
 guest_to_student_conversions: number;
 guest_conversion_rate: number;
 };
 course_revenue: Array<{
 course_id: number;
 course: string;
 instructor: string;
 total_orders: number;
 revenue: number;
 }>;
};

const PERIOD_OPTIONS = [
 { value: "weekly", label: "Theo tuần" },
 { value: "monthly", label: "Theo tháng" },
 { value: "yearly", label: "Theo năm" },
];

export function AdminAnalyticsPage() {
 const [period, setPeriod] = useState("monthly");
 const [data, setData] = useState<AnalyticsResponse | null>(null);
 const [message, setMessage] = useState<string | null>(null);

 const loadData = async (nextPeriod: string) => {
 setMessage(null);

 try {
 const payload = await adminApi<AnalyticsResponse>(`/admin/analytics/dashboard?period=${nextPeriod}`);
 setData(payload);
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Không thể tải thống kê.");
 }
 };

 useEffect(() => {
 void loadData(period);
 }, [period]);

 useEffect(() => {
 const handleRefresh = () => {
 void loadData(period);
 };

 window.addEventListener("admin:refresh-data", handleRefresh);
 return () => window.removeEventListener("admin:refresh-data", handleRefresh);
 }, [period]);

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(120deg,#0c1f36_0%,#1d4ed8_46%,#0f766e_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(7,18,45,0.8)]">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <p className="text-[10px] uppercase tracking-[0.34em] -[#FAF7F2]/70">Analytics & Dashboard</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Báo cáo tài chính, học tập và hệ thống</h1>
 </div>

 <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur">
 {PERIOD_OPTIONS.map((option) => (
 <option key={option.value} className="text-slate-900" value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </div>
 </section>

 {!data && <p className="text-sm text-slate-600">Đang tải dữ liệu thống kê...</p>}

 {data && (
 <>
 <section className="grid gap-4 md:grid-cols-3">
 <Box title="Doanh thu học phí" value={formatCurrency(data.financial.tuition_revenue)} />
 <Box title="Chi phí API AI" value={formatCurrency(data.financial.ai_api_cost)} />
 <Box title="Lợi nhuận gộp" value={formatCurrency(data.financial.gross_margin)} />
 </section>

 <section className="grid gap-4 xl:grid-cols-2">
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <div className="mb-3 flex items-center justify-between gap-3">
 <div>
 <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Lưu lượng truy cập</h2>
 <p className="text-sm text-slate-500">Dữ liệu {labelForPeriod(period).toLowerCase()} với đường xu hướng truy cập.</p>
 </div>
 <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold -[#C0392B] ring-1 ring-cyan-100">
 {labelForPeriod(period)}
 </span>
 </div>
 <div className="h-[260px]">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={data.system.traffic}>
 <CartesianGrid stroke="#dbeafe" strokeDasharray="3 3" />
 <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
 <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
 <Tooltip formatter={(value: any) => [`${value.toLocaleString()} lượt`, "Truy cập"]} />
 <Line
 type="monotone"
 dataKey="total"
 stroke="#0891b2"
 strokeWidth={3}
 dot={{ r: 4, fill: "#0891b2", stroke: "#ffffff", strokeWidth: 2 }}
 activeDot={{ r: 6 }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h2 className="mb-3 text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Hiệu suất học tập tổng quan</h2>
 <ul className="space-y-2 text-sm text-slate-700">
 <li>Bài học hoàn thành: {data.learning.completed_lessons}</li>
 <li>Pass: {data.learning.pass}</li>
 <li>Fail: {data.learning.fail}</li>
 <li>Tỷ lệ đỗ: {data.learning.pass_rate}%</li>
 </ul>
 <h3 className="mt-4 text-sm font-semibold text-slate-900">Môn học xu hướng</h3>
 <ul className="mt-2 space-y-2 text-sm text-slate-700">
 {data.learning.trending_subjects.map((item) => (
 <li key={item.course} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
 <span>{item.course}</span>
 <span className="text-xs -[#C0392B]">{item.enrollments} enrollments</span>
 </li>
 ))}
 </ul>
 </div>
 </section>

 <section className="grid gap-4 md:grid-cols-3">
 <Box title="Số Guest hiện tại" value={String(data.system.guests)} />
 <Box title="Guest -> Student" value={String(data.system.guest_to_student_conversions)} />
 <Box title="Tỷ lệ chuyển đổi Guest" value={`${data.system.guest_conversion_rate}%`} />
 </section>

 <section className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4 shadow-[0_14px_32px_-25px_rgba(10,18,40,0.4)]">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Doanh thu theo khóa học</h2>
 <p className="text-sm text-slate-500">So sánh doanh thu của từng khóa học theo {labelForPeriod(period).toLowerCase()}.</p>
 </div>
 <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold -[#2C3039] ring-1 ring-emerald-100">
 {data.course_revenue.length} khóa học có doanh thu
 </span>
 </div>

 <div className="mt-4 overflow-x-auto">
 <table className="min-w-full text-sm">
 <thead className="bg-slate-50 text-slate-600">
 <tr>
 <th className="px-3 py-3 text-left">Khóa học</th>
 <th className="px-3 py-3 text-left">Giảng viên</th>
 <th className="px-3 py-3 text-right">Đơn hàng</th>
 <th className="px-3 py-3 text-right">Doanh thu</th>
 </tr>
 </thead>
 <tbody>
 {data.course_revenue.length === 0 ? (
 <tr>
 <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
 Chưa có doanh thu khóa học trong giai đoạn này.
 </td>
 </tr>
 ) : (
 data.course_revenue.map((item) => (
 <tr key={item.course_id} className="border-t border-slate-200">
 <td className="px-3 py-3">
 <p className="font-medium text-slate-900">{item.course}</p>
 </td>
 <td className="px-3 py-3 text-slate-600">{item.instructor}</td>
 <td className="px-3 py-3 text-right text-slate-600">{item.total_orders}</td>
 <td className="px-3 py-3 text-right font-semibold -[#2C3039]">{formatCurrency(item.revenue)}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </section>
 </>
 )}

 {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
 </div>
 );
}

function Box({ title, value }: { title: string; value: string }) {
 return (
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4 shadow-[0_14px_32px_-25px_rgba(10,18,40,0.4)]">
 <p className="text-sm text-slate-500">{title}</p>
 <p className="mt-2 text-2xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{value}</p>
 </div>
 );
}

function labelForPeriod(period: string): string {
 return PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "Theo tháng";
}

function formatCurrency(value: number): string {
  const rounded = Math.round(value || 0);
  return `${new Intl.NumberFormat("vi-VN").format(rounded)} VNĐ`;
}
