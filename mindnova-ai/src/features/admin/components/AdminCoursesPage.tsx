import { getAdminCoursesPageData } from "@/src/features/admin/services/admin-courses.service";
import { AdminCoursesQuickActions } from "@/src/features/admin/components/AdminCoursesQuickActions";

interface AdminCoursesPageProps {
  filters?: {
    search?: string;
    categoryId?: string;
    level?: string;
  };
}

export async function AdminCoursesPage({ filters }: AdminCoursesPageProps) {
  const data = await getAdminCoursesPageData(filters);

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0f1a3c_0%,#183067_45%,#0284c7_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">Quản lý khóa học</p>
          <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Kiểm duyệt khóa học</h1>
          <p className="mt-2 text-sm text-slate-200/90">
            Theo dõi tình trạng xuất bản và chất lượng nội dung khóa học theo quy trình kiểm duyệt.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <form method="GET" className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
            <span className="font-medium">Tìm theo từ khóa</span>
            <input
              name="search"
              defaultValue={data.filters.search}
              placeholder="Tên khóa học"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Danh mục</span>
            <select
              name="categoryId"
              defaultValue={data.filters.categoryId}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            >
              <option value="">Tất cả danh mục</option>
              {data.filters.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Cấp độ</span>
            <select
              name="level"
              defaultValue={data.filters.level}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
            >
              <option value="">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </label>

          <div className="md:col-span-4">
            <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(79,70,229,0.9)] transition hover:from-cyan-400 hover:to-indigo-400">
              Áp dụng bộ lọc
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Đã xuất bản</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.published}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Bản nháp</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.draft}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
          <p className="text-sm text-slate-500">Chờ duyệt</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.summary.pendingReview}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Tổng quan khóa học</h2>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
            {data.rows.length} khóa học
          </span>
        </div>
        <AdminCoursesQuickActions categories={data.filters.categories} courses={data.rows} />
      </section>
    </div>
  );
}
