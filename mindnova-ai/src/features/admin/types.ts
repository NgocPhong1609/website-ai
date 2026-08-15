export type AdminStatItem = {
  label: string;
  value: string;
  trend: string;
  note: string;
};

export type AdminActivityBar = {
  label: string;
  value: number;
};

export type AdminHealthItem = {
  title: string;
  status: string;
  color: string;
};

export type AdminUserRow = {
  id: number;
  name: string;
  role: string;
  status: string;
  isLocked?: boolean;
};

export type AdminUsersPageData = {
  summary: {
    students: number;
    instructors: number;
    admins: number;
  };
  rows: Array<AdminUserRow & { joined: string }>;
};

export type AdminCourseRow = {
  id: number;
  title: string;
  description: string;
  categoryId: number | null;
  category: string;
  level: string;
  price: number;
  status: string;
};

export type AdminCourseFilterOption = {
  id: number;
  name: string;
};

export type AdminCoursesPageData = {
  summary: {
    published: number;
    draft: number;
    pendingReview: number;
  };
  filters: {
    search: string;
    categoryId: string;
    level: string;
    categories: AdminCourseFilterOption[];
  };
  rows: AdminCourseRow[];
};

export type AdminCategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
};

export type AdminCategoriesPageData = {
  rows: AdminCategoryRow[];
};

export type AdminInvoiceRow = {
  id: number;
  transactionId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export type AdminInvoicesPageData = {
  rows: AdminInvoiceRow[];
};

export type AdminOverviewData = {
  hero: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  stats: AdminStatItem[];
  activities: AdminActivityBar[];
  health: AdminHealthItem[];
  users: AdminUserRow[];
  quickActions: string[];
};

export type AdminTeacherCredentialItem = {
  id: number;
  title: string | null;
  fileUrl: string;
};

export type AdminTeacherApprovalRow = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  cvUrl: string | null;
  expertise: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  experience: string;
  credentialCount: number;
  credentials: AdminTeacherCredentialItem[];
  rating: number;
};

export type AdminTeacherApprovalData = {
  rows: AdminTeacherApprovalRow[];
};

export type AiProviderConfig = {
  provider: string;
  model: string;
  status: "connected" | "warning" | "offline";
  apiKeyHint: string;
};

export type AiQuotaConfig = {
  label: string;
  limit: number;
  used: number;
};

export type SystemPromptItem = {
  id: number;
  name: string;
  purpose: string;
  status: "active" | "draft";
  updatedAt: string;
};

export type AdminAiConfigData = {
  providers: AiProviderConfig[];
  quotas: AiQuotaConfig[];
  systemPrompts: SystemPromptItem[];
};

export type AdminContentRow = {
  id: number;
  title: string;
  type: string;
  instructor: string;
  status: "approved" | "pending" | "rejected";
  submittedAt: string;
  score: number;
};

export type AdminContentData = {
  rows: AdminContentRow[];
};

export type AdminAnalyticsMetric = {
  label: string;
  value: string;
  change: string;
};

export type AdminAnalyticsChartPoint = {
  label: string;
  value: number;
};

export type AdminAnalyticsData = {
  metrics: AdminAnalyticsMetric[];
  traffic: AdminAnalyticsChartPoint[];
  subjects: AdminAnalyticsChartPoint[];
  conversion: AdminAnalyticsChartPoint[];
};

export type AdminRevenueCourseRow = {
  courseId: number;
  courseTitle: string;
  instructorName: string;
  revenue: number;
  students: number;
  conversionRate: number;
};

export type AdminRevenueData = {
  totalRevenue: number;
  courseCount: number;
  courses: AdminRevenueCourseRow[];
};

export type AdminModerationRow = {
  id: number;
  type: string;
  title: string;
  reporter: string;
  severity: "low" | "medium" | "high";
  status: "open" | "in_review" | "resolved";
  createdAt: string;
};

export type AdminModerationData = {
  rows: AdminModerationRow[];
};
