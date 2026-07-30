export type LogCategory = "ALL" | "ACCOUNT_MANAGEMENT" | "LEARNING_CORE" | "AI_LEARNING";

export type LogStatus = "VERIFIED" | "SECURED" | "TRIGGERED" | "SUCCESS" | "ACTIVE";

export interface IAuditRule {
  ruleName: string;
  status: "PASSED" | "ENFORCED" | "ACTIVE" | "INVALIDATED_OTHERS" | "GENERATED";
  details: string;
}

export interface ILearningHistoryLog {
  id: string;
  category: "ACCOUNT_MANAGEMENT" | "LEARNING_CORE" | "AI_LEARNING";
  categoryLabel: string;
  title: string;
  subtitle: string;
  timestamp: string;
  timeDisplay: string;
  dateGroup: "Today, Real-time Stream" | "Yesterday" | "Earlier this week";
  badge: string;
  badgeColor: string; // Tailwind color classes for tag
  iconType: "shield" | "video" | "quiz" | "cert" | "ai_tutor" | "ai_roadmap" | "ai_grade" | "profile" | "password" | "heartbeat";
  scoreOrMetric?: string;
  metricLabel?: string;
  verificationRules: IAuditRule[];
  actionLabel?: string;
  actionUrl?: string;
}

export interface IHistoryStats {
  securityStatus: string;
  securityDetail: string;
  heartbeatIntegrity: string;
  heartbeatDetail: string;
  aiRateLimit: string;
  aiRateDetail: string;
  certificatesVerified: number;
  certDetail: string;
}
