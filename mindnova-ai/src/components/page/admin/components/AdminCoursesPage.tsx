import { AdminCoursesQuickActions } from "@/src/features/admin/components/AdminCoursesQuickActions";
import { getAdminCoursesPageData } from "@/src/features/admin/services/admin-courses.service";

export async function AdminCoursesPage() {
  const data = await getAdminCoursesPageData();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[28px] bg-gradient-to-r from-violet-700 to-cyan-600 p-6 text-white shadow-[0_20px_60px_-25px_rgba(91,33,182,0.8)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Course Management</p>
            <h1 className="mt-2 text-2xl font-semibold">Quản lý khóa học</h1>
            <p className="mt-2 text-sm text-white/80">
              Theo dõi nội dung, tiến độ học viên và trạng thái xuất bản khoá học.
            </p>
          </div>

          <AdminCoursesQuickActions />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.published}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Draft</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.draft}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data.summary.pendingReview}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Course overview</h2>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {data.rows.length} courses
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Learners</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((course) => (
                <tr key={course.name} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-3 font-medium text-slate-900">{course.name}</td>
                  <td className="px-4 py-3 text-slate-600">{course.learners}</td>
                  <td className="px-4 py-3 text-slate-600">{course.progress}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
