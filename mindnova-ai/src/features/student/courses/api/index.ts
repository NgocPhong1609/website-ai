import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { CourseDetailData } from "../types";

export function useGetCourseDetail(courseId: string | number = 1) {
  return useQuery({
    queryKey: ["student", "courses", "detail", courseId],
    queryFn: async (): Promise<CourseDetailData> => {
      const { data } = await axiosClient.get(`/api/student/courses/detail/${courseId}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
