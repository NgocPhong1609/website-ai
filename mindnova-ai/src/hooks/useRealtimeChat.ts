import { useEffect, useState, useSyncExternalStore } from 'react';
import { getEcho, getRealtimeStatus, subscribeRealtimeStatus, type RealtimeStatus } from '../shared/lib/realtime';

/** Echo client for this token, or null when realtime is disabled/unreachable (callers must poll). */
export const getEchoInstance = (token: string) => getEcho(token);

/** Current realtime connection state; anything but "connected" means callers should poll. */
export const useRealtimeStatus = (): RealtimeStatus =>
    useSyncExternalStore(subscribeRealtimeStatus, getRealtimeStatus, () => 'disabled');

export const useRealtimeChat = (conversationId: number, token: string | null) => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!token || !conversationId) return;

        const echo = getEchoInstance(token);
        if (!echo) return;
        const channelName = `chat.conversation.${conversationId}`;
        
        const channel = echo.private(channelName);

        const onMessageSent = (e: any) => {
            // Check if message is already in state (e.g. from optimistic UI)
            setMessages(prev => {
                const exists = prev.find(m => m.id === e.id);
                if (exists) {
                    return prev.map(m => m.id === e.id ? { ...m, ...e, status: 'sent' } : m);
                }
                return [...prev, { ...e, status: 'sent' }];
            });
        };

        const onMessageRecalled = (e: any) => {
            setMessages(prev => prev.map(m => m.id === e.message.id ? { ...m, is_recalled: true } : m));
        };

        channel.listen('ChatMessageSent', onMessageSent);
        channel.listen('ChatMessageRecalled', onMessageRecalled);

        return () => {
            channel.stopListening('ChatMessageSent', onMessageSent);
            channel.stopListening('ChatMessageRecalled', onMessageRecalled);
            // Do not call echo.leave(channelName) here because ChatLayout is also listening to this channel for unread updates!
        };
    }, [conversationId, token]);

    const addOptimisticMessage = (message: any) => {
        setMessages(prev => [...prev, { ...message, status: 'sending' }]);
    };

    const replaceTempMessage = (tempId: number, realMessage: any) => {
        setMessages(prev => {
            const alreadyExists = prev.find(m => m.id === realMessage.id);
            if (alreadyExists) {
                // WebSocket beat the API response: remove the temp message, keep the real one
                return prev.filter(m => m.tempId !== tempId && m.id !== tempId).map(m => m.id === realMessage.id ? { ...m, ...realMessage, status: 'sent' } : m);
            } else {
                // API response arrived first: replace the temp message
                return prev.map(m => m.tempId === tempId || m.id === tempId ? { ...realMessage, status: 'sent' } : m);
            }
        });
    };

    const loadInitialMessages = (initialMessages: any[]) => {
        setMessages(initialMessages.map(m => ({ ...m, status: 'sent' })));
    };

    /** Upsert messages fetched while polling; keeps unsent optimistic messages. */
    const mergeServerMessages = (serverMessages: any[]) => {
        setMessages(prev => {
            const byId = new Map(prev.filter(m => m.status !== 'sending').map(m => [m.id, m]));
            serverMessages.forEach(m => byId.set(m.id, { ...byId.get(m.id), ...m, status: 'sent' }));
            const pending = prev.filter(m => m.status === 'sending' && !serverMessages.some(s => s.id === m.id));
            const merged = [...byId.values()].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime() || Number(a.id) - Number(b.id));
            const unchanged = merged.length + pending.length === prev.length
                && merged.every((m, i) => prev[i] && prev[i].id === m.id && prev[i].is_recalled === m.is_recalled);
            return unchanged ? prev : [...merged, ...pending];
        });
    };

    const recallMessageLocally = (messageId: number) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_recalled: true } : m));
    };

    return {
        messages,
        addOptimisticMessage,
        replaceTempMessage,
        loadInitialMessages,
        recallMessageLocally,
        mergeServerMessages,
    };
};
