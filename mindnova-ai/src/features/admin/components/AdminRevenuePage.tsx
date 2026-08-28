import { getAdminRevenueData } from "@/src/features/admin/services/admin-module-data.service";

const formatMoney = (value: number) =>
 new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export async function AdminRevenuePage() {
 const data = await getAdminRevenueData();

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
 <p className="text-[10px] uppercase tracking-[0.35em] -[#FAF7F2]/65">Revenue</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Doanh thu</h1>
 <p className="mt-1 max-w-2xl text-xs text-slate-200/90">
 Tổng doanh thu và doanh thu theo từng khóa học được lấy từ dữ liệu thanh toán thực tế.
 </p>
 </section>

 <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <p className="text-sm text-slate-500">Tổng doanh thu</p>
 <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
 {formatMoney(data.totalRevenue)}
 </p>
 </div>

 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <p className="text-sm text-slate-500">Số khóa có doanh thu</p>
 <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
 {data.courseCount}
 </p>
 </div>

 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <p className="text-sm text-slate-500">Khóa học cao nhất</p>
 <p className="mt-3 text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
 {data.courses[0]?.courseTitle ?? "Chưa có dữ liệu"}
 </p>
 </div>
 </section>

 <section className="overflow-hidden rounded-2xl border -[#FAF7F2]/80 bg-white/95 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <div className="overflow-x-auto">
 <table className="min-w-full text-left text-sm text-slate-700">
 <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
 <tr>
 <th className="px-5 py-4">Khóa học</th>
 <th className="px-5 py-4">Giảng viên</th>
 <th className="px-5 py-4">Học viên</th>
 <th className="px-5 py-4">Doanh thu</th>
 <th className="px-5 py-4">Tỷ lệ chuyển đổi</th>
 </tr>
 </thead>
 <tbody>
 {data.courses.length === 0 ? (
 <tr>
 <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
 Chưa có dữ liệu doanh thu từ khóa học nào.
 </td>
 </tr>
 ) : (
 data.courses.map((course) => (
 <tr key={course.courseId} className="border-t border-slate-100">
 <td className="px-5 py-4 font-medium text-slate-900">{course.courseTitle}</td>
 <td className="px-5 py-4">{course.instructorName}</td>
 <td className="px-5 py-4">{course.students}</td>
 <td className="px-5 py-4 font-semibold -[#2C3039]">{formatMoney(course.revenue)}</td>
 <td className="px-5 py-4">{course.conversionRate.toFixed(1)}%</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </section>
 </div>
 );
}
