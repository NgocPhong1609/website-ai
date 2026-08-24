import { apiClient } from "@/src/shared/lib";

export type AdminCouponRow = {
  id: number;
  code: string;
  title: string;
  discountType: string;
  value: number;
  courseTitle: string | null;
  isActive: boolean;
};

export async function getAdminCouponsPageData(): Promise<{ rows: AdminCouponRow[] }> {
  const payload = await apiClient<{ data?: Array<Record<string, unknown>> }>("/admin/coupons");

  return {
    rows: (payload.data ?? []).map((row) => ({
      id: Number(row.id ?? 0),
      code: String(row.code ?? ""),
      title: String(row.title ?? ""),
      discountType: String(row.discount_type ?? "percent"),
      value: Number(row.value ?? 0),
      courseTitle: row.course && typeof row.course === "object" && "title" in row.course ? String((row.course as { title?: string }).title ?? "") : null,
      isActive: Boolean(row.is_active ?? true),
    })),
  };
}
