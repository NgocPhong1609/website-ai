// ─── Create Course — Types ─────────────────────────────────────────────────────

export type StepKey = 1 | 2 | 3;

export interface Step {
  id: StepKey;
  label: string;
}

export type DifficultyLevel = "beginner" | "advanced";

export interface CourseBasicInfo {
  title: string;
  description: string;
  field: string;
  difficulty: DifficultyLevel;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
}
