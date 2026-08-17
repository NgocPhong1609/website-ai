"use server";

import { apiClient } from "@/src/shared/lib/api-client";
import { revalidatePath } from "next/cache";

export async function verifyTeacher(id: number, status: "approved" | "rejected", note?: string): Promise<void> {
  await apiClient(`/admin/teachers/${id}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });

  // Revalidate the page so the list is updated from the server
  revalidatePath("/admin/teacher-approvals");
}
