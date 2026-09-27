import React from 'react';
import { Conversation } from '../types';
import { MoreVertical, Search } from "lucide-react";

interface ChatHeaderProps {
 conversation: Conversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
 return (
 <div className="h-[76px] px-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between flex-shrink-0 z-10 sticky top-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200/50">
 {conversation.course?.thumbnail ? (
 <img src={conversation.course.thumbnail} alt={conversation.title || ''} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg bg-gradient-to-br from-slate-100 to-slate-200">
 {conversation.title?.charAt(0) || 'G'}
 </div>
 )}
 </div>
 <div>
 <h2 className="text-[17px] font-bold text-slate-900 leading-tight">{conversation.title}</h2>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
 <p className="text-[13px] font-medium text-slate-500">
 {conversation.type === 'course' ? 'Nhóm lớp học' : 'Trao đổi trực tiếp'}
 </p>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-2.5">
 <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 border border-transparent hover:border-blue-100">
 <Search className="w-5 h-5" aria-hidden />
 </button>
 <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 border border-transparent hover:border-blue-100">
 <MoreVertical className="w-5 h-5" aria-hidden />
 </button>
 </div>
 </div>
 );
};
