export interface ICourse {
  id: number;
  title: string;
  nextLesson: string;
  progress: number; // 0–100
  thumbnailGradient: string;
  thumbnailUrl?: string;
}

export type CourseStatus = "in-progress" | "completed" | "not-started";

export interface IMyCourse extends ICourse {
  status: CourseStatus;
  lessonsCompleted: number;
  totalLessons: number;
  isAiRecommended?: boolean;
}

export type LessonStatus = "completed" | "current" | "locked";

export interface ILesson {
  id: number;
  title: string;
  duration: string;
  status: LessonStatus;
}

export interface IModule {
  id: number;
  title: string;
  description?: string;
  isExpanded?: boolean;
  lessons: ILesson[];
}

export interface IResource {
  id: number;
  title: string;
  type: "zip" | "link" | "chat";
  url: string;
}

export interface IInstructor {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface ICourseDetail extends ICourse {
  level: string;
  description: string;
  modules: IModule[];
  resources: IResource[];
  instructor: IInstructor;
  lessonsLeftTime: string;
}
