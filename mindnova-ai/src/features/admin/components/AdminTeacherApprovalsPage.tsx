import { TeacherApprovalTable } from "@/src/features/admin/components/TeacherApprovalTable";
import { getTeacherApprovalsData } from "@/src/features/admin/services/admin-module-data.service";

export async function AdminTeacherApprovalsPage() {
  const data = await getTeacherApprovalsData();

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/65">Teacher verification</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Duyệt hồ sơ giáo viên</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
          Xem xét bằng cấp, kinh nghiệm và hồ sơ giảng dạy trước khi mở quyền giảng viên.
        </p>
      </section>

      <TeacherApprovalTable rows={data.rows} />
    </div>
  );
}
