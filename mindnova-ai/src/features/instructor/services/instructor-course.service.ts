import { apiClient } from "@/src/shared/lib";

export const InstructorCourseService = {
  getModules(courseId: number) {
    return apiClient(`/instructor/courses/${courseId}/modules`);
  },

  createModule(courseId: number, data: {
    title: string;
    order?: number;
  }) {
    return apiClient(`/instructor/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateModule(moduleId: number, data: {
    title: string;
    order?: number;
  }) {
    return apiClient(`/instructor/modules/${moduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteModule(moduleId: number) {
    return apiClient(`/instructor/modules/${moduleId}`, {
      method: "DELETE",
    });
  },

  getLessons(moduleId: number) {
    return apiClient(`/instructor/modules/${moduleId}/lessons`);
  },

  createLesson(moduleId: number, data: {
    title: string;
    type: string;
    content?: string;
    duration_minutes?: number;
    order?: number;
  }) {
    return apiClient(`/instructor/modules/${moduleId}/lessons`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateLesson(lessonId: number, data: {
    title: string;
    type: string;
    content?: string;
    duration_minutes?: number;
    order?: number;
  }) {
    return apiClient(`/instructor/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteLesson(lessonId: number) {
    return apiClient(`/instructor/lessons/${lessonId}`, {
      method: "DELETE",
    });
  },
};