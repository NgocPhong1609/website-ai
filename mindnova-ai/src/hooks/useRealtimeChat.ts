import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { clientApiUrl } from '../shared/lib/api-url';

// Setup Laravel Echo instance
let echoInstance: any = null;

export const getEchoInstance = (token: string) => {
    if (!echoInstance) {
        (window as any).Pusher = Pusher;
        Pusher.logToConsole = process.env.NEXT_PUBLIC_ENABLE_PUSHER_LOGS === 'true';
        const isProd = process.env.NODE_ENV === 'production';
        let defaultHost = '127.0.0.1';
        try {
            if (process.env.NEXT_PUBLIC_API_URL) {
                // E.g. https://api.mindnova.com/api -> api.mindnova.com
                defaultHost = new URL(process.env.NEXT_PUBLIC_API_URL).hostname;
            } else if (isProd && typeof window !== 'undefined') {
                defaultHost = window.location.hostname;
            }
        } catch (e) {}

        const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT || (isProd ? 443 : 8080));

        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'mindnova_chat_key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || defaultHost,
            wsPort: port,
            wssPort: port,
            forceTLS: isProd || (process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https'),
            disableStats: true,
            enabledTransports: (isProd || process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https') ? ['ws', 'wss'] : ['ws'],
            authEndpoint: clientApiUrl('broadcasting/auth'),
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }
    return echoInstance;
};

export const useRealtimeChat = (conversationId: number, token: string | null) => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!token || !conversationId) return;

        const echo = getEchoInstance(token);
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

    const recallMessageLocally = (messageId: number) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_recalled: true } : m));
    };

    return {
        messages,
        addOptimisticMessage,
        replaceTempMessage,
        loadInitialMessages,
        recallMessageLocally,

    };
};
