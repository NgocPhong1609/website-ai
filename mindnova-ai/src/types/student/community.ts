export interface ICourseRatingPayload {
  courseId: number;
  rating: number; // 1 to 5 stars
  reviewText: string;
  studentId: string;
}

export interface ICourseRatingResult {
  success: boolean;
  canRate: boolean;
  userProgressPercent: number; // Must be >= 20% to review
  message: string;
  existingRatingOverwritten?: boolean;
}

export interface ILessonComment {
  id: string;
  lessonId: number;
  studentName: string;
  studentAvatar: string;
  content: string;
  timestampSeconds?: number; // E.g., 252 -> 04:12 video timestamp jump
  createdAt: string;
  isInstructorReply: boolean;
}

export interface IReportContentErrorPayload {
  courseId: number;
  lessonId: number;
  description: string;
  errorCategory: "video_playback" | "quiz_bug" | "typo" | "other";
  // Automated device context bundle for rapid admin/instructor troubleshooting
  clientContext?: {
    userAgent: string;
    screenResolution: string;
    timestamp: string;
    userId: string;
  };
}

export interface IReportErrorTicketResult {
  ticketId: string;
  status: "OPEN" | "ASSIGNED" | "RESOLVED";
  submittedAt: string;
  instructorNotified: boolean;
}
