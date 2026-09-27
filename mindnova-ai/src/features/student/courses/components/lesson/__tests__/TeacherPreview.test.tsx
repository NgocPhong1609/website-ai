import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LessonWorkspace } from '../LessonWorkspace';
import { axiosClient } from '@/src/shared/lib/axios';

const navigation = vi.hoisted(() => ({ params: 'course_id=14&preview=true' }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(navigation.params) }));
vi.mock('@/src/shared/lib/axios', () => ({ axiosClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }));
let modules: any[];
let client: QueryClient;
const article = { id: 10, title: 'Bài đọc bản nháp', type: 'article', duration_seconds: 3, content: '<p>Nội dung chưa phát hành</p>', status: 'draft' };
const response = (data: unknown) => Promise.resolve({ data: { data } });
beforeEach(() => {
  vi.clearAllMocks(); localStorage.clear();
  navigation.params = 'course_id=14&preview=true';
  modules = [{ id: 1, title: 'Chương bản nháp', lessons: [{ ...article }] }];
  vi.mocked(axiosClient.get).mockImplementation((url) => {
    if (url === '/api/instructor/courses/14') return response({ id: 14, title: 'Khóa học bản nháp' });
    if (url === '/api/instructor/courses/14/modules') return response(modules);
    if (String(url).endsWith('/discussions')) return response([]);
    return Promise.reject({ response: { status: 404 } });
  });
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
});
afterEach(() => { cleanup(); client.clear(); vi.useRealTimers(); });
const mount = () => render(<QueryClientProvider client={client}><LessonWorkspace /></QueryClientProvider>);
it('opens an owned draft without student published-course requests', async () => {
  mount();
  await waitFor(() => expect(screen.getByText('Nội dung chưa phát hành')).toBeInTheDocument());
  expect(screen.getByText('Khóa học bản nháp')).toBeInTheDocument();
  expect(screen.queryByText('Không tìm thấy khóa học')).not.toBeInTheDocument();
  expect(vi.mocked(axiosClient.get).mock.calls.some(([url]) => String(url).startsWith('/api/student/'))).toBe(false);
});
it('shows permission denial rather than spinning for another teacher course', async () => {
  vi.mocked(axiosClient.get).mockRejectedValue({ response: { status: 403 } });
  mount();
  expect(await screen.findByText('Bạn không có quyền xem trước khóa học này.')).toBeInTheDocument();
});
it('shows an empty draft rather than an endless spinner', async () => {
  modules = []; mount();
  expect(await screen.findByText('Khóa học chưa có bài học để xem trước.')).toBeInTheDocument();
});
it('keeps student mode on student data', async () => {
  navigation.params = 'course_id=14';
  vi.mocked(axiosClient.get).mockImplementation((url) => response(String(url).includes('/detail/')
    ? { header_info: { title: 'Khóa học đã phát hành' }, modules: [{ id: 1, title: 'Chương 1', lessons: [{ ...article, content: '<p>Nội dung học viên</p>' }] }] }
    : []));
  mount();
  await waitFor(() => expect(screen.getByText('Nội dung học viên')).toBeInTheDocument());
  expect(vi.mocked(axiosClient.get).mock.calls.some(([url]) => String(url).startsWith('/api/instructor/'))).toBe(false);
});
it('does not save progress after reading a preview article', async () => {
  const studentCache = { modules: [{ id: 1, lessons: [{ id: 10, status: 'current' }] }], progress_card: { progress_percentage: 0 } };
  client.setQueryData(['student', 'courses', 'detail', 14], studentCache);
  vi.useFakeTimers();
  mount();
  await act(async () => { await vi.advanceTimersByTimeAsync(100); });
  expect(screen.getByText('0:00 / 0:01')).toBeInTheDocument();
  await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
  expect(screen.queryByText('0:00 / 0:01')).not.toBeInTheDocument();
  expect(axiosClient.post).not.toHaveBeenCalled();
  expect(client.getQueryData(['student', 'courses', 'detail', 14])).toEqual(studentCache);
  expect(screen.getByRole('button', { name: /Thảo luận & Ghi chú/ })).toBeDisabled();
});
it('loads uploaded draft video through instructor API', async () => {
  modules[0].lessons = [{ id: 11, title: 'Video bản nháp', type: 'video' }];
  const original = vi.mocked(axiosClient.get).getMockImplementation()!;
  vi.mocked(axiosClient.get).mockImplementation((url, config) => url === '/api/instructor/lessons/11/video-url'
    ? response({ signed_url: 'https://example.test/preview.mp4' }) : original(url, config));
  const { container } = mount();
  await waitFor(() => expect(container.querySelector('video')).toHaveAttribute('src', 'https://example.test/preview.mp4'));
  const video = container.querySelector('video')!;
  Object.defineProperty(video, 'duration', { value: 60 });
  video.currentTime = 60;
  fireEvent.timeUpdate(video);
  expect(axiosClient.post).not.toHaveBeenCalled();
  expect(vi.mocked(axiosClient.get).mock.calls.some(([url]) => String(url).startsWith('/api/student/'))).toBe(false);
});
it('finishes a preview quiz without saving a student result', async () => {
  modules[0].lessons = [{ id: 'quiz-5', title: 'Đề thi thử', type: 'quiz', quiz_id: 5, quizData: {
    title: 'Đề thi thử', time_limit_minutes: 15, questions: [{ id: 20, content: 'Chọn đáp án đúng', type: 'multiple_choice', answers: [
      { id: 21, content: 'Đáp án đúng', is_correct: true }, { id: 22, content: 'Đáp án sai', is_correct: false },
    ] }],
  } }];
  mount();
  fireEvent.click(await screen.findByRole('button', { name: /Đáp án đúng/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Trả lời' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Hoàn thành' }));
  expect(await screen.findByText('Đã hoàn thành lượt xem thử. Kết quả và tiến độ không được lưu.')).toBeInTheDocument();
  expect(axiosClient.post).not.toHaveBeenCalled();
  expect(localStorage.getItem('student_quiz_result_quiz-5')).toBeNull();
});

it('shows essay reference feedback in preview without grading or submitting', async () => {
  modules[0].lessons = [{ id: 'quiz-6', title: 'Tự luận thử', type: 'quiz', quiz_id: 6, quizData: {
    title: 'Tự luận thử', questions: [{ id: 30, content: 'Phân tích bài học', type: 'essay', sample_answer: 'Đáp án mẫu của giảng viên', rubric: 'Nêu đủ hai ý chính' }],
  } }];
  localStorage.setItem('student_quiz_result_quiz-6', JSON.stringify({ score: 100, passed: true }));
  mount();
  fireEvent.change(await screen.findByPlaceholderText('Nhập nội dung bài làm tự luận của bạn...'), { target: { value: 'Câu trả lời xem thử' } });
  fireEvent.click(screen.getByRole('button', { name: 'Trả lời' }));
  expect(await screen.findByText('Đáp án mẫu của giảng viên')).toBeInTheDocument();
  expect(screen.getByText('Xem thử tự luận — đối chiếu đáp án và tiêu chí bên dưới.')).toBeInTheDocument();
  expect(axiosClient.post).not.toHaveBeenCalled();
});

it('shows an instructor API failure without falling back to student content', async () => {
  vi.mocked(axiosClient.get).mockRejectedValue({ response: { status: 500 } });
  mount();
  expect(await screen.findByText('Không thể tải bản xem trước. Vui lòng thử lại.')).toBeInTheDocument();
  expect(vi.mocked(axiosClient.get).mock.calls.some(([url]) => String(url).startsWith('/api/student/'))).toBe(false);
});
