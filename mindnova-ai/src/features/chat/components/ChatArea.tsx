import React, { useEffect, useRef, useState } from 'react';
import { Conversation, ChatMessage as ChatMessageType } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatInput } from './ChatInput';
import { useRealtimeChat } from '../../../hooks/useRealtimeChat';
import { axiosClient } from '@/src/shared/lib/axios';

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

 const scrollToBottom = (force: boolean = false) => {
 if (!messagesEndRef.current) return;
 
 if (force) {
 messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
 return;
 }

 // Smart scroll: only scroll down if we are already near the bottom (within 150px)
 const container = messagesEndRef.current.parentElement;
 if (container) {
 const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
 if (isNearBottom) {
 messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
 }
 }
 };

 useEffect(() => {
 // Fetch initial messages
 const fetchMessages = async () => {
 try {
 setIsLoading(true);
 const res = await axiosClient.get(`/api/chat/conversations/${conversation.id}/messages`);
 loadInitialMessages(res.data?.data || []);
 
  // Mark as read asynchronously
  axiosClient.post(`/api/chat/conversations/${conversation.id}/read`).catch(console.error);
 
 // Force scroll to bottom on initial load
 setTimeout(() => scrollToBottom(true), 100);
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
 // When new messages arrive, use smart auto-scroll
 scrollToBottom(false);
 }, [messages.length]);

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
 const res = await axiosClient.post(
 `/api/chat/conversations/${conversation.id}/messages`,
 formData
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
 await axiosClient.post(
 `/api/chat/conversations/${conversation.id}/messages/${messageId}/recall`
 );
 recallMessageLocally(messageId);
 } catch (error) {
 console.error("Failed to recall message", error);
 alert("Không thể thu hồi tin nhắn này.");
 }
 };

  return (
  <div className="flex-1 flex flex-col h-full bg-slate-50/40 relative">
 <ChatHeader conversation={conversation} />
 
  <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-8">
  {isLoading ? (
  <div className="flex justify-center items-center h-full">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
  ) : messages.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-full text-slate-400">
  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </div>
  <p className="text-[15px] font-medium text-slate-500">Chưa có tin nhắn nào. Bắt đầu trao đổi ngay!</p>
  </div>
 ) : (
 messages.map((msg, idx) => {
 const isOwn = Number(msg.sender_id) === Number(currentUserId);
 
 const currentDt = new Date(msg.created_at);
 const prevMsg = idx > 0 ? messages[idx - 1] : null;
 const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
 
 let showSeparator = false;
 let separatorText = '';
 
 if (!prevMsg) {
 showSeparator = true;
 separatorText = currentDt.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
 } else {
 const prevDt = new Date(prevMsg.created_at);
 const diffMinutes = (currentDt.getTime() - prevDt.getTime()) / (1000 * 60);
 
 const isDifferentDate = currentDt.toDateString() !== prevDt.toDateString();
 const isDifferentYear = currentDt.getFullYear() !== prevDt.getFullYear();
 
 if (isDifferentDate) {
 showSeparator = true;
 separatorText = currentDt.toLocaleDateString('vi-VN', { 
 weekday: 'long', 
 month: 'long', 
 day: 'numeric',
 year: isDifferentYear ? 'numeric' : undefined
 });
 } else if (diffMinutes >= 10) {
 showSeparator = true;
 separatorText = currentDt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
 }
 }

 const nextDt = nextMsg ? new Date(nextMsg.created_at) : null;
 const diffToNext = nextDt ? (nextDt.getTime() - currentDt.getTime()) / (1000 * 60) : 0;
 
 const isFirstInGroup = !prevMsg || Number(prevMsg.sender_id) !== Number(msg.sender_id) || showSeparator;
 const isLastInGroup = !nextMsg || Number(nextMsg.sender_id) !== Number(msg.sender_id) || diffToNext >= 10 || nextDt?.toDateString() !== currentDt.toDateString();

 return (
 <React.Fragment key={msg.id || msg.tempId}>
  {showSeparator && (
  <div className="flex justify-center my-8">
  <span className="text-slate-500 text-[11px] font-semibold px-3 py-1 rounded-full bg-white border border-slate-200/60 shadow-sm">
  {separatorText}
  </span>
  </div>
  )}
 <ChatMessageBubble 
 message={msg} 
 isOwn={isOwn} 
 onRecall={handleRecallMessage}
 isFirstInGroup={isFirstInGroup}
 isLastInGroup={isLastInGroup}
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
