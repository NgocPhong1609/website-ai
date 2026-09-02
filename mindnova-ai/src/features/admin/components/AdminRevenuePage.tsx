import { getAdminRevenueData } from "@/src/features/admin/services/admin-module-data.service";
import { AdminRevenueView } from "./AdminRevenueView";

export async function AdminRevenuePage() {
  const data = await getAdminRevenueData();
  return <AdminRevenueView data={data} />;
}
