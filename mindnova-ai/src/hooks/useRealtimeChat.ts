import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Laravel Echo instance
let echoInstance: any = null;
let currentEchoToken: string | null = null;

export const getEchoInstance = (token: string) => {
    if (!echoInstance || currentEchoToken !== token) {
        if (echoInstance) {
            try {
                echoInstance.disconnect();
            } catch (err) {
                console.warn("[Echo] Disconnect previous instance error:", err);
            }
        }
        currentEchoToken = token;
        (window as any).Pusher = Pusher;
        Pusher.logToConsole = process.env.NEXT_PUBLIC_ENABLE_PUSHER_LOGS === 'true';
        const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080);
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'mindnova_chat_key',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: port,
            wssPort: port,
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
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [connectionState, setConnectionState] = useState<string>('connected');

    useEffect(() => {
        if (!token || !conversationId) return;

        const echo = getEchoInstance(token);
        const channelName = `chat.conversation.${conversationId}`;
        
        const channel = echo.private(channelName);

        // Connection state tracking
        const pusher = echo.connector?.pusher;
        const handleStateChange = (states: { previous: string; current: string }) => {
            setConnectionState(states.current);
            setIsConnected(states.current === 'connected');
            if (states.current === 'disconnected' || states.current === 'unavailable' || states.current === 'failed') {
                console.warn(`[RealtimeChat] WebSocket state changed: ${states.previous} -> ${states.current}`);
            }
        };

        if (pusher?.connection) {
            setIsConnected(pusher.connection.state === 'connected');
            setConnectionState(pusher.connection.state);
            pusher.connection.bind('state_change', handleStateChange);
        }

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
            if (pusher?.connection) {
                pusher.connection.unbind('state_change', handleStateChange);
            }
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

    const reconnect = () => {
        if (token) {
            const echo = getEchoInstance(token);
            echo.connector?.pusher?.connect();
        }
    };

    return {
        messages,
        isConnected,
        connectionState,
        reconnect,
        addOptimisticMessage,
        replaceTempMessage,
        loadInitialMessages,
        recallMessageLocally,
    };
};
