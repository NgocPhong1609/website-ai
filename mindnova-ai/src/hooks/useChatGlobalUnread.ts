import { useEffect, useState } from 'react';
import { axiosClient } from '@/src/shared/lib/axios';

export const useChatGlobalUnread = (token: string | null, userId: number | null) => {
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // Initial fetch
    useEffect(() => {
        if (!token) return;
        
        const fetchUnreadCount = async () => {
            try {
                const res = await axiosClient.get('/api/chat/unread-count', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data?.data?.unread_count !== undefined) {
                    setUnreadCount(res.data.data.unread_count);
                }
            } catch (error) {
                console.error("Failed to fetch chat unread count", error);
            }
        };

        fetchUnreadCount();
        
        // Setup listener for custom events from ChatLayout to decrement
        const handleReadEvent = () => {
            fetchUnreadCount();
        };
        window.addEventListener('chat-messages-read', handleReadEvent);
        return () => window.removeEventListener('chat-messages-read', handleReadEvent);
    }, [token]);

    // WebSocket listener
    useEffect(() => {
        if (!token || !userId) return;

        const { getEchoInstance } = require('@/src/hooks/useRealtimeChat');
        const echo = getEchoInstance(token);
        const channelName = `App.Models.User.${userId}`;
        
        const channel = echo.private(channelName);

        channel.listen('ChatMessageSent', (e: any) => {
            // Check if user is currently looking at this conversation
            // If they are, ChatLayout will handle marking it as read
            const activeChatId = window.localStorage.getItem('activeChatConversationId');
            if (activeChatId && parseInt(activeChatId) === e.chat_conversation_id) {
                // Don't increment since it will be marked as read immediately
                return;
            }
            
            // Increment unread count
            setUnreadCount(prev => prev + 1);
        });

        // ChatMessageRecalled might be received globally
        channel.listen('ChatMessageRecalled', (e: any) => {
            // Optional: You could fetch the unread count again to be safe
            // We just trigger a refetch
            axiosClient.get('/api/chat/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data?.data?.unread_count !== undefined) {
                    setUnreadCount(res.data.data.unread_count);
                }
            }).catch(console.error);
        });

        return () => {
            echo.leave(channelName);
        };
    }, [token, userId]);

    return unreadCount;
};
