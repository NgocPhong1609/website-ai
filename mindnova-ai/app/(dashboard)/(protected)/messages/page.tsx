'use client';

import React from 'react';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { ChatLayout } from '@/src/features/chat/components/ChatLayout';

export default function StudentMessagesPage() {
    const { user, token } = useAuth();

    if (!user || !token) return null;

    return (
        <div className="h-full w-full" style={{ height: 'calc(100vh - 80px)' }}>
            <ChatLayout token={token} currentUserId={user.id} />
        </div>
    );
}
