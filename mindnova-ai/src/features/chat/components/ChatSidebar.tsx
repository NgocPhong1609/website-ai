import React from 'react';
import { Conversation } from '../types';

interface ChatSidebarProps {
    conversations: Conversation[];
    activeConversationId: number | null;
    onSelectConversation: (id: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, activeConversationId, onSelectConversation }) => {
    return (
        <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Tin nhắn</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Chưa có nhóm nào.</div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors ${activeConversationId === conv.id ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {conv.course?.thumbnail ? (
                                    <img src={conv.course.thumbnail} alt={conv.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                        {conv.title?.charAt(0) || 'G'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-semibold text-gray-800 truncate">{conv.title}</h3>
                                    {conv.last_message && (
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            {new Date(conv.last_message.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 truncate">
                                        {conv.last_message?.content || 'Chưa có tin nhắn'}
                                    </p>
                                    {conv.unread_count > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
