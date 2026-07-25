// ─── Courses Feature — Public API ─────────────────────────────────────────────
// Import from this barrel instead of deep paths inside the feature

// Top-level components
export { CoursesHeader } from "./CoursesHeader";
export { ExploreMoreCard } from "./ExploreMoreCard";
export { MyCourseCard } from "./MyCourseCard";
export { AssignmentSubmission } from "./assignment/AssignmentSubmission";

// Course detail components
export * from "./course-detail";

// Lesson components
export * from "./lesson";

// Constants
export * from "./constants";

// Types
export type * from "./types";

