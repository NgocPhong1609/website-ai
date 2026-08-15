export interface AvailableCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  price?: number;
  current_price?: number;
  level: string;
  duration_hours?: number;
  status: string;
  created_at?: string;
  is_enrolled?: boolean;
}
