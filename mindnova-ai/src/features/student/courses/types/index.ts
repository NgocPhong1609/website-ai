export interface Course {
  id: number;
  title: string;
  nextLesson: string;
  progress: number; // 0–100
  thumbnailGradient: string;
  thumbnailUrl?: string;
}

export type CourseStatus = "in-progress" | "completed" | "not-started";

export type CourseTabStatus = "All" | "In Progress" | "Completed" | "Not Started";

export interface MyCourse extends Course {
  status: CourseStatus;
  lessonsCompleted: number;
  totalLessons: number;
  isAiRecommended?: boolean;
}

export type LessonStatus = "completed" | "current" | "locked";

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: LessonStatus;
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  isExpanded?: boolean;
  lessons: Lesson[];
}

export interface Resource {
  id: number;
  title: string;
  type: "zip" | "link" | "chat";
  url: string;
}

export interface Instructor {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface CourseDetail extends Course {
  level: string;
  description: string;
  modules: Module[];
  resources: Resource[];
  instructor: Instructor;
  lessonsLeftTime: string;
}

// ─── Backward compatibility aliases (to prevent breaking legacy code) ─────────
export type ICourse = Course;
export type IMyCourse = MyCourse;
export type ILesson = Lesson;
export type IModule = Module;
export type IResource = Resource;
export type IInstructor = Instructor;
export type ICourseDetail = CourseDetail;
