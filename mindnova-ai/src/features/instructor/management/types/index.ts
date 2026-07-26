// ─── Instructor Course Management — Types ─────────────────────────────────────

export type CourseStatus = "published" | "draft";

export type CourseAction = "upload" | "lessons" | "curriculum" | "pricing";

export interface Course {
  id: string;
  title: string;
  /** Thumbnail image URL or null for the "create new" placeholder */
  thumbnail: string | null;
  status: CourseStatus;
  durationHours: number;
  totalLessons: number;
}

export interface CourseStat {
  label: string;
  count: number;
}
