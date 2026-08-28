import { TeacherApprovalTable } from "@/src/features/admin/components/TeacherApprovalTable";
import { getTeacherApprovalsData } from "@/src/features/admin/services/admin-module-data.service";

export async function AdminTeacherApprovalsPage() {
 const data = await getTeacherApprovalsData();

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(13,23,56,0.95)]">
 <p className="text-[10px] uppercase tracking-[0.35em] -[#FAF7F2]/65">Teacher Verification & Blue Tick Badge</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Duyệt xác minh giáo viên</h1>
 <p className="mt-1 max-w-2xl text-xs text-slate-200/90">
 Xem xét bằng cấp, tài liệu minh chứng riêng tư và thông tin chuyên môn để quyết định cấp hoặc thu hồi tích xanh xác minh.
 </p>
 </section>

 <TeacherApprovalTable rows={data.rows} />
 </div>
 );
}
