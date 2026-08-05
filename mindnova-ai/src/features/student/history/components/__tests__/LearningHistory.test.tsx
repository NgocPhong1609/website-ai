import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LearningHistory } from '../LearningHistory';
import * as api from '../../api';

// Mock the API hook
vi.mock('../../api', () => ({
  useGetHistoryOverview: vi.fn(),
}));

const mockData = {
  overview_card: { total_activities: 42, status_badge: 'Active' },
  metrics_row: {
    total_lessons: { value: 10 },
    quiz_average: { value: '95%' },
    study_hours: { value: '20' },
    ai_proficiency: { percentage: 90 },
  },
  timeline_groups: [
    {
      id: 'g1',
      section_title: 'Today',
      items: [
        { id: 'i1', type: 'quiz', title: 'Test Quiz' },
        { id: 'i2', type: 'lesson', title: 'Test Lesson' }
      ]
    }
  ]
};

describe('LearningHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(api.useGetHistoryOverview).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<LearningHistory />);
    expect(screen.getByText(/Đang đồng bộ nhật ký rèn luyện/i)).toBeInTheDocument();
  });

  it('renders error state when API fails', () => {
    const refetchMock = vi.fn();
    vi.mocked(api.useGetHistoryOverview).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      refetch: refetchMock,
    } as any);

    render(<LearningHistory />);
    expect(screen.getByText(/Không thể tải dữ liệu/i)).toBeInTheDocument();
    
    // Test refetch button
    const retryBtn = screen.getByRole('button', { name: /Thử tải lại ngay/i });
    fireEvent.click(retryBtn);
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders data correctly and allows filtering', () => {
    vi.mocked(api.useGetHistoryOverview).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      refetch: vi.fn(),
    } as any);

    render(<LearningHistory />);
    
    // Check if both items are rendered
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('Test Lesson')).toBeInTheDocument();

    // Click Quiz filter
    const quizFilter = screen.getByRole('button', { name: /Bài đánh giá/i });
    fireEvent.click(quizFilter);

    // Now only Test Quiz should be visible
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.queryByText('Test Lesson')).not.toBeInTheDocument();
  });
});
