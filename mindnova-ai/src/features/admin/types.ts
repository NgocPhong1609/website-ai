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

export type AdminTeacherEvidenceItem = {
 id: number;
 evidence_type: string;
 original_name: string | null;
 file_size: number | null;
 mime_type: string | null;
 created_at: string;
};

export type AdminTeacherCertificateItem = {
 id: number;
 teacher_id: number;
 certificate_name: string;
 issuing_organization: string | null;
 certificate_number: string | null;
 specialization: string | null;
 issue_date: string | null;
 expiry_date: string | null;
 description: string | null;
 certificate_image: string | null;
 verification_url: string | null;
 verification_status: "pending" | "approved" | "rejected" | "expired" | "revoked" | string;
 verification_note: string | null;
 verified_at: string | null;
 is_public: boolean;
 evidences?: AdminTeacherEvidenceItem[];
};

export type AdminTeacherApprovalRow = {
 id: number;
 name: string;
 email: string;
 avatar_url: string | null;
 role: string;
 is_verified: boolean;
 teacher_verification_status: "none" | "pending" | "approved" | "rejected" | "revoked" | string;
 teacher_verification_note: string | null;
 teacher_verified_at: string | null;
 profile: {
 bio: string | null;
 phone: string | null;
 address: string | null;
 skill_level: string | null;
 learning_goal: string | null;
 cv_path: string | null;
 } | null;
 certificates: AdminTeacherCertificateItem[];
 verification_request: {
 id: number;
 status: string;
 submitted_at: string;
 reviewed_at: string | null;
 rejection_reason: string | null;
 } | null;
 // Fallbacks for backwards compatibility
 avatarUrl?: string | null;
 cvUrl?: string | null;
 credentials?: AdminTeacherCertificateItem[];
 status?: string;
 expertise?: string;
 experience?: string;
 submittedAt?: string;
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
  partnershipTier?: "standard" | "exclusive";
  grossRevenue?: number;
  adminRevenue?: number;
  teacherRevenue?: number;
  revenue: number;
  students: number;
  conversionRate: number;
};

export type AdminOrderHistoryRow = {
  orderId: number;
  transactionCode: string;
  purchasedAt: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  instructorName: string;
  partnershipTier: "standard" | "exclusive";
  originalPrice: number;
  discountAmount: number;
  paidAmount: number;
  teacherAmount: number;
  adminAmount: number;
  allocationStatus: string;
  orderStatus: string;
  refundedAt?: string | null;
};

export type AdminRevenueData = {
  totalRevenue: number;
  totalAdminRevenue?: number;
  totalTeacherRevenue?: number;
  courseCount: number;
  courses: AdminRevenueCourseRow[];
  orderHistory?: AdminOrderHistoryRow[];
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
