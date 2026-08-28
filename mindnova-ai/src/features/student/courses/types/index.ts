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
 type: "zip" | "link" | "chat" | string;
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

// ─── API Dynamic Data Structures for Course Detail ────────────────────────────
export interface CourseDetailHeaderInfo {
 id: number;
 title: string;
 level: string;
 description: string;
 next_lesson_title: string;
 next_lesson_id?: number | null;
 duration_text: string;
 rating_text: string;
 students_text: string;
 category_tag: string;
 is_enrolled?: boolean;
 price?: number;
 thumbnail?: string;
}

export interface CourseDetailProgressCard {
 progress_percentage: number;
 completed_lessons_count: number;
 total_lessons_count: number;
 time_left_text?: string;
 status_tag?: string;
}

export interface CourseDetailAIInsight {
 title: string;
 status_tag?: string;
 summary_text: string;
 suggestion_text?: string;
 action_label?: string;
}

export interface CourseDetailInstructor {
 name: string;
 role: string;
 avatar_url: string;
 bio?: string;
}

export interface CourseDetailLessonItem {
 id: string | number;
 order?: number;
 title: string;
 type?: 'video' | 'article' | 'quiz_module' | string;
 duration: string;
 duration_seconds?: number;
 status: 'completed' | 'current' | 'locked' | string;
 video_url?: string;
 has_uploaded_video?: boolean;
 content?: string; // HTML content for article type
}

export interface CourseDetailModuleItem {
 id: string | number;
 order?: number;
 title: string;
 duration?: string;
 lessons: CourseDetailLessonItem[];
}

export interface CourseDetailResourceItem {
 id: string | number;
 title: string;
 type: 'zip' | 'link' | 'chat' | 'pdf' | string;
 size?: string;
 url: string;
}

export interface CourseDetailData {
 header_info: CourseDetailHeaderInfo;
 progress_card: CourseDetailProgressCard;
 ai_insight: CourseDetailAIInsight;
 instructor: CourseDetailInstructor;
 modules: CourseDetailModuleItem[];
 resources: CourseDetailResourceItem[];
}

// ─── Backward compatibility aliases (to prevent breaking legacy code) ─────────
export type ICourse = Course;
export type IMyCourse = MyCourse;
export type ILesson = Lesson;
export type IModule = Module;
export type IResource = Resource;
export type IInstructor = Instructor;
export type ICourseDetail = CourseDetail;
