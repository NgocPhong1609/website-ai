import React, { useState } from 'react';
import { Conversation } from '../types';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (id: number) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ conversations, activeConversationId, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv => 
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    conv.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 lg:w-[340px] h-full bg-white flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tin nhắn</h2>
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhóm chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 border-transparent bg-slate-100/80 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            {searchTerm ? 'Không tìm thấy nhóm phù hợp.' : 'Chưa có nhóm nào.'}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3.5 transition-all duration-200 group ${
                  isActive ? 'bg-blue-50 border border-blue-100/50 shadow-sm' : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200/50">
                  {conv.course?.thumbnail ? (
                    <img src={conv.course.thumbnail} alt={conv.title || undefined} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg bg-gradient-to-br from-slate-100 to-slate-200">
                      {conv.title?.charAt(0) || 'G'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-blue-950' : 'text-slate-800'}`}>
                      {conv.title}
                    </h3>
                    {conv.last_message && (
                      <span className={`text-[11px] shrink-0 font-medium ${isActive ? 'text-blue-600/80' : 'text-slate-400'}`}>
                        {new Date(conv.last_message.created_at).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-[13px] truncate ${isActive ? 'text-blue-800/70 font-medium' : 'text-slate-500'}`}>
                      {conv.last_message?.content || 'Chưa có tin nhắn...'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-blue-500/20 shrink-0">
                        {conv.unread_count > 99 ? '99+' : conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

