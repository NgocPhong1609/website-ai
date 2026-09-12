import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatArea } from '../ChatArea';
import type { Conversation } from '../../types';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

const realtime = vi.hoisted(() => ({
  messages: [],
  addOptimisticMessage: vi.fn(),
  replaceTempMessage: vi.fn(),
  loadInitialMessages: vi.fn(),
  recallMessageLocally: vi.fn(),
}));

vi.mock('@/src/shared/lib/axios', () => ({
  axiosClient: api,
}));

vi.mock('@/src/hooks/useRealtimeChat', () => ({
  useRealtimeChat: () => realtime,
}));

const conversation: Conversation = {
  id: 3,
  course_id: null,
  title: 'Course chat',
  type: 'group',
  unread_count: 0,
};

describe('ChatArea loading identity', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    api.get.mockReset();
    api.post.mockReset();
    realtime.loadInitialMessages.mockReset();
  });

  it('stays neutral before authoritative messages finish loading', () => {
    api.get.mockImplementation(() => new Promise(() => undefined));

    render(<ChatArea conversation={conversation} currentUserId={7} token="token" />);

    expect(api.get).toHaveBeenCalledWith('/api/chat/conversations/3/messages');
    expect(screen.queryByText('Giảng viên')).not.toBeInTheDocument();
  });
});
