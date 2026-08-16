import React, { useState, useEffect, useCallback } from 'react';
import { Conversation } from '../types';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import axios from 'axios';

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
            const newConversations = prev.map(c => c.id === conversationId ? { ...c, last_message: lastMessage } : c);
            // Sort by latest message
            return newConversations.sort((a, b) => {
                const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : new Date(a.created_at).getTime();
                const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : new Date(b.created_at).getTime();
                return dateB - dateA;
            });
        });
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.data.length > 0) {
                    const firstId = res.data.data[0].id;
                    setActiveId(firstId);
                    activeIdRef.current = firstId;
                    window.localStorage.setItem('activeChatConversationId', firstId.toString());
                    // Also clear its unread count since it's immediately opened
                    setConversations(res.data.data.map((c: any) => c.id === firstId ? { ...c, unread_count: 0 } : c));
                    window.dispatchEvent(new Event('chat-messages-read'));
                } else {
                    setConversations(res.data.data);
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
        
        // Use a dynamic import or require if getEchoInstance is exported
        const { getEchoInstance } = require('@/src/hooks/useRealtimeChat');
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
                            if (isCurrentlyActive && e.sender_id !== currentUserId) {
                                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conv.id}/read`, {}, {
                                    headers: { Authorization: `Bearer ${token}` }
                                }).catch(console.error);
                            }

                            return { 
                                ...c, 
                                last_message: e,
                                // Only increment unread if not the active conversation and message not sent by current user
                                unread_count: (!isCurrentlyActive && e.sender_id !== currentUserId) ? c.unread_count + 1 : c.unread_count
                            };
                        }
                        return c;
                    });
                    
                    // Sort by latest message
                    return newConversations.sort((a, b) => {
                        const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : new Date(a.created_at).getTime();
                        const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : new Date(b.created_at).getTime();
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
            <div className="flex h-full items-center justify-center bg-[#F4F4F8]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden bg-white shadow-sm border border-gray-200">
            {/* Sidebar remains visible on desktop, can be toggled on mobile */}
            <div className="hidden md:flex flex-col flex-shrink-0">
                <ChatSidebar 
                    conversations={conversations} 
                    activeConversationId={activeId} 
                    onSelectConversation={handleSelectConversation} 
                />
            </div>
            
            <div className="flex-1 min-w-0 h-full">
                {activeConversation ? (
                    <ChatArea 
                        key={activeConversation.id} 
                        conversation={activeConversation} 
                        currentUserId={currentUserId} 
                        token={token} 
                        onUpdateLastMessage={handleUpdateLastMessage}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-[#F4F4F8]">
                        Chọn một nhóm để bắt đầu nhắn tin
                    </div>
                )}
            </div>
        </div>
    );
};
