// ─── Instructor Course Management — Types ─────────────────────────────────────

export type CourseStatus = "published" | "draft" | "pending" | "pending_review" | "pending_approval" | "under_review" | "approved" | "rejected";

export type CourseAction = "upload" | "lessons" | "curriculum" | "pricing";

export interface Course {
 id: string;
 title: string;
 /** Thumbnail image URL or null for the "create new" placeholder */
 thumbnail: string | null;
 status: CourseStatus;
 durationHours: number;
 totalLessons: number;
 price: number;
 salePrice?: number;
 currentPrice?: number;
 isFlashSale?: boolean;
 saleStartDate?: string;
 saleEndDate?: string;
}

export interface CourseStat {
 label: string;
 count: number;
}
