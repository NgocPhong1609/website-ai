import { AdminActivityChart } from "@/src/features/admin/components/AdminActivityChart";
import { AdminHeroBanner } from "@/src/features/admin/components/AdminHeroBanner";
import { AdminQuickActions } from "@/src/features/admin/components/AdminQuickActions";
import { AdminRecentUsersTable } from "@/src/features/admin/components/AdminRecentUsersTable";
import { AdminStatsGrid } from "@/src/features/admin/components/AdminStatsGrid";
import { AdminSystemHealth } from "@/src/features/admin/components/AdminSystemHealth";
import { getAdminOverviewData } from "@/src/features/admin/services/admin-overview.service";

export async function AdminOverviewPage() {
  const data = await getAdminOverviewData();

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <AdminHeroBanner hero={data.hero} />
      <AdminStatsGrid stats={data.stats} />

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <AdminActivityChart activities={data.activities} />
        <AdminSystemHealth health={data.health} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminRecentUsersTable users={data.users} />
        <AdminQuickActions quickActions={data.quickActions} />
      </section>
    </div>
  );
}
