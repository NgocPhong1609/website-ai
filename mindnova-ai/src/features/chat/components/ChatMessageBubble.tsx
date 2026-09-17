import React from 'react';
import { ChatMessage } from '../types';
import { InstructorChatBadge, isInstructorRole } from './InstructorChatBadge';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onRecall?: (messageId: number) => void;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ 
  message, 
  isOwn, 
  onRecall, 
  isFirstInGroup = true, 
  isLastInGroup = true 
}) => {
  // Relax frontend time check to 24h to avoid clock skew issues; backend strictly enforces 1h
  const isRecallable = isOwn && !message.is_recalled && (Math.abs(Date.now() - new Date(message.created_at).getTime()) < 24 * 60 * 60 * 1000);
  const isInstructor = !isOwn && isInstructorRole(message.sender?.role);

  if (message.is_recalled) {
    return (
      <div className={`flex w-full ${isLastInGroup ? 'mb-4' : 'mb-1'} ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {!isOwn && (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 mt-auto mb-1">
            {message.sender?.avatar_url ? (
              <img src={message.sender.avatar_url} alt={message.sender.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                {message.sender?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        )}
        <div className={`max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && isFirstInGroup && (
            <div className="mb-1 ml-1 flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-500">{message.sender?.name}</span>
              <InstructorChatBadge role={message.sender?.role} />
            </div>
          )}
          <div className="px-4 py-2 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 italic text-xs text-center">
            Tin nhắn đã bị thu hồi
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex w-full ${isLastInGroup ? 'mb-3' : 'mb-1'} ${isOwn ? 'justify-end' : 'justify-start'} relative group items-end`}
    >
      {!isOwn && (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2.5 flex-shrink-0 mb-1 shadow-sm border border-slate-200/50">
          {isFirstInGroup ? (
            message.sender?.avatar_url ? (
              <img src={message.sender.avatar_url} alt={message.sender.name} className="w-full h-full object-cover bg-slate-100" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-[11px] font-bold bg-gradient-to-br from-slate-100 to-slate-200">
                {message.sender?.name?.charAt(0) || 'U'}
              </div>
            )
          ) : null}
        </div>
      )}
      
      {isOwn && isRecallable && onRecall && (
        <button
          onClick={() => {
            if (confirm("Bạn có chắc chắn muốn thu hồi tin nhắn này?")) {
              onRecall(message.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 mr-2 mb-1 text-gray-400 hover:text-[#2563EB] hover:bg-[#EFF6FF] flex items-center justify-center p-1.5 rounded-full bg-white shadow-md border border-gray-200 cursor-pointer"
          title="Thu hồi tin nhắn"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
      )}

      <div className={`max-w-[70%] sm:max-w-[65%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && isFirstInGroup && (
          <div className="mb-1.5 ml-1 flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-slate-600">{message.sender?.name}</span>
            <InstructorChatBadge role={message.sender?.role} />
          </div>
        )}
        
        <div 
          className={`relative px-4 py-2.5 rounded-2xl transition-all ${
            isOwn 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm shadow-[0_4px_12px_-4px_rgba(59,130,246,0.4)]' 
              : isInstructor
                ? 'bg-blue-50/80 border border-blue-100/50 text-slate-800 rounded-bl-sm shadow-[0_2px_10px_-4px_rgba(59,130,246,0.1)]'
                : 'bg-white border border-slate-100/80 text-slate-800 rounded-bl-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]'
          }`}
        >
          {message.content && (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words select-text">
              {message.content}
            </p>
          )}
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(attachment => (
                attachment.mime_type?.startsWith('image/') ? (
                  <a key={attachment.id} href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={attachment.file_url} 
                      alt={attachment.file_name} 
                      className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ maxHeight: '200px' }}
                    />
                  </a>
                ) : (
                  <a 
                    key={attachment.id} 
                    href={attachment.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${isOwn ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="truncate">{attachment.file_name}</span>
                  </a>
                )
              ))}
            </div>
          )}

          {isLastInGroup && (
            <div className={`text-[10px] flex items-center justify-end mt-1.5 gap-1.5 font-medium ${isOwn ? 'text-white/80' : 'text-slate-400'}`}>
              <span>
                {new Date(message.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {isOwn && message.status === 'sending' && (
                <svg className="w-3 h-3 animate-spin text-white/80" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {isOwn && message.status === 'sent' && (
                <svg className="w-3.5 h-3.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isOwn && message.status === 'failed' && (
                <span className="text-blue-100 font-bold" title="Lỗi khi gửi">!</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
