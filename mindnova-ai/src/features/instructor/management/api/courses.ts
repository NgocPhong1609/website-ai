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

export function useInstructorCourses() {
  return useQuery({
    queryKey: ["instructor", "courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await axiosClient.get<CourseApiResponse>("/api/instructor/courses");
      
      // Map API data to our Frontend UI types
      const courses = response.data.data.data;
      return courses.map((course) => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        status: course.status,
        durationHours: 0, // Placeholder: Update backend CourseResource if needed
        totalLessons: 0,  // Placeholder: Update backend CourseResource if needed
      }));
    },
  });
}
