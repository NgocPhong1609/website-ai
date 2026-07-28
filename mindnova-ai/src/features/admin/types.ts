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
