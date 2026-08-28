import { apiClient } from "@/src/shared/lib/api-client";
import type { AvailableCourse } from "../types";

export async function getAvailableCourses(): Promise<AvailableCourse[]> {
 try {
 const response = await apiClient<AvailableCourse[]>("/student/courses/available", {
 next: { revalidate: 60 }
 } as RequestInit);
 return response || [];
 } catch (error) {
 console.error("Failed to fetch available courses:", error);
 return [];
 }
}
