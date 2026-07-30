// ─── Course Feature Types ──────────────────────────────────────────────────────

export type CourseStatus = "in-progress" | "completed" | "not-started" | "abandoned";

export interface ICourse {
  id: number;
  title: string;
  nextLesson: string;
  progress: number; // 0–100
  thumbnailGradient: string;
  thumbnailUrl?: string;
  lastWatchedTimestamp?: string;
  status?: CourseStatus;
  category?: string;
  instructorName?: string;
}

export interface IMyCourse extends ICourse {
  status: CourseStatus;
  lessonsCompleted: number;
  totalLessons: number;
  isAiRecommended?: boolean;
  /** Average quiz/assignment score 0–100 */
  avgScore?: number;
}

export type LessonStatus = "completed" | "current" | "locked";

export interface ILesson {
  id: number;
  title: string;
  duration: string;
  status: LessonStatus;
  /** Total video duration in seconds (used for watch time calculation) */
  videoDurationSeconds: number;
  /** Seconds of the video actually watched by the user */
  watchedSeconds?: number;
  type?: "video" | "quiz" | "assignment";
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
  nextLessonId: number;
  modules: IModule[];
  resources: IResource[];
  instructor: IInstructor;
  lessonsLeftTime: string;
  /** Simulated user enrollment status */
  userCourseStatus?: "ACTIVE" | "INACTIVE" | "PENDING";
  /** Average quiz/assignment score for certificate eligibility */
  avgScore?: number;
}

// ─── Quiz types ───────────────────────────────────────────────────────────────

export interface IQuizOption {
  id: string;
  text: string;
}

export interface IQuizQuestion {
  id: number;
  question: string;
  options: IQuizOption[];
  correctOptionId: string;
  explanation?: string;
}

export interface IMockQuiz {
  id: number;
  title: string;
  description: string;
  /** Total time in seconds */
  durationSeconds: number;
  passingScore: number; // 0–100
  maxAttempts: number | null; // null = unlimited
  attemptsUsed: number;
  /** ISO date string, null = no deadline */
  deadline: string | null;
  questions: IQuizQuestion[];
}
