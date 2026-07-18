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
  name: string;
  role: string;
  status: string;
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
  name: string;
  learners: number;
  progress: string;
  status: string;
};

export type AdminCoursesPageData = {
  summary: {
    published: number;
    draft: number;
    pendingReview: number;
  };
  rows: AdminCourseRow[];
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
