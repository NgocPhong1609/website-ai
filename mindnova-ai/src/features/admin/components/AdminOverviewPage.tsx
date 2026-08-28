import { AdminActivityChart } from "@/src/features/admin/components/AdminActivityChart";
import { AdminHeroBanner } from "@/src/features/admin/components/AdminHeroBanner";
import { AdminStatsGrid } from "@/src/features/admin/components/AdminStatsGrid";
import { getAdminOverviewData } from "@/src/features/admin/services/admin-overview.service";

export async function AdminOverviewPage() {
 const data = await getAdminOverviewData();

 return (
 <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
 <AdminHeroBanner hero={data.hero} />
 <AdminStatsGrid stats={data.stats} />
 <AdminActivityChart activities={data.activities} />
 </div>
 );
}
