// ─── Lesson workspace types ─────────────────────────────────────────────────
import type { LessonAttachment } from "@/src/features/instructor/lesson-management/api";

export interface LessonData {
 id: string;
 title: string;
 type: 'video' | 'article' | 'quiz_module' | 'quiz' | string;
 duration: string;
 durationSeconds: number;
 completed: boolean;
 videoUrl: string;
 hasUploadedVideo: boolean;
 content: string; // HTML for article
 quiz_id?: number | string | null;
 quizData?: any;
 questions?: any[];
 attachments?: LessonAttachment[];
}

export interface ModuleData {
 id: string;
 title: string;
 subtitle: string;
 lessons: LessonData[];
}

export interface CommentItem {
 id: string;
 author: string;
 avatar: string;
 role: string;
 time: string;
 content: string;
 isAi?: boolean;
}

// ─── Quiz Types ───────────────────────────────────────────────────────────────
export interface QuizQuestion {
 id: string;
 content: string;
 order: number;
 answers: { id: string; content: string }[];
}

export interface QuizData {
  id?: string;
  quiz_id: number;
  title: string;
  course_title?: string;
  questions_count?: number;
  time_limit_minutes: number;
  passing_score: number;
  questions: QuizQuestion[];
}

