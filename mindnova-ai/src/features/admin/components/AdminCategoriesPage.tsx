import { AdminCategoriesQuickActions } from "@/src/features/admin/components/AdminCategoriesQuickActions";
import { getAdminCategoriesPageData } from "@/src/features/admin/services/admin-categories.service";

export async function AdminCategoriesPage() {
 const data = await getAdminCategoriesPageData();

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="mn-stagger rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(125deg,#10223f_0%,#0f3f5f_50%,#0f766e_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
 <div>
 <p className="text-[10px] uppercase tracking-[0.35em] -[#FAF7F2]/70">Danh mục khóa học</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Kiểm duyệt danh mục khóa học</h1>
 <p className="mt-1 text-xs text-slate-200/90">Theo dõi trạng thái danh mục để đảm bảo nội dung hiển thị đúng tiêu chuẩn kiểm duyệt.</p>
 </div>
 </section>

 <section className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
 <div className="mb-4 flex items-center justify-between gap-3">
 <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Danh sách danh mục</h2>
 <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold -[#C0392B] ring-1 ring-teal-100">{data.rows.length} danh mục</span>
 </div>
 <AdminCategoriesQuickActions rows={data.rows} />
 </section>
 </div>
 );
}
