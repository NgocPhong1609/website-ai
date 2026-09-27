'use client';

import React from 'react';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { ChatLayout } from '@/src/features/chat/components/ChatLayout';
import { Skeleton } from '@/src/shared/components/ui/Skeleton';

function MessagesSkeleton() {
 return (
 <div role="status" aria-busy="true" aria-label="Đang tải tin nhắn" className="flex h-full w-full max-w-[1600px] mx-auto p-4 lg:p-6">
 <div className="flex w-full h-full overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60">
 <div className="hidden md:flex flex-col w-80 lg:w-[340px] border-r border-slate-100 p-5 gap-4">
 <Skeleton className="h-7 w-1/3" />
 <Skeleton className="h-10 w-full rounded-2xl" />
 {Array.from({ length: 6 }).map((_, i) => (
 <div key={i} className="flex items-center gap-3.5">
 <Skeleton className="h-12 w-12 rounded-full shrink-0" />
 <div className="flex-1 space-y-2">
 <Skeleton className="h-4 w-2/3" />
 <Skeleton className="h-3 w-1/2" />
 </div>
 </div>
 ))}
 </div>
 <div className="flex-1 flex flex-col p-6 gap-5">
 <Skeleton className="h-10 w-1/3" />
 <div className="flex-1" />
 <Skeleton className="h-12 w-full rounded-2xl" />
 </div>
 </div>
 </div>
 );
}

export default function InstructorMessagesPage() {
 const { user, token } = useAuth();

 if (!user || !token) return <MessagesSkeleton />;

 return (
 <div className="h-full w-full">
 <ChatLayout token={token} currentUserId={user.id} />
 </div>
 );
}
