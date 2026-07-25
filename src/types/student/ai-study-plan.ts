export interface IAIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface IAIFlashcard {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface IRoadmapNode {
  id: string;
  courseTitle: string;
  targetSkill: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

export interface IAIGradingResult {
  score: number;
  maxScore: number;
  detailedErrors: {
    lineOrParagraph: string;
    issue: string;
  }[];
  correctionHints: string[];
  overallFeedback: string;
}

export interface ILessonSummary {
  lessonId: number;
  summary: string;
  keyTakeaways: string[];
  nextLessonRecommendation: {
    lessonId: number;
    title: string;
    reason: string; // e.g., "Sequential progression" or "Remedial based on quiz score"
  } | null;
}
