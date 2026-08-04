// ─── Practice & Quiz Feature — Types ──────────────────────────────────────────

export interface ReadinessInfo {
  status_label: string;
  percentage_text: string;
  level_text: string;
  level_subtext: string;
  status_tag: string;
  action_prompt: string;
  time_prompt: string;
}

export interface AiInsightInfo {
  title: string;
  tag: string;
  content: string;
  footer: string;
}

export interface PrerequisiteItem {
  id: number | string;
  name: string;
  color: string;
  bg_class?: string;
  text_class?: string;
  border_class?: string;
}

export interface AssessmentInfo {
  id: string;
  title: string;
  badge_title: string;
  course_title: string;
  description: string;
  questions_count_text: string;
  time_limit_text: string;
  passing_condition_text: string;
  attempts_allowed_text: string;
  time_limit_minutes: number;
  questions_count: number;
  passing_percentage: number;
}

export interface AssessmentModuleItem extends AssessmentInfo {
  readiness?: ReadinessInfo;
  ai_insight?: AiInsightInfo;
  prerequisites?: PrerequisiteItem[];
}

export interface AttemptItem {
  id: number | string;
  score: number;
  accuracy: string;
  status: string;
  date: string;
}

export interface RecentAttemptsInfo {
  total_attempts: number;
  best_score: string;
  attempts_list?: AttemptItem[];
  message_title: string;
  message_body: string;
  tag_text: string;
}

export interface PracticeOverviewData {
  modules_list?: AssessmentModuleItem[];
  assessment_info: AssessmentInfo;
  readiness: ReadinessInfo;
  instructions: string[];
  ai_insight: AiInsightInfo;
  prerequisites: PrerequisiteItem[];
  recent_attempts: RecentAttemptsInfo;
}

export interface TopicPerformanceItem {
  id?: string;
  topic_title: string;
  sub_title: string;
  score_percentage: number;
  status_label: string;
  status_color: string;
}

export interface ActionCardItem {
  id?: string;
  title: string;
  description: string;
  action_text: string;
  icon_type: string;
}

export interface QuizGradingResult {
  attempt_id: number | string;
  module_id?: string;
  score: number;
  total_score_max?: number;
  accuracy: string;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  time_taken_seconds?: number;
  time_taken_formatted?: string;
  quiz_title?: string;
  ai_insight?: string;
  ai_coach_suggestion?: string;
  topic_performance?: TopicPerformanceItem[];
  action_cards?: ActionCardItem[];
}
