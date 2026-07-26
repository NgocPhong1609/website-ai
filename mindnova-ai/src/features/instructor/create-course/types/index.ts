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

// ─── Draft Types (for in-memory course creation) ──────────────────────────────

export type DraftLessonType = "video" | "quiz" | "document";

export interface DraftLesson {
  id: string;
  title: string;
  type: DraftLessonType;
  content?: string;
  order: number;
}

export interface DraftModule {
  id: string;
  title: string;
  description: string;
  order: number;
  expanded: boolean;
  lessons: DraftLesson[];
  showAiSuggestion?: boolean;
}

export interface Step3Data {
  isDraft: boolean;
  isPublic: boolean;
  allowRating: boolean;
  currency: string;
  basePrice: string;
  salePrice: string;
}

export interface CourseDraft {
  courseInfo: CourseBasicInfo;
  modules: DraftModule[];
  settings: Step3Data;
}
