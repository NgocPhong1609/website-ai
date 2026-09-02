import { getAdminRevenueData } from "@/src/features/admin/services/admin-module-data.service";

const formatMoney = (value: number) => {
  const rounded = Math.round(value || 0);
  return `${new Intl.NumberFormat("vi-VN").format(rounded)} VNĐ`;
};

export async function AdminRevenuePage() {
  const data = await getAdminRevenueData();

  const totalAdmin = data.totalAdminRevenue ?? (data.totalRevenue * 0.30);
  const totalTeacher = data.totalTeacherRevenue ?? (data.totalRevenue * 0.70);

  return (
    <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
      <section className="rounded-2xl border border-white/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/65">Revenue Analytics</p>
        <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Doanh thu &amp; Phân chia Hợp tác</h1>
        <p className="mt-1 max-w-2xl text-xs text-slate-200/90">
          Tổng doanh thu, phí nền tảng Admin thực nhận và thu nhập giảng viên dựa trên cấp độ hợp tác (Tiêu chuẩn 70/30 vs Độc quyền 85/15).
        </p>
      </section>

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

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khóa học doanh thu cao nhất</p>
          <p className="mt-2 text-base font-bold text-slate-900 truncate [font-family:var(--font-admin-head)]">
            {data.courses[0]?.courseTitle ?? "Chưa có dữ liệu"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 font-medium">
            {data.courses[0] ? formatMoney(data.courses[0].grossRevenue ?? data.courses[0].revenue) : "0 VNĐ"}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 [font-family:var(--font-admin-head)]">Chi tiết Doanh thu &amp; Phân chia theo Khóa học</h2>
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
