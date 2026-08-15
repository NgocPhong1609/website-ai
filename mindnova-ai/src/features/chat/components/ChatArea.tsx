import React, { useEffect, useRef, useState } from 'react';
import { Conversation, ChatMessage as ChatMessageType } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatInput } from './ChatInput';
import { useRealtimeChat } from '../../../hooks/useRealtimeChat';
import axios from 'axios';

interface ChatAreaProps {
    conversation: Conversation;
    currentUserId: number;
    token: string;
    onUpdateLastMessage?: (conversationId: number, lastMessage: any) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ conversation, currentUserId, token, onUpdateLastMessage }) => {
    const { messages, addOptimisticMessage, replaceTempMessage, loadInitialMessages, recallMessageLocally } = useRealtimeChat(conversation.id, token);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conversation.id}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                loadInitialMessages(res.data.data);
                
                // Mark as read
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conversation.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [conversation.id, token]);

    useEffect(() => {
        if (messages.length > 0 && onUpdateLastMessage) {
            const lastMessage = messages[messages.length - 1];
            onUpdateLastMessage(conversation.id, lastMessage);
        }
    }, [messages, conversation.id, onUpdateLastMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string, file?: File | null) => {
        const formData = new FormData();
        if (content) formData.append('content', content);
        if (file) {
            formData.append('file', file);
            formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');
        } else {
            formData.append('type', 'text');
        }

        // Optimistic UI
        const tempId = Date.now();
        const tempMessage: ChatMessageType = {
            id: tempId, // Temp ID
            tempId: tempId,
            chat_conversation_id: conversation.id,
            sender_id: currentUserId,
            content: content,
            type: file ? (file.type.startsWith('image/') ? 'image' : 'file') : 'text',
            created_at: new Date().toISOString(),
            status: 'sending'
        };

        addOptimisticMessage(tempMessage);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conversation.id}/messages`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            // Replace the optimistic temp message with the actual saved message to prevent duplicates from WebSocket
            if (res.data && res.data.data) {
                replaceTempMessage(tempId, res.data.data);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            // Handling failed status can be improved, but for now optimistic UI handles basic sending status
        }
    };

    const handleRecallMessage = async (messageId: number) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conversation.id}/messages/${messageId}/recall`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            recallMessageLocally(messageId);
        } catch (error) {
            console.error("Failed to recall message", error);
            alert("Không thể thu hồi tin nhắn này.");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F4F4F8]">
            <ChatHeader conversation={conversation} />
            
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>Chưa có tin nhắn nào. Bắt đầu trao đổi ngay!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isOwn = msg.sender_id === currentUserId;
                        const showDate = idx === 0 || new Date(messages[idx - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
                        
                        return (
                            <React.Fragment key={msg.id || msg.tempId}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                                            {new Date(msg.created_at).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                                <ChatMessageBubble 
                                    message={msg} 
                                    isOwn={isOwn} 
                                    onRecall={handleRecallMessage}
                                />
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};
