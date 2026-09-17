import React, { useState, useEffect, useCallback } from 'react';
import { Conversation } from '../types';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { axiosClient } from '@/src/shared/lib/axios';
import { getEchoInstance } from '@/src/hooks/useRealtimeChat';

interface ChatLayoutProps {
  token: string;
  currentUserId: number;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ token, currentUserId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeIdRef = React.useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectConversation = (id: number) => {
    setActiveId(id);
    activeIdRef.current = id;
    window.localStorage.setItem('activeChatConversationId', id.toString());
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c));
    // Trigger global unread update when marked as read
    window.dispatchEvent(new Event('chat-messages-read'));
  };

  const handleUpdateLastMessage = useCallback((conversationId: number, lastMessage: any) => {
    setConversations(prev => {
      const conv = prev.find(c => c.id === conversationId);
      // Only update if the last message ID changed or recall status changed
      if (conv && conv.last_message?.id === lastMessage?.id && conv.last_message?.is_recalled === lastMessage?.is_recalled && conv.last_message?.status === lastMessage?.status) {
        return prev; // Prevent unnecessary state update and re-render
      }

      const newConversations = prev.map(c => c.id === conversationId ? { ...c, last_message: lastMessage } : c);
      // Sort by latest message
      return newConversations.sort((a: any, b: any) => {
        const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
        const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
        return dateB - dateA;
      });
    });
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosClient.get('/api/chat/conversations');
        if (res.data?.data?.length > 0) {
          const firstId = res.data.data[0].id;
          setActiveId(firstId);
          activeIdRef.current = firstId;
          window.localStorage.setItem('activeChatConversationId', firstId.toString());
          // Also clear its unread count since it's immediately opened
          setConversations(res.data.data.map((c: any) => c.id === firstId ? { ...c, unread_count: 0 } : c));
          window.dispatchEvent(new Event('chat-messages-read'));
        } else {
          setConversations(res.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchConversations();
    }
  }, [token]);

  // Global listener for all conversations to update sidebar realtime
  useEffect(() => {
    if (!token || conversations.length === 0) return;
    
    const echo = getEchoInstance(token);
    const listeners: { channel: any, callback: any }[] = [];

    conversations.forEach(conv => {
      const channelName = `chat.conversation.${conv.id}`;
      const channel = echo.private(channelName);
      
      const onMessageSent = (e: any) => {
        setConversations(prev => {
          const newConversations = prev.map(c => {
            if (c.id === conv.id) {
              const isCurrentlyActive = activeIdRef.current === conv.id;
              
              // If active and it's from another user, mark as read immediately via API
              if (isCurrentlyActive && Number(e.sender_id) !== Number(currentUserId)) {
                axiosClient.post(`/api/chat/conversations/${conv.id}/read`).catch(console.error);
              }

              return { 
                ...c, 
                last_message: e,
                // Only increment unread if not the active conversation and message not sent by current user
                unread_count: (!isCurrentlyActive && Number(e.sender_id) !== Number(currentUserId)) ? c.unread_count + 1 : c.unread_count
              };
            }
            return c;
          });
          
          // Sort by latest message
          return newConversations.sort((a: any, b: any) => {
            const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
            const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
            return dateB - dateA;
          });
        });
      };
      
      channel.listen('ChatMessageSent', onMessageSent);
      listeners.push({ channel, callback: onMessageSent });
    });

    return () => {
      listeners.forEach(({ channel, callback }) => {
        channel.stopListening('ChatMessageSent', callback);
      });
    };
  }, [conversations.length, token, currentUserId]);

  useEffect(() => {
    return () => {
      window.localStorage.removeItem('activeChatConversationId');
    };
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);

  if (isLoading) {
    return (
      <div className="flex h-full w-full max-w-[1600px] mx-auto p-4 lg:p-6 bg-slate-50/50 animate-pulse">
        <div className="flex w-full h-full overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60">
          {/* Sidebar Skeleton */}
          <div className="hidden md:flex flex-col flex-shrink-0 border-r border-slate-100/80 w-80 lg:w-[340px]">
            <div className="p-5 border-b border-slate-100">
              <div className="h-7 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded-2xl w-full"></div>
            </div>
            <div className="flex-1 px-3 py-3 space-y-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 flex items-center gap-3.5">
                  <div className="w-[52px] h-[52px] rounded-full bg-slate-100 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-slate-100 rounded-md w-2/3 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Area Skeleton */}
          <div className="flex-1 min-w-0 h-full bg-white relative flex flex-col">
            {/* Header */}
            <div className="h-[76px] px-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                <div>
                  <div className="h-5 bg-slate-100 rounded-md w-32 mb-1.5"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-20"></div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 p-6 space-y-6 bg-slate-50/40">
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 mr-2.5"></div>
                <div className="w-1/3 h-16 bg-white border border-slate-100 rounded-2xl rounded-bl-sm"></div>
              </div>
              <div className="flex justify-end">
                <div className="w-2/5 h-20 bg-blue-50 border border-blue-100 rounded-2xl rounded-br-sm"></div>
              </div>
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 mr-2.5"></div>
                <div className="w-1/2 h-24 bg-white border border-slate-100 rounded-2xl rounded-bl-sm"></div>
              </div>
            </div>
            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="h-[52px] bg-slate-100 rounded-3xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-[1600px] mx-auto p-4 lg:p-6 bg-slate-50/50">
      <div className="flex w-full h-full overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60">
        {/* Sidebar remains visible on desktop, can be toggled on mobile */}
        <div className="hidden md:flex flex-col flex-shrink-0 border-r border-slate-100/80">
          <ChatSidebar 
            conversations={conversations} 
            activeConversationId={activeId} 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
        
        <div className="flex-1 min-w-0 h-full bg-white relative">
          {activeConversation ? (
            <ChatArea 
              key={activeConversation.id} 
              conversation={activeConversation} 
              currentUserId={currentUserId} 
              token={token} 
              onUpdateLastMessage={handleUpdateLastMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-base font-medium text-slate-500">Chọn một nhóm để bắt đầu nhắn tin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
