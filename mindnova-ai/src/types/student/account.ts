export interface IStudentProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
}

export interface IAvatarUploadResult {
  success: boolean;
  avatarUrl: string;
  errorMessage?: string;
}

export interface IPasswordChangePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IPasswordChangeResult {
  success: boolean;
  message: string;
  sessionsInvalidated: boolean;
}

export type LearningLogEventType = "watched_lecture" | "submitted_assignment" | "earned_certificate";

export interface ILearningHistoryItem {
  id: string;
  eventType: LearningLogEventType;
  title: string;
  courseName: string;
  timestamp: string; // ISO datetime
  metadata?: {
    lessonId?: number;
    score?: number;
    certificateId?: string;
    watchDurationSeconds?: number;
  };
}
