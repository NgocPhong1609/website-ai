import React from 'react';

export function isInstructorRole(role: string | null | undefined): boolean {
  if (typeof role !== 'string') return false;

  return ['teacher', 'instructor'].includes(role.trim().toLowerCase());
}

interface InstructorChatBadgeProps {
  role?: string | null;
}

export function InstructorChatBadge({ role }: InstructorChatBadgeProps) {
  if (!isInstructorRole(role)) return null;

  return (
    <span
      aria-label="Giảng viên"
      className="inline-flex shrink-0 items-center rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-indigo-700"
    >
      Giảng viên
    </span>
  );
}
