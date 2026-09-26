import React from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { Step1SourceInput } from '../Step1SourceInput';
import { useAiQuizWizard } from '../../hooks/useAiQuizWizard';
import { axiosClient } from '@/src/shared/lib/axios';

vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock('@/src/shared/lib/axios', () => ({ axiosClient: { get: vi.fn(), post: vi.fn() } }));
const course = { id: 10, title: 'Khóa mẫu', modules: [
  { id: 11, title: 'Chương A', lessons: [{ id: 1, title: 'Kiến thức A', type: 'article', content: '<p>Nội dung A</p>' }, { id: 3, title: 'Quiz cũ', type: 'quiz_module', content: 'Câu hỏi cũ' }] },
  { id: 12, title: 'Chương B', lessons: [{ id: 2, title: 'Kiến thức B', type: 'article', content: 'Nội dung B' }] },
  { id: 13, title: 'Chương trống', lessons: [] },
] };
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(axiosClient.get).mockImplementation(async (url) => ({ data: { data: String(url).includes('?') ? [course] : course } }));
});
function Source() {
  const wizard = useAiQuizWizard();
  return <Step1SourceInput config={wizard.config} onChangeConfig={wizard.updateConfig} onNext={() => {}} />;
}
it('previews only selected chapter lessons, excludes quizzes, and resets when course changes', async () => {
  render(<Source />);
  fireEvent.click(await screen.findByRole('button', { name: /Chọn khóa học này/ }));
  const selector = await screen.findByLabelText('Phạm vi nội dung');
  await screen.findByRole('option', { name: 'Chương A' });
  fireEvent.change(selector, { target: { value: '11' } });
  expect(screen.getByText(/Bài 1: Kiến thức A/)).toBeInTheDocument();
  expect(screen.queryByText(/Bài \d+: Kiến thức B/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Bài \d+: Quiz cũ/)).not.toBeInTheDocument();
  fireEvent.change(selector, { target: { value: '13' } });
  expect(screen.getByRole('button', { name: /Tiếp theo/ })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: /Thay đổi khóa học/ }));
  fireEvent.click(await screen.findByRole('button', { name: /Chọn khóa học này/ }));
  expect(await screen.findByLabelText('Phạm vi nội dung')).toHaveValue('');
});
it('keeps chapter scope on generation, single regeneration and save', async () => {
  vi.mocked(axiosClient.post).mockResolvedValue({ data: { success: true, data: { id: 9, questions: [] } } });
  const { result } = renderHook(() => useAiQuizWizard());
  act(() => result.current.updateConfig({ source_type: 'course', course_id: 10, module_id: 11 } as any));
  await act(async () => { await result.current.handleGenerate(); });
  expect(axiosClient.post).toHaveBeenCalledWith('/api/instructor/ai-quiz/generate', expect.objectContaining({ course_id: 10, module_id: 11 }), expect.objectContaining({ timeout: 210000 }));
  await act(async () => { await result.current.regenerateSingleQuestion('q1', 'multiple_choice', 'easy'); });
  expect(axiosClient.post).toHaveBeenCalledWith('/api/instructor/ai-quiz/regenerate-question', expect.objectContaining({ course_id: 10, module_id: 11 }), expect.anything());
  await act(async () => { await result.current.handleSaveQuiz(); });
  expect(axiosClient.post).toHaveBeenCalledWith('/api/instructor/ai-quiz/store', expect.objectContaining({ course_id: 10, module_id: 11 }));
});
