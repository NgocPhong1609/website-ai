import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Laravel Echo instance
let echoInstance: Echo | null = null;

export const getEchoInstance = (token: string) => {
    if (!echoInstance) {
        window.Pusher = Pusher;
        Pusher.logToConsole = true; // Enable debugging
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/broadcasting/auth`,
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

        channel.listen('ChatMessageSent', (e: any) => {
            // Check if message is already in state (e.g. from optimistic UI)
            setMessages(prev => {
                const exists = prev.find(m => m.id === e.id);
                if (exists) {
                    return prev.map(m => m.id === e.id ? { ...m, ...e, status: 'sent' } : m);
                }
                return [...prev, { ...e, status: 'sent' }];
            });
        });

        channel.listen('ChatMessageRecalled', (e: any) => {
            setMessages(prev => prev.map(m => m.id === e.message.id ? { ...m, is_recalled: true } : m));
        });

        return () => {
            echo.leave(channelName);
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
