import { AdminActivityChart } from "@/src/features/admin/components/AdminActivityChart";
import { AdminHeroBanner } from "@/src/features/admin/components/AdminHeroBanner";
import { AdminStatsGrid } from "@/src/features/admin/components/AdminStatsGrid";
import { AdminAiOverviewSummary } from "./ai-system/AdminAiOverviewSummary";
import { getAdminOverviewData } from "@/src/features/admin/services/admin-overview.service";

export async function AdminOverviewPage() {
 const data = await getAdminOverviewData();

 return (
 <div className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8 [font-family:var(--font-admin-body)]">
 <AdminHeroBanner hero={data.hero} stats={data.stats} />
 {data.error && <p role="alert" className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-900">{data.error}</p>}
 <AdminStatsGrid stats={data.stats} />
 {(data.activities ?? []).length ? (
  <AdminActivityChart activities={data.activities} />
 ) : (
  <p className="text-sm text-slate-600">Chưa có dữ liệu hoạt động.</p>
 )}
 <AdminAiOverviewSummary summary={data.ai_summary} />
 </div>
 );
}
