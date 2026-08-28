export interface HistoryOverviewCard {
 total_activities: number;
 status_badge: string;
 status_tag: string;
 streak_label: string;
 next_level_label: string;
}

export interface HistoryMetricStat {
 value: string | number;
 unit?: string;
 change_tag?: string;
 progress_tag?: string;
 tag?: string;
 level_label?: string;
 xp_text?: string;
 percentage?: number;
 ranking_tag?: string;
}

export interface HistoryMetricsRow {
 total_lessons: HistoryMetricStat;
 quiz_average: HistoryMetricStat;
 study_hours: HistoryMetricStat;
 ai_proficiency: HistoryMetricStat;
}

export interface HistoryTimelineItem {
 id: string | number;
 type: 'quiz' | 'milestone' | 'lesson' | string;
 badge_text?: string;
 time_text?: string;
 title: string;
 subtitle?: string;
 score_text?: string;
 score_status?: string;
 action_label?: string;
 action_url?: string;
 shareable?: boolean;
 share_label?: string;
 progress_percentage?: number;
 progress_label?: string;
 duration_tag?: string;
 icon_type?: string;
 date_time_text?: string;
 status_badge?: string;
 badge_color?: string;
}

export interface HistoryTimelineGroup {
 id: string | number;
 section_title: string;
 subtitle: string;
 icon_type: string;
 is_compact: boolean;
 items: HistoryTimelineItem[];
}

export interface HistoryOverviewData {
 overview_card: HistoryOverviewCard;
 metrics_row: HistoryMetricsRow;
 timeline_groups: HistoryTimelineGroup[];
 total_activities_count: number;
 pagination: {
 current_page: number;
 per_page: number;
 total_items: number;
 total_pages: number;
 has_more: boolean;
 };
}
