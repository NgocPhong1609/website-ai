import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Step2CourseStructure } from '../Step2CourseStructure';
import { useCreateCourseStore } from '../../stores/createCourseStore';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('../CreateLessonEditModal', () => ({ CreateLessonEditModal: () => null }));
vi.mock('../CourseAiQuizModal', () => ({ CourseAiQuizModal: () => null }));
vi.mock('../CourseManualQuizModal', () => ({ CourseManualQuizModal: () => null }));
vi.mock('../SelectCourseLevelQuizModal', () => ({ SelectCourseLevelQuizModal: () => null }));
vi.mock('@/src/features/instructor/management/api/courses', () => ({ useCourseModules: () => ({ data: undefined, isLoading: false, refetch: vi.fn() }) }));
vi.mock('@/src/features/instructor/lesson-management/api', () => {
  const mutation = () => ({ mutateAsync: vi.fn() });
  return Object.fromEntries(['useCreateModule','useUpdateModule','useDeleteModule','useCreateLesson','useUpdateLesson','useDeleteLesson','useCreateQuiz','useReorderModuleItems'].map(key => [key, mutation]));
});

beforeEach(() => {
  useCreateCourseStore.setState({ modules: [
    { id: 'one', title: 'Chapter one', order: 1, lessons: [
      { id: 'a', title: 'Alpha', type: 'document', order: 1, content: '<p>Alpha content</p>' },
      { id: 'b', title: 'Beta', type: 'video', order: 2, video_url: 'https://example.test/video', temp_media_ids: [42] },
      { id: 'c', title: 'Gamma', type: 'document', order: 3, content: '<p>Gamma content</p>' },
    ] },
    { id: 'two', title: 'Chapter two', order: 2, lessons: [{ id: 'd', title: 'Delta', type: 'document', order: 1 }] },
  ] });
});
afterEach(cleanup);

function drag(from: number, to: number) {
  const handles = screen.getAllByTitle('Giữ và kéo để sắp xếp vị trí bài học');
  const dataTransfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' };
  fireEvent.dragStart(handles[from], { dataTransfer });
  fireEvent.dragOver(handles[to].closest('.group')!, { dataTransfer });
  fireEvent.drop(handles[to].closest('.group')!, { dataTransfer });
}

it('moves the last lesson onto the first position on drop', () => {
  render(<Step2CourseStructure />);
  drag(2, 0);
  expect(useCreateCourseStore.getState().modules[0].lessons.map(l => l.id)).toEqual(['c','a','b']);
  expect(useCreateCourseStore.getState().modules[0].lessons.map(l => l.order)).toEqual([1,2,3]);
  expect(screen.getAllByTitle('Giữ và kéo để sắp xếp vị trí bài học')[0].closest('.group')).toHaveTextContent('Gamma');
});

it('moves down to the target position rather than always to the end', () => {
  render(<Step2CourseStructure />);
  drag(0, 1);
  expect(useCreateCourseStore.getState().modules[0].lessons.map(l => l.id)).toEqual(['b','a','c']);
});

it('dropping onto itself leaves order unchanged', () => {
  render(<Step2CourseStructure />);
  drag(0, 0);
  expect(useCreateCourseStore.getState().modules[0].lessons.map(l => l.id)).toEqual(['a','b','c']);
});

it('moves across chapters atomically preserving the lesson and target position', () => {
  const original = useCreateCourseStore.getState().modules[0].lessons[1];
  render(<Step2CourseStructure />);
  drag(1, 3);
  const modules = useCreateCourseStore.getState().modules;
  expect(modules[0].lessons.map(l => l.id)).toEqual(['a','c']);
  expect(modules[1].lessons.map(l => l.id)).toEqual(['b','d']);
  expect(modules[1].lessons[0]).toEqual({ ...original, order: 1 });
});

it('keeps the reordered draft when restored from session storage', () => {
  render(<Step2CourseStructure />);
  drag(2, 0);
  cleanup();
  useCreateCourseStore.setState({ modules: [] });
  useCreateCourseStore.getState().hydrate();
  expect(useCreateCourseStore.getState().modules[0].lessons.map(l => l.id)).toEqual(['c','a','b']);
});
