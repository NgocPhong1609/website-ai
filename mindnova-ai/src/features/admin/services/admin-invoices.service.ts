import { apiClient } from "@/src/shared/lib";
import type { AdminInvoicesPageData } from "@/src/features/admin/types";

export async function getAdminInvoicesPageData(params?: {
  search?: string;
  status?: string;
  paymentMethod?: string;
}): Promise<AdminInvoicesPageData> {
  const query = new URLSearchParams();

  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.paymentMethod) query.set("payment_method", params.paymentMethod);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await apiClient<{ data?: Array<Record<string, unknown>> }>(`/admin/invoices${suffix}`);

  return {
    rows: (payload.data ?? []).map((row) => ({
      id: Number(row.id ?? 0),
      transactionId: String(row.transaction_id ?? row.invoice_code ?? `INV-${row.id ?? 0}`),
      courseTitle: String(
        row.course_title ??
          row.course_name ??
          (typeof row.course === "object" && row.course !== null && "title" in row.course
            ? (row.course as { title?: unknown }).title
            : "Khóa học chưa xác định")
      ),
      studentName: String(row.student_name ?? "Không xác định"),
      studentEmail: String(row.student_email ?? "-"),
      totalAmount: Number(row.total_amount ?? 0),
      paymentMethod: String(row.payment_method ?? "-"),
      status: String(row.status ?? "pending"),
      createdAt: String(row.created_at ?? "-"),
    })),
  };
}
