import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import { Course } from "../types";

export interface CourseApiResponse {
  success: boolean;
  message: string;
  data: {
    data: {
      id: string;
      title: string;
      slug: string;
      description: string;
      thumbnail: string | null;
      price: number;
      level: string;
      status: "published" | "draft";
      category_id: string;
      totalLessons: number;
      durationHours: number;
      created_at: string;
      updated_at: string;
    }[];
    meta: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export function useInstructorCourses(search?: string) {
  return useQuery({
    queryKey: ["instructor", "courses", search],
    queryFn: async (): Promise<Course[]> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const url = `/api/instructor/courses${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await axiosClient.get<CourseApiResponse>(url);
      
      // Map API data to our Frontend UI types
      const courses = response.data.data.data;
      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        status: course.status,
        durationHours: course.durationHours || 0,
        totalLessons: course.totalLessons || 0,
        price: course.price,
        salePrice: (course as any).sale_price,
      }));
    },
  });
}

export function useInstructorCourse(courseId: string) {
  return useQuery({
    queryKey: ["instructor", "courses", courseId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/api/instructor/courses/${courseId}`);
      return data.data; // Returns { id, title, price, ... }
    },
    enabled: !!courseId,
  });
}
