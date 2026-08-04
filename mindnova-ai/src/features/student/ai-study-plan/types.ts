export interface ActiveSyllabus {
  id: string;
  title: string;
  current_module_index?: number;
  currentModuleIndex?: number;
  total_modules?: number;
  totalModules?: number;
  module_title?: string;
  moduleTitle?: string;
  description: string;
  progress_percentage?: number;
  progressPercentage?: number;
  completed_topics?: number;
  completedTopics?: number;
  total_topics?: number;
  totalTopics?: number;
  status_badge?: string;
  statusBadge?: string;
}

export interface CoreConcept {
  id: string;
  title: string;
  status: "Mastered" | "In Progress" | "Queued" | string;
  status_color?: "teal" | "amber" | "neutral" | string;
  statusColor?: string;
  description: string;
}

export interface LessonResource {
  id: string;
  type: "pdf" | "video" | string;
  title: string;
  meta: string;
  url: string;
}

export interface AiChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text: string;
  animate?: boolean;
}

export interface StudyPlanOverview {
  activeSyllabus: ActiveSyllabus;
  coreConcepts: CoreConcept[];
  lessonResources: LessonResource[];
  aiInsight: string;
  initialMessages: AiChatMessage[];
}

export interface StudyPlanApiResponse {
  success: boolean;
  message: string;
  data: {
    active_syllabus?: ActiveSyllabus;
    core_concepts?: CoreConcept[];
    lesson_resources?: LessonResource[];
    ai_insight?: string;
    initial_messages?: AiChatMessage[];
  };
}

export interface AiChatApiResponse {
  success: boolean;
  message: string;
  data: AiChatMessage;
}
