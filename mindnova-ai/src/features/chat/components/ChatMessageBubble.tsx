import React from 'react';
import { ChatMessage } from '../types';

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
            <span className="text-xs text-gray-500 mb-1 ml-1 font-medium">
              {message.sender?.name}
            </span>
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
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mb-1">
          {isFirstInGroup ? (
            message.sender?.avatar_url ? (
              <img src={message.sender.avatar_url} alt={message.sender.name} className="w-full h-full object-cover bg-gray-200" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold bg-gray-200">
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
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 mr-2 mb-1 text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center p-1.5 rounded-full bg-white shadow-md border border-gray-200 cursor-pointer"
          title="Thu hồi tin nhắn"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
      )}

      <div className={`max-w-[70%] sm:max-w-[65%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && isFirstInGroup && (
          <span className="text-[11px] text-gray-500 mb-1 ml-1 font-medium">
            {message.sender?.name}
          </span>
        )}
        
        <div 
          className={`relative px-4 py-2.5 rounded-2xl shadow-sm transition-all ${
            isOwn 
              ? 'bg-[#C0392B] text-white rounded-br-xs' 
              : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-xs'
          }`}
        >
          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
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
            <div className={`text-[10px] flex items-center justify-end mt-1 gap-1.5 font-medium ${isOwn ? 'text-white/80' : 'text-gray-400'}`}>
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
                <span className="text-red-200 font-bold" title="Lỗi khi gửi">!</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
