import { apiClient } from "@/src/shared/lib";

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order: number;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  type: string;
  order: number;
  duration_minutes: number;
}

export const getModules = async (courseId: number) => {
  const res = await apiClient<{ data: Module[] }>(
    `/instructor/courses/${courseId}/modules`
  );

  return res.data;
};

export const createModule = async (
  courseId: number,
  data: {
    title: string;
    order?: number;
  }
) => {
  return apiClient(
    `/instructor/courses/${courseId}/modules`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const getLessons = async (moduleId: number) => {
  const res = await apiClient<{ data: Lesson[] }>(
    `/instructor/modules/${moduleId}/lessons`
  );

  return res.data;
};

export const createLesson = async (
  moduleId: number,
  data: {
    title: string;
    type: string;
    content?: string;
    order?: number;
  }
) => {
  return apiClient(
    `/instructor/modules/${moduleId}/lessons`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};