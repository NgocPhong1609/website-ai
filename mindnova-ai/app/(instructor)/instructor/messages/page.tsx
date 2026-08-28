'use client';

import React from 'react';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { ChatLayout } from '@/src/features/chat/components/ChatLayout';

export default function InstructorMessagesPage() {
 const { user, token } = useAuth();

 if (!user || !token) return null;

 return (
 <div className="h-full w-full">
 <ChatLayout token={token} currentUserId={user.id} />
 </div>
 );
}
