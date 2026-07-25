// ─── Learning Core — Domain Types ─────────────────────────────────────────────
// These types model the server-side business logic entities

// ─── Access Control ───────────────────────────────────────────────────────────

export type UserCourseStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface IUserCourse {
  courseId: number;
  userId: string;
  status: UserCourseStatus;
  /** Overall progress 0–100 */
  progress: number;
  /** Average test score 0–100 */
  avgScore: number;
  enrolledAt: string; // ISO date string
}

// ─── Video Progress ────────────────────────────────────────────────────────────

export interface IVideoProgress {
  lessonId: number;
  /** Total video duration in seconds */
  totalSeconds: number;
  /** Actual seconds watched (server-validated, not skippable) */
  watchedSeconds: number;
  /** True when watchedSeconds / totalSeconds >= 0.9 */
  completed: boolean;
}

export interface IHeartbeatPayload {
  lessonId: number;
  watchedSeconds: number;
  timestamp: number;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface IQuizAttempt {
  attemptId: string;
  quizId: number;
  score: number;
  completedAt: string; // ISO date string
  timeTakenSeconds: number;
}

export interface IQuizSession {
  quizId: number;
  /** Unix timestamp (ms) when the session was created on the server */
  startedAt: number;
  /** Total allowed duration in seconds */
  durationSeconds: number;
  attemptsUsed: number;
  maxAttempts: number | null; // null = unlimited
  /** ISO date string, null = no deadline */
  deadline: string | null;
}

// ─── Assignment ───────────────────────────────────────────────────────────────

export interface IAssignment {
  assignmentId: number;
  lessonId: number;
  title: string;
  instructions: string;
  /** ISO date string */
  deadline: string | null;
  maxWordCount: number;
  submittedAt: string | null;
}

// ─── Certificate ──────────────────────────────────────────────────────────────

export interface ICertificate {
  /** Unique certificate ID (UUID format) to prevent forgery */
  uniqueId: string;
  courseId: number;
  courseName: string;
  studentName: string;
  /** ISO date string */
  issuedAt: string;
  pdfUrl: string | null;
}

export interface ICertificateEligibility {
  isEligible: boolean;
  progress: number;
  avgScore: number;
  /** Minimum avg score required (default: 80) */
  minScoreThreshold: number;
}
