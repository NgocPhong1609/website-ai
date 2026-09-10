import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChatMessageBubble } from '../ChatMessageBubble';
import type { ChatMessage } from '../../types';

const message = (role?: string | null): ChatMessage => ({
  id: 10,
  chat_conversation_id: 3,
  sender_id: 2,
  content: 'Please review this lesson',
  type: 'text',
  created_at: '2026-09-10T08:00:00.000Z',
  sender: {
    id: 2,
    name: 'Minh Anh',
    avatar_url: null,
    role,
  },
});

describe('ChatMessageBubble instructor identity', () => {
  it.each(['teacher', ' Instructor '])('shows an accessible instructor badge for the %s role', (role) => {
    render(<ChatMessageBubble message={message(role)} isOwn={false} />);

    expect(screen.getByText('Giảng viên')).toHaveAttribute('aria-label', 'Giảng viên');
  });

  it('uses distinct styling for an incoming instructor message', () => {
    render(<ChatMessageBubble message={message('teacher')} isOwn={false} />);

    expect(screen.getByText('Please review this lesson').parentElement).toHaveClass('bg-indigo-50');
  });

  it.each([['student'], [null], [undefined]])('does not badge an ordinary or legacy role (%s)', (role) => {
    render(<ChatMessageBubble message={message(role)} isOwn={false} />);

    expect(screen.queryByText('Giảng viên')).not.toBeInTheDocument();
  });

  it('renders optimistic messages without authoritative sender data safely', () => {
    const optimistic: ChatMessage = {
      ...message(),
      sender: undefined,
      sender_id: 7,
      status: 'sending',
    };

    render(<ChatMessageBubble message={optimistic} isOwn />);

    expect(screen.getByText('Please review this lesson')).toBeInTheDocument();
    expect(screen.queryByText('Giảng viên')).not.toBeInTheDocument();
  });
});
