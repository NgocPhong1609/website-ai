export type SourceType = "content" | "topic" | "course";
export type DifficultyType = "easy" | "medium" | "hard" | "mixed";
export type QuestionType = "multiple_choice" | "essay";
export type ReviewStatus = "pending" | "approved" | "edited" | "discarded";

export interface GeneratedQuestion {
 id: string;
 type: QuestionType;
 difficulty: DifficultyType | "easy" | "medium" | "hard";
 question: string;
 options: string[];
 correct_answer_index: number | null;
 explanation: string;
 sample_answer?: string;
 rubric?: string;
 points: number;
 reviewStatus: ReviewStatus;
}

export interface QuizConfig {
 title: string;
 description: string;
 source_type: SourceType;
 source_content: string;
 topic: string;
 course_id?: number | null;
 course_title?: string | null;
 difficulty: DifficultyType;
 total_questions: number;
 multiple_choice_count: number;
 essay_count: number;
 time_limit_minutes: number;
 passing_score: number;
}

export interface QuizAttachmentPayload {
 course_id: number;
 position: "capability_assessment" | "end_of_course" | "in_module" | "after_lesson";
 module_id?: number | null;
 after_lesson_id?: number | null;
 order?: number | null;
}

export interface QuizSummary {
 id: number;
 title: string;
 description: string | null;
 source_type: SourceType;
 course_id?: number | null;
 course_title?: string | null;
 difficulty: DifficultyType;
 total_questions: number;
 mc_questions_count: number;
 essay_questions_count: number;
 time_limit_minutes: number;
 passing_score: number;
 total_points: number;
 status: "draft" | "published";
 questions_count?: number;
 attachments?: any[];
 created_at: string;
}
