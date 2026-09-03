import { apiClient } from "@/src/shared/lib";

export type AdminCouponRow = {
  id: number;
  code: string;
  teacherName: string;
  discountType: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  courseTitle: string | null;
  isActive: boolean;
};

export async function getAdminCouponsPageData(): Promise<{ rows: AdminCouponRow[] }> {
  try {
    const payload = await apiClient<{ data?: Array<Record<string, unknown>> }>("/admin/coupons");

    return {
      rows: (payload.data ?? []).map((row) => {
        const instructorObj = row.instructor && typeof row.instructor === "object" ? (row.instructor as { name?: string; email?: string }) : null;
        const teacherName = instructorObj?.name || instructorObj?.email || String(row.title ?? row.code ?? "Hệ thống");

        const type = String(row.type ?? row.discount_type ?? "percent");
        const isActive = row.status ? row.status === "active" : Boolean(row.is_active ?? true);

        return {
          id: Number(row.id ?? 0),
          code: String(row.code ?? ""),
          teacherName,
          discountType: type,
          value: Number(row.value ?? 0),
          usedCount: Number(row.used_count ?? 0),
          maxUses: row.max_uses !== null && row.max_uses !== undefined ? Number(row.max_uses) : (row.usage_limit !== null && row.usage_limit !== undefined ? Number(row.usage_limit) : null),
          startsAt: row.starts_at ? String(row.starts_at) : null,
          expiresAt: row.expires_at ? String(row.expires_at) : null,
          courseTitle: row.course && typeof row.course === "object" && "title" in row.course ? String((row.course as { title?: string }).title ?? "") : null,
          isActive,
        };
      }),
    };
  } catch (error) {
    console.warn("[AdminCouponsService] Failed to fetch admin coupons data:", error);
    return { rows: [] };
  }
}
